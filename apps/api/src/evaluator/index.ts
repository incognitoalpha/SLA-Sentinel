import 'dotenv/config'
import { runEvaluations } from './evaluation-job.js'

async function main() {
  console.log('Evaluator started at', new Date().toISOString())

  try {
    await runEvaluations()
  } catch (error) {
    console.error('Evaluator error:', error)
    process.exit(1)
  }
}

main()
