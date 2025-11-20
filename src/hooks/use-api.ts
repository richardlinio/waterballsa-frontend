'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import type { ApiResponse } from '@/lib/api/api-schema'

/**
 * Custom hook for API calls with automatic 401 handling
 *
 * Usage:
 * ```tsx
 * const { callApi } = useApi()
 *
 * const handleSubmit = async () => {
 *   const response = await callApi(() => authApi.login(credentials))
 *   if (response.success) {
 *     // handle success
 *   }
 * }
 * ```
 */
export function useApi() {
  const { logout } = useAuth()
  const router = useRouter()

  /**
   * Wraps an API call with automatic 401 handling
   * If the API returns 401, automatically logout and redirect to login page
   */
  const callApi = useCallback(
    async <T>(
      apiCall: () => Promise<ApiResponse<T>>
    ): Promise<ApiResponse<T>> => {
      const response = await apiCall()

      // Handle 401 Unauthorized - token expired or invalid
      if (!response.success && response.error.status === 401) {
        logout()
        router.push('/login')
      }

      return response
    },
    [logout, router]
  )

  return { callApi }
}
