import Cookies from 'js-cookie'
import type { UserInfo } from '@/lib/api/api-schema'

const TOKEN_KEY = 'auth_token'
const USER_INFO_KEY = 'user_info'
const TOKEN_EXPIRY_DAYS = 1 // JWT expires in 1 day according to API spec

/**
 * 儲存 JWT token 到 cookie
 */
export function setToken(token: string): void {
  Cookies.set(TOKEN_KEY, token, {
    expires: TOKEN_EXPIRY_DAYS,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })
}

/**
 * 從 cookie 讀取 JWT token
 */
export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY)
}

/**
 * 刪除 JWT token (登出時使用)
 */
export function removeToken(): void {
  Cookies.remove(TOKEN_KEY)
}

/**
 * 儲存使用者資訊到 cookie
 */
export function setUserInfo(user: UserInfo): void {
  Cookies.set(USER_INFO_KEY, JSON.stringify(user), {
    expires: TOKEN_EXPIRY_DAYS,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })
}

/**
 * 從 cookie 讀取使用者資訊
 */
export function getUserInfo(): UserInfo | null {
  const userJson = Cookies.get(USER_INFO_KEY)
  if (!userJson) return null

  try {
    return JSON.parse(userJson) as UserInfo
  } catch {
    return null
  }
}

/**
 * 刪除使用者資訊 (登出時使用)
 */
export function removeUserInfo(): void {
  Cookies.remove(USER_INFO_KEY)
}

/**
 * 檢查使用者是否已登入 (token 是否存在)
 */
export function isAuthenticated(): boolean {
  return !!getToken()
}

/**
 * 解析 JWT token 取得 payload (不驗證簽章，僅用於讀取資料)
 * 注意：這不是安全驗證，僅用於前端顯示用途
 */
export function decodeToken(token: string): Record<string, unknown> | null {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

/**
 * 檢查 token 是否過期
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true

  const expirationTime = (decoded.exp as number) * 1000 // Convert to milliseconds
  return Date.now() >= expirationTime
}
