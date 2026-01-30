import { setToken, setUserInfo, removeToken, removeUserInfo } from '@/lib/auth'
import type { RefreshResponse } from '@/lib/api/api-schema/auth'

/**
 * RefreshManager - Singleton class to manage token refresh
 *
 * This class ensures that only one refresh request is in flight at a time,
 * preventing race conditions when multiple API calls fail with 401 simultaneously.
 */
class RefreshManager {
  private isRefreshing: boolean = false
  private refreshPromise: Promise<boolean> | null = null

  /**
   * Perform token refresh
   *
   * If a refresh is already in progress, return the existing promise.
   * Otherwise, start a new refresh request.
   *
   * @returns Promise<boolean> - true if refresh succeeded, false otherwise
   */
  async performRefresh(): Promise<boolean> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise
    }

    this.isRefreshing = true
    this.refreshPromise = this.executeRefresh()

    try {
      return await this.refreshPromise
    } finally {
      this.isRefreshing = false
      this.refreshPromise = null
    }
  }

  /**
   * Execute the actual refresh request
   *
   * Uses native fetch to avoid circular dependency with ApiClient.
   * On success: updates tokens and user info, returns true
   * On failure: clears auth state, returns false
   */
  private async executeRefresh(): Promise<boolean> {
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
      const response = await fetch(`${baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important: send cookies (refresh token)
      })

      if (!response.ok) {
        // Refresh failed (likely refresh token expired)
        this.clearAuthState()
        return false
      }

      const data: RefreshResponse = await response.json()

      // Update access token and user info
      setToken(data.accessToken)
      setUserInfo(data.user)

      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      this.clearAuthState()
      return false
    }
  }

  /**
   * Clear all authentication state
   */
  private clearAuthState(): void {
    removeToken()
    removeUserInfo()
  }

  /**
   * Check if a refresh is currently in progress
   */
  isRefreshInProgress(): boolean {
    return this.isRefreshing
  }
}

/**
 * Export singleton instance
 */
export const refreshManager = new RefreshManager()
