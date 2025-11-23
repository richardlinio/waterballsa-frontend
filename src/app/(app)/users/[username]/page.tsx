'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { userApi, type UserProfile } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const result = await userApi.getMe()
        if (result.success) {
          setProfile(result.data)
        } else {
          setError(result.error.message)
        }
      } catch {
        setError('Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  // Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
        <div className="mx-auto max-w-4xl">
          <Skeleton className="mb-8 h-32 w-32 rounded-full" />
          <Skeleton className="mb-4 h-12 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  // Error card
  if (error || !profile) {
    return (
      <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
        <div className="mx-auto max-w-4xl">
          <Card className="border-border bg-card">
            <CardContent className="pt-6">
              <p className="text-destructive">
                {error || 'Failed to load profile'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Profile Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">
            {profile.username} #{profile.id}
          </h1>
        </div>

        {/* Basic Info Card */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">基本資料</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Username */}
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <span className="text-muted-foreground">暱稱</span>
              <span className="text-white">{profile.username}</span>
            </div>

            {/* Level */}
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <span className="text-muted-foreground">等級</span>
              <span className="text-white">{profile.level}</span>
            </div>

            {/* Experience Points */}
            <div className="grid grid-cols-[120px_1fr] gap-4">
              <span className="text-muted-foreground">經驗值</span>
              <span className="text-white">{profile.experiencePoints}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
