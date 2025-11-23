/**
 * User role enum
 */
export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN'

/**
 * User profile (from /users/me endpoint)
 */
export interface UserProfile {
  id: number
  username: string
  experiencePoints: number
  level: number
  role: UserRole
}
