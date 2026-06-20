import { loadEnvConfig } from '@next/env'

// Load .env files before tests run
loadEnvConfig(process.cwd())
