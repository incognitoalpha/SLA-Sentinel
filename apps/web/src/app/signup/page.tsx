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
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-ink tracking-tight mb-2">
            Create Account
          </h1>
          <p className="text-muted-text">
            Start monitoring your SLA agreements with automated escrow enforcement
          </p>
        </div>

        <div className="bg-canvas-elevated border border-hairline-border rounded-card p-8">
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded text-sm text-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="organization" className="block text-sm font-medium text-body-text mb-2">
                Organization Name
              </label>
              <input
                id="organization"
                type="text"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                required
                placeholder="Acme Corp"
                className="w-full px-4 py-2 bg-canvas border border-hairline-border rounded text-ink focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent"
              />
              <p className="mt-1 text-xs text-muted-text">
                Your company or organization name
              </p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-body-text mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 bg-canvas border border-hairline-border rounded text-ink focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-body-text mb-2">
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
                className="w-full px-4 py-2 bg-canvas border border-hairline-border rounded text-ink focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent"
              />
              <p className="mt-1 text-xs text-muted-text">
                At least 6 characters
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-body-text mb-2">
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
                className="w-full px-4 py-2 bg-canvas border border-hairline-border rounded text-ink focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-ink text-on-primary font-medium text-sm rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-text">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-link hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-hairline-border">
            <p className="text-xs text-faint-text text-center">
              ⚠️ This platform uses Sepolia testnet for escrow enforcement.
              <br />
              No real funds are involved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
