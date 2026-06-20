import Fastify from 'fastify'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import 'dotenv/config'
import providersRoutes from './routes/providers.js'
import endpointsRoutes from './routes/endpoints.js'
import agreementsRoutes from './routes/agreements.js'
import evaluationsRoutes from './routes/evaluations.js'
import breachesRoutes from './routes/breaches.js'
import demoRoutes from './routes/demo.js'

const fastify = Fastify({
  logger: true
})

await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
})
await fastify.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
})

fastify.get('/api/healthz', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

await fastify.register(providersRoutes, { prefix: '/api' })
await fastify.register(endpointsRoutes, { prefix: '/api' })
await fastify.register(agreementsRoutes, { prefix: '/api' })
await fastify.register(evaluationsRoutes, { prefix: '/api' })
await fastify.register(breachesRoutes, { prefix: '/api' })
await fastify.register(demoRoutes, { prefix: '/api' })

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
