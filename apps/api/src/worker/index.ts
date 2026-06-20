import 'dotenv/config'
import { runProbes } from './scheduler.js'

async function main() {
  console.log('Worker started at', new Date().toISOString())

  try {
    await runProbes()
  } catch (error) {
    console.error('Worker error:', error)
    process.exit(1)
  }
}

main()
