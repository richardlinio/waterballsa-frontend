import { test, expect, APIRequestContext } from '@playwright/test'

const API_BASE_URL = 'http://localhost:8080'
const JOURNEY_ID = 1
const MISSION_ID = 1
const MISSION_URL = '/journeys/software-design-pattern/chapters/1/missions/1'

interface UserCredentials {
  userId: number
  username: string
  password: string
  authToken: string
}

interface MissionContent {
  type: string
  durationSeconds?: number
}

interface MissionDetail {
  content: MissionContent[]
}

/**
 * Helper: Register a new user and return credentials
 */
async function registerAndLogin(
  request: APIRequestContext
): Promise<UserCredentials> {
  const timestamp = Date.now()
  const username = `e2e_mission_${timestamp}`
  const password = 'TestPass123!'

  // Register
  await request.post(`${API_BASE_URL}/auth/register`, {
    data: { username, password },
  })

  // Login
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
 * Helper: Get mission detail to retrieve durationSeconds
 */
async function getMissionDuration(
  request: APIRequestContext,
  authToken: string
): Promise<number> {
  const response = await request.get(
    `${API_BASE_URL}/journeys/${JOURNEY_ID}/missions/${MISSION_ID}`,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  )
  const mission: MissionDetail = await response.json()
  const videoContent = mission.content.find(c => c.type === 'video')
  return videoContent?.durationSeconds ?? 0
}

/**
 * Helper: Update mission progress via API
 */
async function updateProgress(
  request: APIRequestContext,
  userId: number,
  authToken: string,
  watchPositionSeconds: number
) {
  return request.put(
    `${API_BASE_URL}/users/${userId}/missions/${MISSION_ID}/progress`,
    {
      headers: { Authorization: `Bearer ${authToken}` },
      data: { watchPositionSeconds },
    }
  )
}

/**
 * Helper: Get mission progress via API
 */
async function getProgress(
  request: APIRequestContext,
  userId: number,
  authToken: string
) {
  const response = await request.get(
    `${API_BASE_URL}/users/${userId}/missions/${MISSION_ID}/progress`,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  )
  return response.json()
}

/**
 * Helper: Deliver mission via API
 */
async function deliverMission(
  request: APIRequestContext,
  userId: number,
  authToken: string
) {
  return request.post(
    `${API_BASE_URL}/users/${userId}/missions/${MISSION_ID}/progress/deliver`,
    {
      headers: { Authorization: `Bearer ${authToken}` },
    }
  )
}

test.describe('Mission Progress Flow', () => {
  /**
   * 測試「影片任務」的完整使用者流程
   *
   * ## 測試流程
   * 此測試套件模擬使用者從開始觀看影片到完成任務交付的完整流程，
   * 使用 serial 模式確保三個測試按順序執行並共享同一使用者狀態。
   *
   * ### Test 1: 進度追蹤 - 初始狀態與進度儲存
   * 流程：註冊新使用者 → 重置進度為 0 → 進入任務頁 → 透過 API 更新進度到 10 秒 → 重新載入
   * 驗證：
   *   - 初始狀態側邊欄顯示虛線圓圈圖示（UNCOMPLETED）
   *   - 進度有被正確儲存（watchPositionSeconds > 0）
   *   - 狀態維持為 UNCOMPLETED
   *
   * ### Test 2: 影片完成與狀態轉換
   * 流程：將進度設為影片總長度 → 進入任務頁 → 重置進度為 0 → 重新載入
   * 驗證：
   *   - API 回傳狀態變為 COMPLETED
   *   - 「完成任務」按鈕可見
   *   - 側邊欄圖示從虛線圓圈變為打勾
   *   - 重置進度後狀態仍維持 COMPLETED（狀態不會倒退）
   *
   * ### Test 3: 任務交付與防止重複交付
   * 流程：進入任務頁 → 點擊交付按鈕 → 重新載入 → 嘗試再次透過 API 交付 → 重置進度為 0 → 重新載入
   * 驗證：
   *   - 交付成功後顯示經驗值獲得 Toast
   *   - 側邊欄圖示變為綠色打勾
   *   - 顯示「已交付」訊息
   *   - 交付後「完成任務」按鈕消失
   *   - 重複交付 API 回傳 409 錯誤
   *   - 重置進度後狀態仍維持 DELIVERED（狀態不會倒退）
   */
  test.describe.serial('Complete user journey for video mission', () => {
    let credentials: UserCredentials
    let durationSeconds: number

    test('Test 1: Progress tracking - initial state and save progress', async ({
      page,
      request,
      context,
    }) => {
      // Step 1: Register and login new user
      await test.step('Register and login new user', async () => {
        credentials = await registerAndLogin(request)
        durationSeconds = await getMissionDuration(
          request,
          credentials.authToken
        )

        // Set auth cookies for browser
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
      })

      // Step 2: Reset progress to 0
      await test.step('Reset progress to 0 via API', async () => {
        await updateProgress(
          request,
          credentials.userId,
          credentials.authToken,
          0
        )
      })

      // Step 3: Navigate to mission page
      await test.step('Navigate to mission page', async () => {
        await page.goto(MISSION_URL)
        await expect(page).toHaveURL(MISSION_URL)
      })

      // Step 4: Verify initial sidebar icon (dashed circle for UNCOMPLETED)
      await test.step('Verify initial sidebar icon is dashed circle', async () => {
        // Wait for sidebar to load journey data
        const sidebar = page.locator('[data-sidebar="content"]')
        await expect(sidebar).toBeVisible({ timeout: 10000 })

        // The chapter containing the current mission should auto-expand
        // Wait for mission link to be visible (might need to wait for journey data to load)
        const missionLink = sidebar.locator(`a[href="${MISSION_URL}"]`)
        await expect(missionLink).toBeVisible({ timeout: 10000 })

        // Check for Circle icon (lucide-circle class with strokeDasharray)
        const circleIcon = missionLink.locator('svg.lucide-circle')
        await expect(circleIcon).toBeVisible()
      })

      // Step 5: Update progress to 10 seconds via API
      await test.step('Update progress to 10 seconds via API', async () => {
        await updateProgress(
          request,
          credentials.userId,
          credentials.authToken,
          10
        )
      })

      // Step 6: Reload page
      await test.step('Reload page', async () => {
        await page.reload()
        await expect(page).toHaveURL(MISSION_URL)
      })

      // Step 7: Verify progress is not 0 (saved successfully)
      await test.step('Verify progress is saved (not 0)', async () => {
        const progress = await getProgress(
          request,
          credentials.userId,
          credentials.authToken
        )
        expect(progress.watchPositionSeconds).toBeGreaterThan(0)
        expect(progress.status).toBe('UNCOMPLETED')
      })
    })

    test('Test 2: Video completion and status transition', async ({
      page,
      request,
      context,
    }) => {
      // Set auth cookies for browser
      await test.step('Setup authenticated session', async () => {
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
      })

      // Step 1: Update progress to durationSeconds (complete the video)
      await test.step('Complete video by setting progress to durationSeconds', async () => {
        const response = await updateProgress(
          request,
          credentials.userId,
          credentials.authToken,
          durationSeconds
        )
        const data = await response.json()
        expect(data.status).toBe('COMPLETED')
      })

      // Step 2: Reload page
      await test.step('Navigate to mission page', async () => {
        await page.goto(MISSION_URL)
        await expect(page).toHaveURL(MISSION_URL)
      })

      // Step 3: Verify COMPLETED state
      await test.step('Verify deliver button is visible', async () => {
        // MissionDeliverButton should be visible
        const deliverButton = page.getByRole('button', {
          name: /完成任務並領取.*XP/i,
        })
        await expect(deliverButton).toBeVisible({ timeout: 10000 })
      })

      await test.step('Verify sidebar icon is checkmark (not dashed circle)', async () => {
        const sidebar = page.locator('[data-sidebar="content"]')
        const missionLink = sidebar.locator(`a[href="${MISSION_URL}"]`)
        await expect(missionLink).toBeVisible()

        // Check that dashed circle is gone (no strokeDasharray)
        const dashedCircleIcon = missionLink.locator('svg[stroke-dasharray="3 3"]')
        await expect(dashedCircleIcon).not.toBeVisible()

        // Check that there's an SVG icon (the checkmark should have no stroke-dasharray)
        const svgIcon = missionLink.locator('svg')
        await expect(svgIcon).toBeVisible()
      })

      // Step 4: Reset progress to 0 via API
      await test.step('Reset progress to 0 via API', async () => {
        await updateProgress(
          request,
          credentials.userId,
          credentials.authToken,
          0
        )
      })

      // Step 5: Reload page
      await test.step('Reload page', async () => {
        await page.reload()
        await expect(page).toHaveURL(MISSION_URL)
      })

      // Step 6: Verify status does NOT revert (still COMPLETED)
      await test.step('Verify status remains COMPLETED after progress reset', async () => {
        // API should still return COMPLETED
        const progress = await getProgress(
          request,
          credentials.userId,
          credentials.authToken
        )
        expect(progress.status).toBe('COMPLETED')

        // Deliver button should still be visible
        const deliverButton = page.getByRole('button', {
          name: /完成任務並領取.*XP/i,
        })
        await expect(deliverButton).toBeVisible()

        // Sidebar icon should still be checkmark (not reverted to dashed circle)
        const sidebar = page.locator('[data-sidebar="content"]')
        const missionLink = sidebar.locator(`a[href="${MISSION_URL}"]`)

        // Check that dashed circle is not showing
        const dashedCircleIcon = missionLink.locator('svg[stroke-dasharray="3 3"]')
        await expect(dashedCircleIcon).not.toBeVisible()

        // Check there's an SVG icon present
        const svgIcon = missionLink.locator('svg')
        await expect(svgIcon).toBeVisible()
      })
    })

    test('Test 3: Mission delivery and duplicate prevention', async ({
      page,
      request,
      context,
    }) => {
      // Set auth cookies for browser
      await test.step('Setup authenticated session', async () => {
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
      })

      // Step 1: Navigate to mission page
      await test.step('Navigate to mission page', async () => {
        await page.goto(MISSION_URL)
        await expect(page).toHaveURL(MISSION_URL)
      })

      // Step 2: Click deliver button
      await test.step('Click deliver button', async () => {
        const deliverButton = page.getByRole('button', {
          name: /完成任務並領取.*XP/i,
        })
        await expect(deliverButton).toBeVisible({ timeout: 10000 })
        await deliverButton.click()
      })

      // Step 3: Verify delivery success
      await test.step('Verify delivery success toast', async () => {
        // Wait for toast notification showing experience gained
        await expect(
          page.getByText(/獲得 \d+ 經驗值/)
        ).toBeVisible({ timeout: 10000 })
      })

      await test.step('Verify sidebar icon is green checkmark', async () => {
        const sidebar = page.locator('[data-sidebar="content"]')
        const missionLink = sidebar.locator(`a[href="${MISSION_URL}"]`)
        await expect(missionLink).toBeVisible()

        // Check for green checkmark (svg with text-green-500)
        const greenCheckIcon = missionLink.locator('svg.text-green-500')
        await expect(greenCheckIcon).toBeVisible({ timeout: 10000 })
      })

      await test.step('Verify delivered message is shown', async () => {
        // MissionDeliveredMessage should be visible
        await expect(page.getByText(/已交付|已完成/i)).toBeVisible()
      })

      // Step 4: Reload page and verify cannot deliver again
      await test.step('Reload page', async () => {
        await page.reload()
        await expect(page).toHaveURL(MISSION_URL)
      })

      await test.step('Verify deliver button is NOT visible', async () => {
        const deliverButton = page.getByRole('button', {
          name: /完成任務並領取.*XP/i,
        })
        await expect(deliverButton).not.toBeVisible()
      })

      // Step 5: Verify API returns 409 for duplicate delivery
      await test.step('Verify API returns 409 for duplicate delivery', async () => {
        const response = await deliverMission(
          request,
          credentials.userId,
          credentials.authToken
        )
        expect(response.status()).toBe(409)
      })

      // Step 6: Reset progress to 0 via API
      await test.step('Reset progress to 0 via API', async () => {
        await updateProgress(
          request,
          credentials.userId,
          credentials.authToken,
          0
        )
      })

      // Step 7: Reload page
      await test.step('Reload page after progress reset', async () => {
        await page.reload()
        await expect(page).toHaveURL(MISSION_URL)
      })

      // Step 8: Verify status remains DELIVERED
      await test.step('Verify status remains DELIVERED after progress reset', async () => {
        // API should still return DELIVERED
        const progress = await getProgress(
          request,
          credentials.userId,
          credentials.authToken
        )
        expect(progress.status).toBe('DELIVERED')

        // Sidebar icon should still be green checkmark
        const sidebar = page.locator('[data-sidebar="content"]')
        const missionLink = sidebar.locator(`a[href="${MISSION_URL}"]`)
        const greenCheckIcon = missionLink.locator('svg.text-green-500')
        await expect(greenCheckIcon).toBeVisible()
      })
    })
  })
})
