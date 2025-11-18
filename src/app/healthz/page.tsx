'use client'

import React from 'react'
import useSWR from 'swr'
import { healthApi } from '@/lib/api'
import type { HealthResponse } from '@/lib/api'

const fetcher = async () => {
  const response = await healthApi.checkHealth()
  if (!response.success) {
    throw new Error(response.error.message)
  }
  return response.data
}

const HealthPage = () => {
  const { data, error, isLoading } = useSWR<HealthResponse>(
    '/healthz',
    fetcher,
    {
      refreshInterval: 5000, // 不自動輪詢，可改為 5000 (5秒)
      revalidateOnFocus: false,
    }
  )

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-2xl font-semibold">Loading...</div>
          <div className="text-gray-500">正在檢查 API 健康狀態</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg border border-red-300 bg-red-50 p-6 text-center">
          <div className="mb-2 text-2xl font-semibold text-red-700">Error</div>
          <div className="text-red-600">{error.message}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold">Health Check</h1>
          <p className="text-gray-600">API 健康狀態檢查</p>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span
            className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${
              data?.status === 'UP'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            Status: {data?.status}
          </span>
        </div>

        {/* JSON Response */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-100 px-4 py-3">
            <h2 className="font-semibold text-gray-700">JSON Response</h2>
          </div>
          <div className="p-4">
            <pre className="overflow-x-auto rounded bg-gray-900 p-4 text-sm text-gray-100">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>

        {/* Database Status */}
        {data?.database && (
          <div className="mt-6">
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="mb-2 font-semibold text-gray-700">Database</h3>
              <p className="text-sm">
                Status:{' '}
                <span
                  className={
                    data.database === 'UP'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {data.database}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HealthPage
