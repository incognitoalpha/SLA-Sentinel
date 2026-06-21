'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import { useEffect, useState } from 'react'

export function NavBar({ orgName, onLogout }: { orgName?: string; onLogout?: () => void }) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by waiting until mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 border-b border-hairline-border bg-canvas-elevated/80 backdrop-blur-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-12">
            <Link href="/" className="text-ink font-bold text-xl tracking-tight flex items-center gap-2 group">
              <span className="w-8 h-8 rounded bg-ink text-on-primary flex items-center justify-center font-extrabold text-sm group-hover:scale-105 transition-transform">
                S
              </span>
              <span>SLA Sentinel</span>
            </Link>

            {orgName && (
              <div className="hidden md:flex items-center space-x-8">
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium tracking-wide transition-all relative py-2 ${
                    isActive('/dashboard')
                      ? 'text-ink font-semibold'
                      : 'text-muted-text hover:text-ink'
                  }`}
                >
                  Dashboard
                  {isActive('/dashboard') && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink rounded-full" />
                  )}
                </Link>
                <Link
                  href="/agreements"
                  className={`text-sm font-medium tracking-wide transition-all relative py-2 ${
                    isActive('/agreements')
                      ? 'text-ink font-semibold'
                      : 'text-muted-text hover:text-ink'
                  }`}
                >
                  Agreements
                  {isActive('/agreements') && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink rounded-full" />
                  )}
                </Link>
                <Link
                  href="/breaches"
                  className={`text-sm font-medium tracking-wide transition-all relative py-2 ${
                    isActive('/breaches')
                      ? 'text-ink font-semibold'
                      : 'text-muted-text hover:text-ink'
                  }`}
                >
                  Breaches
                  {isActive('/breaches') && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink rounded-full" />
                  )}
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-6">
            {/* Theme Toggle Button */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-full border border-hairline-border bg-canvas-elevated hover:bg-canvas text-body-text hover:text-ink shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-link focus:border-transparent"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            )}

            {orgName ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-body-text hidden sm:block bg-canvas border border-hairline-border px-3 py-1.5 rounded-full">
                  {orgName}
                </span>
                <button
                  onClick={onLogout}
                  className="px-5 py-2.5 text-sm font-semibold bg-ink text-on-primary rounded-pill hover:opacity-90 transition-all border border-transparent shadow-sm"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2.5 text-sm font-semibold bg-ink text-on-primary rounded-pill hover:opacity-90 transition-all border border-transparent shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
