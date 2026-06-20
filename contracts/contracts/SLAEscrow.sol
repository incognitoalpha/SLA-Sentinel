// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SLAEscrow is Ownable, ReentrancyGuard {
    struct Escrow {
        address payer;
        address payee;
        uint256 amount;
        bool settled;
        bool breached;
    }

    mapping(uint256 => Escrow) public escrows;
    address public oracle;

    event EscrowCreated(uint256 indexed agreementId, address payer, address payee, uint256 amount);
    event OutcomeRecorded(uint256 indexed agreementId, bool breached);
    event FundsReleased(uint256 indexed agreementId, address to, uint256 amount);

    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle can call");
        _;
    }

    constructor(address _oracle) Ownable(msg.sender) {
        oracle = _oracle;
    }

    function createEscrow(uint256 agreementId, address payee) external payable {
        require(escrows[agreementId].payer == address(0), "Escrow already exists");
        require(msg.value > 0, "Must send funds");
        require(payee != address(0), "Invalid payee");

        escrows[agreementId] = Escrow({
            payer: msg.sender,
            payee: payee,
            amount: msg.value,
            settled: false,
            breached: false
        });

        emit EscrowCreated(agreementId, msg.sender, payee, msg.value);
    }

    function recordOutcome(uint256 agreementId, bool breached) external onlyOracle {
        Escrow storage escrow = escrows[agreementId];
        require(escrow.payer != address(0), "Escrow does not exist");
        require(!escrow.settled, "Already settled");

        escrow.settled = true;
        escrow.breached = breached;

        emit OutcomeRecorded(agreementId, breached);
    }

    function withdraw(uint256 agreementId) external nonReentrant {
        Escrow storage escrow = escrows[agreementId];
        require(escrow.payer != address(0), "Escrow does not exist");
        require(escrow.settled, "Not settled yet");
        require(escrow.amount > 0, "Already withdrawn");

        address recipient;
        if (escrow.breached) {
            require(msg.sender == escrow.payer, "Only payer can withdraw on breach");
            recipient = escrow.payer;
        } else {
            require(msg.sender == escrow.payee, "Only payee can withdraw on success");
            recipient = escrow.payee;
        }

        uint256 amount = escrow.amount;
        escrow.amount = 0;

        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsReleased(agreementId, recipient, amount);
    }

    function setOracle(address newOracle) external onlyOwner {
        require(newOracle != address(0), "Invalid oracle address");
        oracle = newOracle;
    }
}
