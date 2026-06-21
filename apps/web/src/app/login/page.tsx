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
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-canvas flex items-center justify-center px-4 overflow-hidden">
      {/* Background animated blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-link/10 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-60 dark:opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-success/10 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-60 dark:opacity-30 animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-md relative z-10 my-8">
        <div className="glass-panel rounded-panel p-10 border border-hairline-border/80 shadow-xl transition-all duration-300">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-ink tracking-tight mb-3">
              SLA Sentinel
            </h1>
            <p className="text-sm text-body-text leading-relaxed">
              Sign in to your dashboard to monitor third-party SLAs
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-widest text-muted-text mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-hairline-border rounded-card bg-canvas-elevated/50 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent transition-all shadow-sm"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-widest text-muted-text mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-hairline-border rounded-card bg-canvas-elevated/50 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent transition-all shadow-sm"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-error/10 border border-error/20 rounded-card text-xs font-semibold text-error flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-current shrink-0" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 px-4 py-3.5 bg-ink text-on-primary font-bold text-sm rounded-pill hover:opacity-90 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-link focus:ring-offset-2 focus:ring-offset-canvas-elevated"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-hairline-border/80 text-center">
            <p className="text-sm text-body-text">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-link font-semibold hover:underline transition-all">
                Sign up
              </Link>
            </p>
            <div className="mt-5 inline-flex items-center justify-center px-4 py-1.5 bg-canvas/80 border border-hairline-border rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-warning animate-pulse mr-2.5"></span>
              <span className="text-[10px] uppercase tracking-wider text-muted-text font-bold">Testnet Only • Sepolia</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
