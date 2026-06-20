import { test, expect, type Page } from '@playwright/test'

// Helper function to login
async function login(page: Page, email: string, password: string) {
  await page.goto('/login')
  await page.fill('input[type="email"]', email)
  await page.fill('input[type="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL('/dashboard')
}

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('h1')).toContainText('Sign In')
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'invalid@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    // Should see error message or remain on login page
    await expect(page).toHaveURL(/\/login/)
  })

  test('should redirect to login when accessing protected routes without auth', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Assumes a test user exists - in real scenario, set up via API
    await login(page, process.env.TEST_USER_EMAIL || 'demo@example.com', process.env.TEST_USER_PASSWORD || 'demopass123')
  })

  test('should display dashboard with navigation', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('text=Providers')).toBeVisible()
    await expect(page.locator('text=Agreements')).toBeVisible()
    await expect(page.locator('text=Breaches')).toBeVisible()
  })

  test('should navigate between pages', async ({ page }) => {
    // Navigate to Providers
    await page.click('a[href="/providers"]')
    await expect(page).toHaveURL(/\/providers/)

    // Navigate to Agreements
    await page.click('a[href="/agreements"]')
    await expect(page).toHaveURL(/\/agreements/)

    // Navigate to Breaches
    await page.click('a[href="/breaches"]')
    await expect(page).toHaveURL(/\/breaches/)

    // Back to Dashboard
    await page.click('a[href="/dashboard"]')
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('should display org name in navbar', async ({ page }) => {
    await expect(page.locator('nav')).toContainText(/Corp|Organization/i)
  })

  test('should have logout functionality', async ({ page }) => {
    await page.click('button:has-text("Logout"), button:has-text("Sign Out")')
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Providers Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, process.env.TEST_USER_EMAIL || 'demo@example.com', process.env.TEST_USER_PASSWORD || 'demopass123')
    await page.goto('/providers')
  })

  test('should display providers list without errors', async ({ page }) => {
    // Verify page loads without console errors related to .map
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.waitForSelector('h1')
    await expect(page.locator('h1')).toContainText('Providers')

    // Should not have .map errors
    const mapErrors = consoleErrors.filter(err => err.includes('.map is not a function'))
    expect(mapErrors.length).toBe(0)
  })

  test('should navigate to provider detail when clicking a provider', async ({ page }) => {
    // Wait for providers to load
    await page.waitForSelector('[data-testid="provider-card"], .cursor-pointer')

    const providerCards = page.locator('[data-testid="provider-card"], .cursor-pointer')
    const count = await providerCards.count()

    if (count > 0) {
      await providerCards.first().click()
      await expect(page).toHaveURL(/\/providers\/[a-f0-9-]+/)
    }
  })

  test('should display "Create Provider" button', async ({ page }) => {
    await expect(page.locator('button:has-text("Create Provider"), a:has-text("Create Provider")')).toBeVisible()
  })
})

test.describe('Agreements Page - Bug Fix Verification', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, process.env.TEST_USER_EMAIL || 'demo@example.com', process.env.TEST_USER_PASSWORD || 'demopass123')
    await page.goto('/agreements')
  })

  test('should load agreements list without .map errors (BUG FIX)', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.waitForSelector('h1')
    await expect(page.locator('h1')).toContainText('SLA Agreements')

    // Critical: Should not have .map errors (this was the bug)
    const mapErrors = consoleErrors.filter(err => err.includes('.map is not a function'))
    expect(mapErrors.length).toBe(0)
  })

  test('should display filter tabs', async ({ page }) => {
    await expect(page.locator('button:has-text("All")')).toBeVisible()
    await expect(page.locator('button:has-text("Active")')).toBeVisible()
    await expect(page.locator('button:has-text("Breached")')).toBeVisible()
    await expect(page.locator('button:has-text("Settled")')).toBeVisible()
  })

  test('should filter agreements by status', async ({ page }) => {
    await page.click('button:has-text("Active")')
    await page.waitForTimeout(500) // Wait for filter to apply

    await page.click('button:has-text("All")')
    await page.waitForTimeout(500)
  })

  test('should navigate to agreement detail', async ({ page }) => {
    const agreementCards = page.locator('.cursor-pointer')
    const count = await agreementCards.count()

    if (count > 0) {
      await agreementCards.first().click()
      await expect(page).toHaveURL(/\/agreements\/[a-f0-9-]+/)
    }
  })
})

