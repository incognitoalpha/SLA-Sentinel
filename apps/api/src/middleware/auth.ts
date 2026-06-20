import { FastifyRequest, FastifyReply } from 'fastify'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface AuthContext {
  userId: string
  orgId: string
  role: string
}

declare module 'fastify' {
  interface FastifyRequest {
    auth?: AuthContext
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.code(401).send({ error: 'Missing or invalid Authorization header' })
  }

  const token = authHeader.substring(7)

  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return reply.code(401).send({ error: 'Invalid token' })
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('org_id, role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return reply.code(401).send({ error: 'User profile not found' })
    }

    request.auth = {
      userId: user.id,
      orgId: profile.org_id,
      role: profile.role
    }
  } catch (error) {
    return reply.code(401).send({ error: 'Authentication failed' })
  }
}
