'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Check if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      if (data.session) {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-canvas-elevated border border-hairline-border rounded-card p-8">
          <h1 className="text-2xl font-semibold text-ink tracking-tight mb-2">
            Sign in to SLA Sentinel
          </h1>
          <p className="text-sm text-muted-text mb-6">
            Monitor your third-party APIs with testnet escrow enforcement
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-hairline-border rounded bg-canvas-elevated text-ink text-sm focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-hairline-border rounded bg-canvas-elevated text-ink text-sm focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-error/10 border border-error/20 rounded text-sm text-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2.5 bg-ink text-on-primary font-medium text-sm rounded-pill hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-text">
            Don't have an account?{' '}
            <Link href="/signup" className="text-link hover:underline">
              Sign up
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-faint-text">
            Testnet only • Sepolia deployment
          </p>
        </div>
      </div>
    </div>
  )
}
