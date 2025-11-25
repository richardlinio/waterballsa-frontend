'use client'

import { SWRConfig } from 'swr'
import { ReactNode } from 'react'

/**
 * Global SWR configuration provider
 * Provides consistent settings for all SWR hooks across the application
 */
export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        // Don't revalidate when window regains focus
        revalidateOnFocus: false,

        // Retry on errors
        shouldRetryOnError: true,
        errorRetryCount: 3,
        errorRetryInterval: 1000,

        // Dedupe requests within 2 seconds
        dedupingInterval: 2000,

        // Don't revalidate on mount if data exists
        revalidateIfStale: false,

        // Keep previous data while revalidating
        keepPreviousData: true,
      }}
    >
      {children}
    </SWRConfig>
  )
}
