'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('登出成功')
      router.push('/login')
    } catch (error) {
      toast.error('登出失敗')
    }
  }

  return (
    <header className="border-b border-gray-800 bg-[#1a1a1a]">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Logo and Brand */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7L12 12L22 7L12 2Z"
                fill="white"
                fillOpacity="0.9"
              />
              <path
                d="M2 17L12 22L22 17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12L12 17L22 12"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none text-white">
              水球軟體學院
            </span>
            <span className="text-xs leading-none text-gray-400">
              WATERBALLSA.TW
            </span>
          </div>
        </Link>

        {/* Center: Course Selector - placeholder for now */}
        <div className="flex-1 px-8">
          <div className="mx-auto max-w-md">
            <select className="w-full rounded-md border border-gray-700 bg-[#2a2a2a] px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
              <option>AI x BDD: 規格驅動全自動開發術</option>
            </select>
          </div>
        </div>

        {/* Right: Login/User Menu */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-300">{user?.username}</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-gray-700 bg-transparent text-white hover:bg-gray-800"
              >
                登出
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-yellow-500 text-black hover:bg-yellow-400">
                登入
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
