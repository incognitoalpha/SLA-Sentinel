import { expect } from "chai";
import { ethers } from "hardhat";
import { SLAEscrow } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("SLAEscrow", function () {
  let escrow: SLAEscrow;
  let owner: SignerWithAddress;
  let oracle: SignerWithAddress;
  let payer: SignerWithAddress;
  let payee: SignerWithAddress;
  let other: SignerWithAddress;

  const agreementId = 1;
  const depositAmount = ethers.parseEther("1.0");

  beforeEach(async function () {
    [owner, oracle, payer, payee, other] = await ethers.getSigners();

    const SLAEscrow = await ethers.getContractFactory("SLAEscrow");
    escrow = await SLAEscrow.deploy(oracle.address);
    await escrow.waitForDeployment();
  });

  describe("createEscrow", function () {
    it("accepts payment and emits EscrowCreated with correct params", async function () {
      await expect(
        escrow.connect(payer).createEscrow(agreementId, payee.address, { value: depositAmount })
      )
        .to.emit(escrow, "EscrowCreated")
        .withArgs(agreementId, payer.address, payee.address, depositAmount);

      const escrowData = await escrow.escrows(agreementId);
      expect(escrowData.payer).to.equal(payer.address);
      expect(escrowData.payee).to.equal(payee.address);
      expect(escrowData.amount).to.equal(depositAmount);
      expect(escrowData.settled).to.be.false;
    });

    it("reverts if no funds sent", async function () {
      await expect(
        escrow.connect(payer).createEscrow(agreementId, payee.address, { value: 0 })
      ).to.be.revertedWith("Must send funds");
    });

    it("reverts if escrow already exists", async function () {
      await escrow.connect(payer).createEscrow(agreementId, payee.address, { value: depositAmount });

      await expect(
        escrow.connect(payer).createEscrow(agreementId, payee.address, { value: depositAmount })
      ).to.be.revertedWith("Escrow already exists");
    });
  });

  describe("recordOutcome", function () {
    beforeEach(async function () {
      await escrow.connect(payer).createEscrow(agreementId, payee.address, { value: depositAmount });
    });

    it("reverts when called by non-oracle", async function () {
      await expect(
        escrow.connect(other).recordOutcome(agreementId, false)
      ).to.be.revertedWith("Only oracle can call");
    });

    it("allows oracle to record outcome and emits event", async function () {
      await expect(
        escrow.connect(oracle).recordOutcome(agreementId, false)
      )
        .to.emit(escrow, "OutcomeRecorded")
        .withArgs(agreementId, false);

      const escrowData = await escrow.escrows(agreementId);
      expect(escrowData.settled).to.be.true;
      expect(escrowData.breached).to.be.false;
    });

    it("reverts if outcome already recorded", async function () {
      await escrow.connect(oracle).recordOutcome(agreementId, false);

      await expect(
        escrow.connect(oracle).recordOutcome(agreementId, true)
      ).to.be.revertedWith("Already settled");
    });

    it("reverts if escrow not found", async function () {
      const unknownId = 999;

      await expect(
        escrow.connect(oracle).recordOutcome(unknownId, false)
      ).to.be.revertedWith("Escrow does not exist");
    });
  });

  describe("withdraw - no breach (SLA met)", function () {
    beforeEach(async function () {
      await escrow.connect(payer).createEscrow(agreementId, payee.address, { value: depositAmount });
      await escrow.connect(oracle).recordOutcome(agreementId, false);
    });

    it("allows payee to withdraw full amount", async function () {
      const payeeBalanceBefore = await ethers.provider.getBalance(payee.address);

      const tx = await escrow.connect(payee).withdraw(agreementId);
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const payeeBalanceAfter = await ethers.provider.getBalance(payee.address);

      expect(payeeBalanceAfter).to.equal(payeeBalanceBefore + depositAmount - gasUsed);

      const escrowData = await escrow.escrows(agreementId);
      expect(escrowData.amount).to.equal(0);
    });

    it("reverts if payer tries to withdraw", async function () {
      await expect(
        escrow.connect(payer).withdraw(agreementId)
      ).to.be.revertedWith("Only payee can withdraw on success");
    });
  });

  describe("withdraw - breached (SLA failed)", function () {
    beforeEach(async function () {
      await escrow.connect(payer).createEscrow(agreementId, payee.address, { value: depositAmount });
      await escrow.connect(oracle).recordOutcome(agreementId, true);
    });

    it("allows payer to withdraw (refund)", async function () {
      const payerBalanceBefore = await ethers.provider.getBalance(payer.address);

      const tx = await escrow.connect(payer).withdraw(agreementId);
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;

      const payerBalanceAfter = await ethers.provider.getBalance(payer.address);

      expect(payerBalanceAfter).to.equal(payerBalanceBefore + depositAmount - gasUsed);

      const escrowData = await escrow.escrows(agreementId);
      expect(escrowData.amount).to.equal(0);
    });

    it("reverts if payee tries to withdraw", async function () {
      await expect(
        escrow.connect(payee).withdraw(agreementId)
      ).to.be.revertedWith("Only payer can withdraw on breach");
    });
  });

  describe("withdraw - edge cases", function () {
    it("reverts if outcome not recorded", async function () {
      await escrow.connect(payer).createEscrow(agreementId, payee.address, { value: depositAmount });

      await expect(
        escrow.connect(payee).withdraw(agreementId)
      ).to.be.revertedWith("Not settled yet");
    });

    it("reverts on second withdrawal attempt", async function () {
      await escrow.connect(payer).createEscrow(agreementId, payee.address, { value: depositAmount });
      await escrow.connect(oracle).recordOutcome(agreementId, false);
      await escrow.connect(payee).withdraw(agreementId);

      await expect(
        escrow.connect(payee).withdraw(agreementId)
      ).to.be.revertedWith("Already withdrawn");
    });
  });

  describe("setOracle", function () {
    it("allows owner to update oracle", async function () {
      const newOracle = other.address;

      await escrow.connect(owner).setOracle(newOracle);

      expect(await escrow.oracle()).to.equal(newOracle);
    });

    it("reverts when non-owner tries to set oracle", async function () {
      await expect(
        escrow.connect(other).setOracle(other.address)
      ).to.be.reverted;
    });

    it("reverts if zero address provided", async function () {
      await expect(
        escrow.connect(owner).setOracle(ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid oracle address");
    });
  });
});
