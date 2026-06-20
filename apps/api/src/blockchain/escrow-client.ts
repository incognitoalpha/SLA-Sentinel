import { ethers } from 'ethers'

let _provider: ethers.JsonRpcProvider | null = null
let _wallet: ethers.Wallet | null = null
let _contract: ethers.Contract | null = null

function getProvider(): ethers.JsonRpcProvider {
  if (!_provider) {
    _provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL!)
  }
  return _provider
}

function getWallet(): ethers.Wallet {
  if (!_wallet) {
    const provider = getProvider()
    _wallet = new ethers.Wallet(process.env.ORACLE_PRIVATE_KEY!, provider)
  }
  return _wallet
}

function getContract(): ethers.Contract {
  if (!_contract) {
    const wallet = getWallet()
    const abi = [
      'function recordOutcome(uint256 agreementId, bool breached) external',
      'function escrows(uint256) external view returns (address payer, address payee, uint256 amount, bool settled, bool breached)',
      'event OutcomeRecorded(uint256 indexed agreementId, bool breached)'
    ]
    _contract = new ethers.Contract(
      process.env.SLA_ESCROW_CONTRACT_ADDRESS!,
      abi,
      wallet
    )
  }
  return _contract
}

export async function recordOutcomeOnChain(
  agreementId: string,
  breached: boolean
): Promise<{ txHash: string, success: boolean }> {
  try {
    const contract = getContract()

    // Convert UUID to uint256 (hash it)
    const agreementIdHash = ethers.toBigInt(
      ethers.keccak256(ethers.toUtf8Bytes(agreementId))
    ) % (2n ** 256n)

    console.log(`Recording outcome on-chain: agreement=${agreementId}, breached=${breached}`)

    const tx = await contract.recordOutcome(agreementIdHash, breached)
    console.log(`Transaction sent: ${tx.hash}`)

    const receipt = await tx.wait()
    console.log(`Transaction confirmed in block ${receipt.blockNumber}`)

    return {
      txHash: tx.hash,
      success: receipt.status === 1
    }
  } catch (error: any) {
    console.error('Failed to record outcome on-chain:', error)
    throw error
  }
}

export async function getEscrowStatus(agreementId: string): Promise<{
  payer: string
  payee: string
  amount: string
  settled: boolean
  breached: boolean
} | null> {
  try {
    const contract = getContract()
    const agreementIdHash = ethers.toBigInt(
      ethers.keccak256(ethers.toUtf8Bytes(agreementId))
    ) % (2n ** 256n)

    const escrow = await contract.escrows(agreementIdHash)

    if (escrow.payer === ethers.ZeroAddress) {
      return null
    }

    return {
      payer: escrow.payer,
      payee: escrow.payee,
      amount: ethers.formatEther(escrow.amount),
      settled: escrow.settled,
      breached: escrow.breached
    }
  } catch (error: any) {
    console.error('Failed to get escrow status:', error)
    throw error
  }
}
