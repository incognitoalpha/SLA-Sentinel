# Smart Contract Deployment Guide

## Prerequisites

1. **Sepolia Testnet ETH**
   - Get test ETH from a Sepolia faucet:
     - https://sepoliafaucet.com/
     - https://www.alchemy.com/faucets/ethereum-sepolia
   - You'll need ~0.05 ETH for deployment + gas

2. **RPC Provider**
   - Sign up for a free RPC provider:
     - Alchemy: https://www.alchemy.com/
     - Infura: https://infura.io/
   - Create a Sepolia endpoint

3. **Etherscan API Key** (for verification)
   - Sign up at https://etherscan.io/
   - Get API key from your account dashboard

4. **Wallet**
   - Have a wallet with private key (MetaMask, etc.)
   - **IMPORTANT:** Use a fresh wallet for testnet only, never reuse mainnet keys

---

## Step 1: Configure Environment

Create `.env` file in the `contracts/` directory:

```bash
cd contracts
cp .env.example .env
```

Edit `.env` with your values:

```env
# Sepolia RPC endpoint (from Alchemy/Infura)
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Private key of deployer wallet (with Sepolia ETH)
# IMPORTANT: This should be a testnet-only wallet, never use mainnet keys
ORACLE_PRIVATE_KEY=0x1234567890abcdef...

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY

# Oracle address (defaults to deployer if not set)
ORACLE_ADDRESS=0x... # Optional: separate oracle address
```

---

## Step 2: Deploy Contract

From the `contracts/` directory:

```bash
# Install dependencies (if not already done)
pnpm install

# Compile contract
pnpm run compile

# Run tests to verify contract works
pnpm test

# Deploy to Sepolia testnet
pnpm run deploy:sepolia
```

**Expected Output:**
```
Deploying SLAEscrow with account: 0xYourAddress
Account balance: 0.05 ETH
Oracle address: 0xYourAddress
SLAEscrow deployed to: 0xContractAddress

Next steps:
1. Save contract address to .env: SLA_ESCROW_CONTRACT_ADDRESS=0xContractAddress
2. Verify on Etherscan:
   npx hardhat verify --network sepolia 0xContractAddress 0xOracleAddress
3. Fund oracle wallet with Sepolia ETH from faucet
```

---

## Step 3: Verify Contract on Etherscan

This makes the contract source code public and verifiable:

```bash
npx hardhat verify --network sepolia <CONTRACT_ADDRESS> <ORACLE_ADDRESS>
```

Example:
```bash
npx hardhat verify --network sepolia 0x1234... 0x5678...
```

**Verification successful when you see:**
```
Successfully verified contract SLAEscrow on Etherscan.
https://sepolia.etherscan.io/address/0xYourContractAddress#code
```

---

## Step 4: Update Application Configuration

### 4.1 Update Backend `.env`

Add to `apps/api/.env`:

```env
SLA_ESCROW_CONTRACT_ADDRESS=0xYourDeployedContractAddress
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
ORACLE_PRIVATE_KEY=0x... # Same as contracts/.env
```

### 4.2 Update Frontend `.env.local`

Add to `apps/web/.env.local`:

```env
NEXT_PUBLIC_SEPOLIA_ESCROW_ADDRESS=0xYourDeployedContractAddress
```

### 4.3 Update README.md

Add to the README:

```markdown
## Smart Contract

**Network:** Sepolia Testnet  
**Contract Address:** `0xYourDeployedContractAddress`  
**Verified Source:** https://sepolia.etherscan.io/address/0xYourContractAddress#code

### Contract Functions
- `deposit(agreementId)` - Deposit penalty amount as escrow
- `settleBreach(agreementId, beneficiary)` - Settle breach and transfer penalty
- `withdraw(agreementId)` - Admin withdrawal after agreement ends
```

---

## Step 5: Test Deployment

### 5.1 View on Etherscan

Visit: `https://sepolia.etherscan.io/address/0xYourContractAddress`

Verify:
- ✅ Contract is verified (green checkmark)
- ✅ Source code is visible
- ✅ Constructor arguments match
- ✅ Oracle address is correct

### 5.2 Test Deposit (Optional)

From `contracts/` directory:

```bash
npx hardhat console --network sepolia
```

In the console:
```javascript
const escrow = await ethers.getContractAt("SLAEscrow", "0xYourContractAddress")
const agreementId = ethers.keccak256(ethers.toUtf8Bytes("test-agreement-1"))

// Deposit 0.1 ETH
await escrow.deposit(agreementId, { value: ethers.parseEther("0.1") })

// Check deposit
await escrow.deposits(agreementId)
```

---

## Troubleshooting

### Error: "Insufficient funds"
- **Solution:** Get more Sepolia ETH from faucet
- Need ~0.05 ETH for deployment

### Error: "Transaction underpriced"
- **Solution:** Gas prices might have spiked, retry in a few minutes
- Or increase gas limit in hardhat.config.ts

### Error: "Nonce too high"
- **Solution:** Reset your account in MetaMask or wait for pending transactions

### Verification fails
- **Solution:** Wait 1-2 minutes after deployment before verifying
- Make sure constructor arguments match exactly

### "Already verified" message
- **Solution:** Contract is already verified, you're done!

---

## Security Reminders

⚠️ **NEVER commit private keys to git**
⚠️ **Use testnet-only wallets**
⚠️ **This is Sepolia testnet - not real money**
⚠️ **Oracle wallet needs Sepolia ETH for breach settlements**

---

## Post-Deployment Checklist

- [ ] Contract deployed to Sepolia
- [ ] Contract verified on Etherscan
- [ ] Contract address saved to backend .env
- [ ] Contract address saved to frontend .env.local
- [ ] README updated with contract address
- [ ] Oracle wallet funded with Sepolia ETH
- [ ] Tested deposit function works
- [ ] Tested settleBreach function works (optional)

---

## Next Steps

After deployment, update the following files:

1. **README.md** - Add contract address and Etherscan link
2. **apps/api/.env** - Add contract address
3. **apps/web/.env.local** - Add contract address
4. **Git commit** - Commit config changes (NOT private keys)

Example commit message:
```
feat: deploy SLAEscrow contract to Sepolia

Contract deployed at 0x...
Verified on Etherscan: https://sepolia.etherscan.io/address/0x...
```
