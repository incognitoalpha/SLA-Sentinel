'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function NavBar({ orgName, onLogout }: { orgName?: string; onLogout?: () => void }) {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b border-hairline-border bg-canvas-elevated">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-ink font-semibold text-lg tracking-tight">
              SLA Sentinel
            </Link>

            {orgName && (
              <div className="hidden md:flex space-x-6">
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'text-ink'
                      : 'text-muted-text hover:text-ink'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/agreements"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/agreements')
                      ? 'text-ink'
                      : 'text-muted-text hover:text-ink'
                  }`}
                >
                  Agreements
                </Link>
                <Link
                  href="/breaches"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/breaches')
                      ? 'text-ink'
                      : 'text-muted-text hover:text-ink'
                  }`}
                >
                  Breaches
                </Link>
              </div>
            )}
          </div>

          {orgName ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-text hidden sm:block">{orgName}</span>
              <button
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium bg-ink text-on-primary rounded hover:opacity-90 transition-opacity"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium bg-ink text-on-primary rounded hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
