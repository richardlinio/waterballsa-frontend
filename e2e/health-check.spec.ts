import { test, expect } from '@playwright/test'

test.describe('Health Check API', () => {
  test('should return UP status when backend is healthy', async ({
    request,
  }) => {
    // Make a direct API request to the backend health check endpoint
    const response = await request.get('http://localhost:8080/healthz')

    // Verify HTTP status code
    expect(response.ok()).toBe(true)
    expect(response.status()).toBe(200)

    // Parse and verify the JSON response
    const data = await response.json()
    expect(data.status).toBe('UP')
    expect(data.database).toBe('UP')
  })

  test('should return correct response structure', async ({ request }) => {
    const response = await request.get('http://localhost:8080/healthz')

    expect(response.ok()).toBe(true)

    const data = await response.json()

    // Verify the response has the correct structure
    expect(data).toHaveProperty('status')
    expect(data).toHaveProperty('database')
    expect(['UP', 'DOWN']).toContain(data.status)
    expect(['UP', 'DOWN']).toContain(data.database)
  })

  test('should handle health check through frontend API wrapper', async ({
    page,
  }) => {
    // Navigate to the homepage to ensure the frontend is running
    await page.goto('/')
    expect(page).toBeTruthy()

    // Use page.request to make the API call
    // This simulates how the frontend would call the API
    const response = await page.request.get('http://localhost:8080/healthz')

    expect(response.status()).toBe(200)

    const data = await response.json()
    expect(data.status).toBe('UP')
    expect(data.database).toBe('UP')
  })
})
