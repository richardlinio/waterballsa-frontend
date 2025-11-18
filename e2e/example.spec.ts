import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')

    // 驗證頁面標題
    await expect(page).toHaveTitle(/Next.js/)
  })

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/')

    // 這裡可以加入更多測試案例
    // 例如：檢查是否有正確的導航元素、按鈕等
  })
})
