/**
 * Register request payload
 */
export interface RegisterRequest {
  username: string
  password: string
}

/**
 * Register response
 */
export interface RegisterResponse {
  message: string
  userId: string
}

/**
 * Login request payload
 */
export interface LoginRequest {
  username: string
  password: string
}

/**
 * User info
 */
export interface UserInfo {
  id: string
  username: string
  experience: number
}

/**
 * Login response
 */
export interface LoginResponse {
  accessToken: string
  user: UserInfo
}

/**
 * Logout response
 */
export interface LogoutResponse {
  message: string
}

/**
 * Refresh token response
 */
export interface RefreshResponse {
  accessToken: string
  user: UserInfo
}
