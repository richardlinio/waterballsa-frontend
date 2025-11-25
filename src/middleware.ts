import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 定義需要登入才能訪問的路徑
const protectedPaths = ['/profile']

// 定義需要使用正則表達式匹配的 protected paths
const protectedPathPatterns = [
  /^\/journeys\/[^/]+\/orders/, // Protect all order routes
]

// 定義已登入使用者不應訪問的路徑（如登入、註冊頁面）
const authPaths = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth_token')?.value

  // 檢查是否為 protected route
  const isProtectedPath =
    protectedPaths.some(path => pathname.startsWith(path)) ||
    protectedPathPatterns.some(pattern => pattern.test(pathname))

  // 檢查是否為 auth route
  const isAuthPath = authPaths.some(path => pathname.startsWith(path))

  // 如果是 protected route 但沒有 token，跳轉到登入頁
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/login', request.url)
    // 將原始 URL 作為 redirect parameter 傳遞
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 如果已登入但訪問 auth pages，跳轉到首頁
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// 配置 middleware 應該在哪些路徑上執行
export const config = {
  matcher: [
    /*
     * 只在需要認證檢查的路徑上執行，提升效能
     * - protected routes: 需要登入才能訪問
     * - auth routes: 已登入不應訪問（登入、註冊頁面）
     */
    '/profile/:path*',
    '/journeys/:slug*/orders/:path*',
    '/login',
    '/register',
  ],
}
