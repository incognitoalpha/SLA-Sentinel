// Generate new wallet for oracle
const { ethers } = require('hardhat');

async function main() {
  const wallet = ethers.Wallet.createRandom();

  console.log('\n=== NEW WALLET GENERATED ===\n');
  console.log('Address:', wallet.address);
  console.log('Private Key:', wallet.privateKey);
  console.log('\n⚠️  SAVE PRIVATE KEY SECURELY - NEVER SHARE OR COMMIT\n');
  console.log('Next steps:');
  console.log('1. Get Sepolia ETH from faucet: https://sepoliafaucet.com');
  console.log('2. Use private key as ORACLE_PRIVATE_KEY');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
