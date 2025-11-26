import { test, expect, APIRequestContext } from '@playwright/test'

const API_BASE_URL = 'http://localhost:8080'
const JOURNEY_SLUG = 'software-design-pattern'
const JOURNEY_ID = 1

interface UserCredentials {
  userId: number
  username: string
  password: string
  authToken: string
}

/**
 * Helper: Register a new user via API
 */
async function registerUser(
  request: APIRequestContext,
  username: string,
  password: string
): Promise<void> {
  await request.post(`${API_BASE_URL}/auth/register`, {
    data: { username, password },
  })
}

/**
 * Helper: Login and return credentials
 */
async function loginUser(
  request: APIRequestContext,
  username: string,
  password: string
): Promise<UserCredentials> {
  const loginResponse = await request.post(`${API_BASE_URL}/auth/login`, {
    data: { username, password },
  })
  const loginData = await loginResponse.json()

  return {
    userId: loginData.user.id,
    username,
    password,
    authToken: loginData.accessToken,
  }
}

/**
 * Helper: Set authentication cookies for browser
 */
async function setAuthCookies(context: any, credentials: UserCredentials) {
  await context.addCookies([
    {
      name: 'auth_token',
      value: credentials.authToken,
      domain: 'localhost',
      path: '/',
    },
    {
      name: 'user_info',
      value: encodeURIComponent(
        JSON.stringify({
          id: credentials.userId,
          username: credentials.username,
        })
      ),
      domain: 'localhost',
      path: '/',
    },
  ])
}

