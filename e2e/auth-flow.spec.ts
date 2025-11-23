import { test, expect } from '@playwright/test'

test.describe('Complete Authentication Flow', () => {
  // Generate unique test credentials
  const timestamp = Date.now()
  const testUsername = `testuser_${timestamp}`
  const testPassword = 'TestPass123!'

  test('should complete full auth flow: register → login → logout', async ({
    page,
    context,
  }) => {
    // ===========================
    // Step 1: Homepage Visit (Unauthenticated)
    // ===========================
    await test.step('Visit homepage as unauthenticated user', async () => {
      // Clear all cookies to ensure clean state (fixes flaky test)
      await context.clearCookies()

      await page.goto('/')

      // Wait for page to be fully loaded and hydrated
      await page.waitForLoadState('networkidle')

      // Verify "登入" button is visible
      const loginButton = page.getByRole('link', { name: '登入' })
      await expect(loginButton).toBeVisible()

      // Verify no username is displayed (user not authenticated)
      const header = page.locator('header')
      await expect(header).not.toContainText(testUsername)
    })

    // ===========================
    // Step 2: Navigate to Registration
    // ===========================
    await test.step('Navigate to registration page', async () => {
      // Click "登入" button to go to login page
      const loginLink = page.getByRole('link', { name: '登入' })
      await expect(loginLink).toBeVisible()
      await loginLink.click()
      await expect(page).toHaveURL('/login')

      // Click "立即註冊" link
      await page.getByRole('link', { name: '立即註冊' }).click()
      await expect(page).toHaveURL('/register')

      // Verify registration form is displayed
      await expect(page.getByPlaceholder('請輸入使用者名稱')).toBeVisible()
      await expect(page.getByPlaceholder('請輸入密碼')).toBeVisible()
      await expect(page.getByPlaceholder('請再次輸入密碼')).toBeVisible()
    })

    // ===========================
    // Step 3: Register New Account
    // ===========================
    await test.step('Register a new account', async () => {
      // Fill registration form
      await page.getByPlaceholder('請輸入使用者名稱').fill(testUsername)
      await page.getByPlaceholder('請輸入密碼').fill(testPassword)
      await page.getByPlaceholder('請再次輸入密碼').fill(testPassword)

      // Submit form
      await page.getByRole('button', { name: '註冊' }).click()

      // Wait for success toast immediately (before it disappears)
      await expect(page.getByText('註冊成功！')).toBeVisible({ timeout: 10000 })

      // Verify redirect to login page (with timeout for the 1.5s delay)
      await expect(page).toHaveURL('/login', { timeout: 3000 })
    })

    // ===========================
    // Step 4: First Login
    // ===========================
    await test.step('Login with registered credentials', async () => {
      // Fill login form
      await page.getByPlaceholder('請輸入使用者名稱').fill(testUsername)
      await page.getByPlaceholder('請輸入密碼').fill(testPassword)

      // Submit form (use form-specific button to avoid header button)
      await page.locator('form').getByRole('button', { name: '登入' }).click()

      // Wait for success toast
      await expect(page.getByText('登入成功！')).toBeVisible({ timeout: 10000 })

      // Verify redirect to homepage
      await expect(page).toHaveURL('/')

      // Verify authenticated state: username displayed in header
      const header = page.locator('header')
      await expect(header).toContainText(testUsername)

      // Verify "登出" button is visible
      await expect(page.getByRole('button', { name: '登出' })).toBeVisible()
    })

    // ===========================
    // Step 5: Verify Authentication Persistence
    // ===========================
    await test.step('Verify authentication state persists', async () => {
      // Check for auth cookies
      const cookies = await context.cookies()
      const authToken = cookies.find(cookie => cookie.name === 'auth_token')
      const userInfo = cookies.find(cookie => cookie.name === 'user_info')

      expect(authToken).toBeTruthy()
      expect(authToken?.value).toBeTruthy()
      expect(userInfo).toBeTruthy()
      expect(userInfo?.value).toContain(testUsername)

      // Verify authenticated state is still visible
      await expect(page.locator('header')).toContainText(testUsername)
      await expect(page.getByRole('button', { name: '登出' })).toBeVisible()
    })

    // ===========================
    // Step 6: Logout
    // ===========================
    await test.step('Logout and verify state cleared', async () => {
      // Click logout button
      await page.getByRole('button', { name: '登出' }).click()

      // Wait for logout success toast
      await expect(page.getByText('登出成功')).toBeVisible({ timeout: 10000 })

      // Verify redirect to login page
      await expect(page).toHaveURL('/login')

      // Verify cookies are cleared
      const cookiesAfterLogout = await context.cookies()
      const authTokenAfterLogout = cookiesAfterLogout.find(
        cookie => cookie.name === 'auth_token'
      )
      const userInfoAfterLogout = cookiesAfterLogout.find(
        cookie => cookie.name === 'user_info'
      )

      expect(authTokenAfterLogout).toBeFalsy()
      expect(userInfoAfterLogout).toBeFalsy()

      // Navigate back to homepage to verify unauthenticated state
      await page.goto('/')

      // Wait for page to be fully loaded and hydrated
      await page.waitForLoadState('networkidle')

      // Verify "登入" button appears (not "登出")
      await expect(page.getByRole('link', { name: '登入' })).toBeVisible()

      // Verify no username is displayed
      const header = page.locator('header')
      await expect(header).not.toContainText(testUsername)
    })
  })
})
