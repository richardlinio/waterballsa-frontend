import { LucideIcon } from 'lucide-react'

/**
 * 導航項目介面
 */
export interface NavItem {
  /** 顯示標籤 */
  label: string
  /** 路由路徑 */
  href: string
  /** 圖示元件 */
  icon: LucideIcon
  /** 是否需要驗證 (預設: false) */
  requiresAuth?: boolean
}

/**
 * 導航項目條件
 */
export interface NavItemCondition {
  /** 是否需要使用者名稱 */
  requiresUsername?: boolean
}