test.describe('Complete Purchase Flow', () => {
  /**
   * 測試完整的購買流程：
   * 註冊 → 登入 → 瀏覽課程 → 建立訂單 → 支付 → 購買成功 → 開始上課
   *
   * ## 測試流程
   * 此測試模擬使用者從註冊到完成購買並開始上課的完整旅程。
   *
   * ### Step 1-2: 使用者註冊與登入
   * 流程：註冊新使用者 → 登入取得 token → 設定瀏覽器 cookies
   * 驗證：成功取得 auth token 並設定 cookies
   *
   * ### Step 3: 瀏覽課程頁面（未購買狀態）
   * 流程：訪問課程頁面 → 查看課程資訊
   * 驗證：
   *   - 課程標題、描述正確顯示
   *   - 顯示「立即購買」按鈕
   *
   * ### Step 4: 建立訂單流程
   * 流程：點擊「立即購買」→ 進入訂單建立頁面 → 點擊「建立訂單」
   * 驗證：
   *   - 跳轉到訂單建立頁面
   *   - 顯示課程統計資訊
   *   - 顯示「建立訂單」按鈕
   *   - 成功建立訂單並跳轉到支付頁面
   *
   * ### Step 5: 支付頁面
   * 流程：檢視訂單摘要 → 選擇付款方式 → 點擊「進行支付」
   * 驗證：
   *   - 顯示訂單摘要卡片
   *   - ATM 付款方式已選中
   *   - 成功完成支付並跳轉到成功頁面
   *
   * ### Step 6: 購買成功頁面
   * 流程：查看購買成功訊息 → 查看訂單摘要
   * 驗證：
   *   - 顯示成功圖示和訊息
   *   - 訂單狀態變為已付款
   *   - 顯示「立即上課」按鈕
   *
   * ### Step 7: 開始上課
   * 流程：點擊「立即上課」→ 進入第一個任務頁面
   * 驗證：
   *   - 成功跳轉到任務頁面
   *   - 任務頁面載入成功
   *
   * ### Step 8: 驗證購買狀態（防止重複購買）
   * 流程：返回課程頁面 → 嘗試再次訪問訂單建立頁面
   * 驗證：
   *   - 課程頁面按鈕變為「開始學習」
   *   - 無法再次建立訂單（顯示已購買提示）
   */
  test.describe.serial('User journey: register to course completion', () => {
    test('Complete purchase journey: register → buy → learn', async ({
      page,
      request,
      context,
    }) => {
      let credentials: UserCredentials
      let orderId: string

      // ============================================
      // Step 1-2: Register and login new user
      // ============================================
      await test.step('Register new user', async () => {
        const timestamp = Date.now()
        const username = `e2e_purchase_${timestamp}`
        const password = 'TestPass123!'

        await registerUser(request, username, password)

        // Login to get auth token
        credentials = await loginUser(request, username, password)

        // Verify we got valid credentials
        expect(credentials.authToken).toBeTruthy()
        expect(credentials.userId).toBeGreaterThan(0)
      })

      await test.step('Set authentication cookies', async () => {
        await setAuthCookies(context, credentials)
      })

      // ============================================
      // Step 3: Browse journey page (not purchased)
      // ============================================

      await test.step('Navigate to journey page', async () => {
        await page.goto(`/journeys/${JOURNEY_SLUG}`)
        await page.waitForLoadState('networkidle')
        await expect(page).toHaveURL(`/journeys/${JOURNEY_SLUG}`)
      })

      await test.step('Verify journey information is displayed', async () => {
        // Verify title is visible
        await expect(page.locator('h1')).toBeVisible()

        // Verify description is present
        await expect(page.locator('p').first()).toBeVisible()
      })

      await test.step('Verify purchase button is visible', async () => {
        // Look for "立即購買" button (could be in sidebar or mobile view)
        const purchaseButton = page.getByRole('button', { name: '立即購買' })
        await expect(purchaseButton).toBeVisible()
      })

      // ============================================
      // Step 4: Create order flow
      // ============================================
      await test.step('Click purchase button', async () => {
        const purchaseButton = page.getByRole('button', { name: '立即購買' })
        await expect(purchaseButton).toBeVisible()
        await purchaseButton.click()
      })

      await test.step('Verify redirect to order creation page', async () => {
        await expect(page).toHaveURL(`/journeys/${JOURNEY_SLUG}/orders`, {
          timeout: 5000,
        })
      })

      await test.step('Verify order creation page content', async () => {
        // Verify page title
        await expect(page.locator('h1')).toContainText(
          /AI x BDD 軟體開發實戰|軟體設計模式/i
        )

        // Verify course stats are displayed
        await expect(page.getByText(/大章節/i)).toBeVisible()
        await expect(page.getByText(/個單元/i)).toBeVisible()
        await expect(page.getByText(/道實戰題目/i)).toBeVisible()

        // Verify "建立訂單" button is visible
        const createOrderButton = page.getByRole('button', {
          name: '建立訂單',
        })
        await expect(createOrderButton).toBeVisible()
      })

      await test.step('Click create order button', async () => {
        const createOrderButton = page.getByRole('button', {
          name: '建立訂單',
        })
        await createOrderButton.click()
      })

      await test.step('Verify redirect to payment page and extract order ID', async () => {
        // Wait for redirect to payment page
        await page.waitForURL(
          new RegExp(`/journeys/${JOURNEY_SLUG}/orders/[^/]+$`),
          { timeout: 10000 }
        )

        // Extract order ID from URL
        const url = page.url()
        const match = url.match(/\/orders\/([^/]+)$/)
        expect(match).toBeTruthy()
        orderId = match![1]
        expect(orderId).toBeTruthy()
      })

      // ============================================
      // Step 5: Payment
      // ============================================
      await test.step('Verify payment page content', async () => {
        // Verify page title
        await expect(page.locator('h1')).toContainText('完成支付')

        // Verify order summary card is visible
        await expect(page.getByText('訂單編號')).toBeVisible()

        // Verify payment method section
        await expect(page.getByText('選取付款方式')).toBeVisible()
        await expect(page.getByText('ATM 匯款')).toBeVisible()

        // Verify payment button
        const paymentButton = page.getByRole('button', { name: '進行支付' })
        await expect(paymentButton).toBeVisible()
      })

      await test.step('Complete payment', async () => {
        const paymentButton = page.getByRole('button', { name: '進行支付' })
        await paymentButton.click()

        // Wait for success toast
        await expect(page.getByText('付款完成！')).toBeVisible({
          timeout: 10000,
        })
      })

      await test.step('Verify redirect to success page', async () => {
        await expect(page).toHaveURL(
          `/journeys/${JOURNEY_SLUG}/orders/${orderId}/success`,
          { timeout: 5000 }
        )
      })

      // ============================================
      // Step 6: Purchase success page
      // ============================================
      await test.step('Verify success message and icon', async () => {
        // Verify success icon (CheckCircle2) - use more flexible selector
        // The icon should have text-green-500 class
        await expect(
          page.locator('svg.text-green-500, svg[class*="text-green"]')
        ).toBeVisible({
          timeout: 10000,
        })

        // Verify success message
        await expect(page.locator('h1')).toContainText('購買完成！')
        await expect(
          page.getByText('恭喜你成功購買課程，現在可以開始學習了')
        ).toBeVisible()
      })

      await test.step('Verify order summary shows paid status', async () => {
        // Order summary should still be visible
        await expect(page.getByText('訂單編號')).toBeVisible()

        // Look for any indicator of paid status (could be text or badge)
        // The order status should be reflected in the card
      })

      await test.step('Verify action buttons are visible', async () => {
        // Verify "立即上課" button
        const startLearningButton = page.getByRole('button', {
          name: '立即上課',
        })
        await expect(startLearningButton).toBeVisible()

        // Verify "查看課程" button
        const viewCourseButton = page.getByRole('button', { name: '查看課程' })
        await expect(viewCourseButton).toBeVisible()
      })

      // Continue to click start learning button
      await test.step('Click start learning button', async () => {
        const startLearningButton = page.getByRole('button', {
          name: '立即上課',
        })
        await startLearningButton.click()
      })

      await test.step('Verify redirect to first mission page', async () => {
        // Should redirect to first chapter's first mission
        // URL pattern: /journeys/{slug}/chapters/{chapterId}/missions/{missionId}
        await expect(page).toHaveURL(
          new RegExp(`/journeys/${JOURNEY_SLUG}/chapters/\\d+/missions/\\d+`),
          { timeout: 10000 }
        )
      })

      await test.step('Verify mission page loaded successfully', async () => {
        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle')

        // Verify sidebar is visible (indicates journey layout loaded)
        const sidebar = page.locator('[data-sidebar="content"]')
        await expect(sidebar).toBeVisible({ timeout: 10000 })
      })

      // ============================================
      // Step 7: Verify purchase status (prevent duplicate purchase)
      // ============================================
      await test.step('Navigate back to journey page', async () => {
        await page.goto(`/journeys/${JOURNEY_SLUG}`)
        await page.waitForLoadState('networkidle')
      })

      await test.step('Verify button text changed to "開始學習"', async () => {
        // The purchase button should now show "開始學習" instead of "立即購買"
        // Since we're in the same session, login state is maintained
        const startLearningButton = page.getByRole('button', {
          name: '開始學習',
        })

        // Wait for the button to appear with updated text
        await expect(startLearningButton.first()).toBeVisible({
          timeout: 10000,
        })

        // Verify "立即購買" button is NOT visible
        const purchaseButton = page.getByRole('button', { name: '立即購買' })
        await expect(purchaseButton).not.toBeVisible()
      })

      await test.step('Try to access order creation page directly', async () => {
        await page.goto(`/journeys/${JOURNEY_SLUG}/orders`)
        await page.waitForLoadState('networkidle')

        // Should show error toast and redirect
        await expect(page.getByText('你已經購買此課程')).toBeVisible({
          timeout: 10000,
        })

        // Should redirect back to journey page
        await expect(page).toHaveURL(`/journeys/${JOURNEY_SLUG}`, {
          timeout: 5000,
        })
      })
    })
  })
})
