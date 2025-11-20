'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  BookOpen,
  Trophy,
  LayoutGrid,
  BookText,
} from 'lucide-react'

const navItems = [
  {
    label: '首頁',
    href: '/',
    icon: Home,
  },
  {
    label: '課程',
    href: '/courses',
    icon: BookOpen,
  },
  {
    label: '排行榜',
    href: '/leaderboard',
    icon: Trophy,
  },
  {
    label: '所有單元',
    href: '/units',
    icon: LayoutGrid,
  },
  {
    label: 'Prompt 寶典',
    href: '/prompts',
    icon: BookText,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-48 border-r border-gray-800 bg-[#1a1a1a]">
      <nav className="flex flex-col gap-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-yellow-500 text-black'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
