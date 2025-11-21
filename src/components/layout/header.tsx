'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('登出成功')
      router.push('/login')
    } catch {
      toast.error('登出失敗')
    }
  }

  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Sidebar Trigger */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-white" />
        </div>

        {/* Center: Course Selector - placeholder for now */}
        <div className="flex-1 px-8">
          <div className="mx-auto max-w-md">
            <Select defaultValue="ai-bdd">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="選擇課程" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ai-bdd">
                  AI x BDD: 規格驅動全自動開發術
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right: Login/User Menu */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300">{user?.username}</span>
              <Button onClick={handleLogout} variant="outline">
                登出
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                登入
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
