import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying SLAEscrow with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));

  const oracleAddress = process.env.ORACLE_ADDRESS || deployer.address;
  console.log("Oracle address:", oracleAddress);

  const SLAEscrow = await ethers.getContractFactory("SLAEscrow");
  const escrow = await SLAEscrow.deploy(oracleAddress);

  await escrow.waitForDeployment();

  const address = await escrow.getAddress();
  console.log("SLAEscrow deployed to:", address);
  console.log("\nNext steps:");
  console.log("1. Save contract address to .env: SLA_ESCROW_CONTRACT_ADDRESS=" + address);
  console.log("2. Verify on Etherscan:");
  console.log(`   npx hardhat verify --network sepolia ${address} ${oracleAddress}`);
  console.log("3. Fund oracle wallet with Sepolia ETH from faucet");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
