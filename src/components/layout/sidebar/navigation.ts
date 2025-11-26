import { Home, Trophy, Album, UserPen, Receipt } from 'lucide-react'
import type { NavItem } from '@/types/navigation'

/**
 * 基礎導航項目 (所有使用者皆可見)
 */
export const BASE_NAV_ITEMS: NavItem[] = [
  {
    label: '首頁',
    href: '/',
    icon: Home,
  },
]

/**
 * 其他導航項目
 */
export const OTHER_NAV_ITEMS: NavItem[] = [
  {
    label: '所有單元',
    href: '/journeys/software-design-pattern',
    icon: Album,
  },
  {
    label: '排行榜',
    href: '/leaderboard',
    icon: Trophy,
  },
]

/**
 * 取得個人檔案導航項目
 */
export const getProfileNavItem = (username: string): NavItem => ({
  label: '個人檔案',
  href: `/users/${username}`,
  icon: UserPen,
})

/**
 * 取得訂單管理導航項目
 */
export const getOrderManagementNavItem = (): NavItem => ({
  label: '訂單管理',
  href: '/orders',
  icon: Receipt,
})

/**
 * 取得完整導航項目列表
 * @param username - 使用者名稱 (選填)
 * @returns 導航項目陣列
 */
export const getNavItems = (username?: string): NavItem[] => {
  const profileItem = username ? [getProfileNavItem(username)] : []
  const orderItem = username ? [getOrderManagementNavItem()] : []

  return [...BASE_NAV_ITEMS, ...profileItem, ...orderItem, ...OTHER_NAV_ITEMS]
}
