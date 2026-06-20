import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import 'dotenv/config'

const fastify = Fastify({
  logger: true
})

await fastify.register(cors)
await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
})

fastify.get('/api/healthz', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3001
    await fastify.listen({ port, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