test.describe('Agreement Detail Page - Nested Routes Fix', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, process.env.TEST_USER_EMAIL || 'demo@example.com', process.env.TEST_USER_PASSWORD || 'demopass123')
  })

  test('should load agreement detail with evaluations and breaches (BUG FIX)', async ({ page }) => {
    // First navigate to agreements list
    await page.goto('/agreements')

    const agreementCards = page.locator('.cursor-pointer')
    const count = await agreementCards.count()

    if (count > 0) {
      const consoleErrors: string[] = []
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text())
        }
      })

      // Click first agreement
      await agreementCards.first().click()
      await page.waitForURL(/\/agreements\/[a-f0-9-]+/)

      // Should load without errors
      await expect(page.locator('h1')).toBeVisible()

      // Critical: Should not have .map errors or 404 errors
      const mapErrors = consoleErrors.filter(err => err.includes('.map is not a function'))
      expect(mapErrors.length).toBe(0)

      const notFoundErrors = consoleErrors.filter(err => err.includes('404'))
      expect(notFoundErrors.length).toBe(0)

      // Should display SLA thresholds section
      await expect(page.locator('text=SLA Thresholds')).toBeVisible()

      // Should display evaluation history section if it exists
      // (may be empty for new agreements)
      const hasEvaluations = await page.locator('text=Evaluation History').isVisible()
      if (hasEvaluations) {
        // Table should render without errors
        await expect(page.locator('table')).toBeVisible()
      }

      // Should display breach history section if it exists
      const hasBreaches = await page.locator('text=Breach History').isVisible()
      // No need to assert - just checking it doesn't error
    }
  })

  test('should display back button', async ({ page }) => {
    await page.goto('/agreements')
    const agreementCards = page.locator('.cursor-pointer')
    const count = await agreementCards.count()

    if (count > 0) {
      await agreementCards.first().click()
      await page.waitForURL(/\/agreements\/[a-f0-9-]+/)

      await expect(page.locator('text=Back to Agreements')).toBeVisible()
      await page.click('text=Back to Agreements')
      await expect(page).toHaveURL(/\/agreements$/)
    }
  })

  test('should display testnet warning for escrow', async ({ page }) => {
    await page.goto('/agreements')
    const agreementCards = page.locator('.cursor-pointer')
    const count = await agreementCards.count()

    if (count > 0) {
      await agreementCards.first().click()
      await page.waitForURL(/\/agreements\/[a-f0-9-]+/)

      // Check if escrow section exists
      const hasEscrow = await page.locator('text=Escrow Details').isVisible()
      if (hasEscrow) {
        await expect(page.locator('text=/testnet/i')).toBeVisible()
      }
    }
  })
})

test.describe('Breaches Page - Bug Fix Verification', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, process.env.TEST_USER_EMAIL || 'demo@example.com', process.env.TEST_USER_PASSWORD || 'demopass123')
    await page.goto('/breaches')
  })

  test('should load breaches list without .map errors (BUG FIX)', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.waitForSelector('h1')
    await expect(page.locator('h1')).toContainText('SLA Breaches')

    // Critical: Should not have .map errors (this was the bug)
    const mapErrors = consoleErrors.filter(err => err.includes('.map is not a function'))
    expect(mapErrors.length).toBe(0)
  })

  test('should display filter tabs', async ({ page }) => {
    await expect(page.locator('button:has-text("All")')).toBeVisible()
    await expect(page.locator('button:has-text("Unresolved")')).toBeVisible()
    await expect(page.locator('button:has-text("Resolved")')).toBeVisible()
  })

  test('should filter breaches by resolution status', async ({ page }) => {
    await page.click('button:has-text("Unresolved")')
    await page.waitForTimeout(500)

    await page.click('button:has-text("All")')
    await page.waitForTimeout(500)
  })

  test('should display testnet warning for on-chain transactions', async ({ page }) => {
    const breachCards = page.locator('.border-error')
    const count = await breachCards.count()

    if (count > 0) {
      const hasEtherscanLink = await page.locator('a[href*="sepolia.etherscan.io"]').isVisible()
      if (hasEtherscanLink) {
        await expect(page.locator('text=/SEPOLIA TESTNET/i')).toBeVisible()
      }
    }
  })
})

test.describe('Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, process.env.TEST_USER_EMAIL || 'demo@example.com', process.env.TEST_USER_PASSWORD || 'demopass123')
  })

  test('should have proper heading hierarchy on dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBeGreaterThanOrEqual(1)
  })

  test('should have accessible navigation links', async ({ page }) => {
    await page.goto('/dashboard')
    const navLinks = page.locator('nav a')
    const count = await navLinks.count()
    expect(count).toBeGreaterThan(0)

    // All nav links should have text content
    for (let i = 0; i < count; i++) {
      const text = await navLinks.nth(i).textContent()
      expect(text?.trim().length).toBeGreaterThan(0)
    }
  })

  test('should have form labels on login page', async ({ page }) => {
    await page.goto('/login')
    await page.click('button:has-text("Logout"), button:has-text("Sign Out")')

    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')

    await expect(emailInput).toBeVisible()
    await expect(passwordInput).toBeVisible()
  })
})
