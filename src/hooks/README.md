# Hooks

## useApi

用於包裝 API 呼叫並自動處理 401 錯誤的 custom hook。

### 功能

- 自動處理 401 Unauthorized 錯誤
- 當 token 過期或無效時，自動登出並導向登入頁面
- 保持 Next.js SPA 的導向體驗（使用 `useRouter` 而非 `window.location`）

### 使用方式

#### 基本用法

```tsx
'use client'

import { useApi } from '@/hooks/use-api'
import { authApi } from '@/lib/api'

function LoginPage() {
  const { callApi } = useApi()

  const handleLogin = async (credentials: LoginRequest) => {
    const response = await callApi(() => authApi.login(credentials))

    if (response.success) {
      // 處理成功登入
      console.log('User:', response.data.user)
    } else {
      // 處理錯誤（401 已自動處理，這裡處理其他錯誤）
      console.error(response.error.message)
    }
  }

  return (
    // your component JSX
  )
}
```

#### 在 form submit 中使用

```tsx
'use client'

import { useApi } from '@/hooks/use-api'
import { authApi } from '@/lib/api'

function RegisterForm() {
  const { callApi } = useApi()

  const onSubmit = async (data: RegisterRequest) => {
    const response = await callApi(() => authApi.register(data))

    if (response.success) {
      // 註冊成功
      router.push('/login')
    }
  }

  return <form onSubmit={handleSubmit(onSubmit)}>{/* form fields */}</form>
}
```

#### 與其他 API 一起使用

```tsx
'use client'

import { useApi } from '@/hooks/use-api'
import { userApi, courseApi } from '@/lib/api'

function ProfilePage() {
  const { callApi } = useApi()

  useEffect(() => {
    const loadData = async () => {
      // 如果這些 API 返回 401，會自動登出
      const [userResponse, coursesResponse] = await Promise.all([
        callApi(() => userApi.getProfile()),
        callApi(() => courseApi.getMyCourses()),
      ])

      if (userResponse.success) {
        setUser(userResponse.data)
      }

      if (coursesResponse.success) {
        setCourses(coursesResponse.data)
      }
    }

    loadData()
  }, [])

  return (
    // your component JSX
  )
}
```

### 注意事項

1. **只在 Client Components 中使用**：此 hook 使用 `useAuth` 和 `useRouter`，必須在標註 `'use client'` 的元件中使用

2. **401 自動處理**：當 API 返回 401 時，hook 會自動執行：
   - 呼叫 `logout()`（清除 token 和 user state）
   - 導向 `/login` 頁面

3. **其他錯誤需手動處理**：401 以外的錯誤（如 400, 500）需要在呼叫端自行處理

4. **不影響成功的回應**：當 API 成功時，`callApi` 直接返回原始的 `ApiResponse`
