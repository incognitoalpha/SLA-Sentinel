'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [organizationName, setOrganizationName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Validate inputs
      if (!email.trim() || !password || !organizationName.trim()) {
        throw new Error('Please fill in all fields')
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match')
      }

      // Step 1: Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            organization_name: organizationName.trim()
          }
        }
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Failed to create user account')

      // Step 2: Create organization (using service role would be better, but we'll do it via API)
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: organizationName.trim()
        })
        .select()
        .single()

      if (orgError) {
        console.error('Failed to create organization:', orgError)
        // Continue anyway - the profile trigger might handle this
      }

      const orgId = org?.id

      // Step 3: Create profile (might already exist from trigger, so upsert)
      if (orgId) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            org_id: orgId,
            role: 'admin'
          }, { onConflict: 'id' })

        if (profileError) {
          console.error('Failed to create profile:', profileError)
          // Continue anyway - might already exist
        }
      }

      // Step 4: Check if email confirmation is required
      if (authData.session) {
        // Email confirmation not required, redirect to dashboard
        router.push('/dashboard')
      } else {
        // Email confirmation required
        setError(null)
        alert('Account created! Please check your email to confirm your account, then log in.')
        router.push('/login')
      }
    } catch (err) {
      const error = err as Error
      setError(error.message || 'Failed to create account')
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
              Create an account to start monitoring your API SLAs
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-card text-xs font-semibold text-error flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 stroke-current shrink-0" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label htmlFor="organization" className="block text-[10px] font-bold uppercase tracking-widest text-muted-text mb-2">
                Organization Name
              </label>
              <input
                id="organization"
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                required
                placeholder="Acme Corp"
                className="w-full px-4 py-3 border border-hairline-border rounded-card bg-canvas-elevated/50 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent transition-all shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-widest text-muted-text mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-hairline-border rounded-card bg-canvas-elevated/50 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent transition-all shadow-sm"
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
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full px-4 py-3 border border-hairline-border rounded-card bg-canvas-elevated/50 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent transition-all shadow-sm"
              />
              <p className="mt-1.5 text-[10px] font-semibold text-muted-text">
                Must be at least 6 characters
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-[10px] font-bold uppercase tracking-widest text-muted-text mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength={6}
                className="w-full px-4 py-3 border border-hairline-border rounded-card bg-canvas-elevated/50 text-ink text-sm focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent transition-all shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 px-4 py-3.5 bg-ink text-on-primary font-bold text-sm rounded-pill hover:opacity-90 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-link focus:ring-offset-2 focus:ring-offset-canvas-elevated"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-hairline-border/80 text-center">
            <p className="text-sm text-body-text">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-link font-semibold hover:underline transition-all focus:outline-none"
              >
                Sign in
              </button>
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
