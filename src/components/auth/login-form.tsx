'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'
import { authApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

// Validation schema based on API spec
const loginSchema = z.object({
  username: z
    .string()
    .min(1, '請輸入使用者名稱')
    .min(3, '使用者名稱至少需要 3 個字元'),
  password: z.string().min(1, '請輸入密碼').min(8, '密碼至少需要 8 個字元'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)

    try {
      const result = await authApi.login(data)

      if (result.success) {
        // 儲存 token 和 user info 到 auth context
        login(result.data.accessToken, result.data.user)

        toast.success('登入成功！', {
          description: `歡迎回來，${result.data.user.username}`,
        })

        // 跳轉到首頁
        router.push('/')
        return
      }

      // Handle error cases - use backend error messages directly
      toast.error(result.error.message)

      // Set form error for specific cases if needed
      if (result.error.status === 401) {
        form.setError('username', {
          type: 'manual',
          message: ' ',
        })
        form.setError('password', {
          type: 'manual',
          message: '使用者名稱或密碼錯誤',
        })
      }
    } catch {
      toast.error('發生錯誤', {
        description: '請稍後再試',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>使用者名稱</FormLabel>
              <FormControl>
                <Input
                  placeholder="請輸入使用者名稱"
                  autoComplete="username"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密碼</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="請輸入密碼"
                  autoComplete="current-password"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? '登入中...' : '登入'}
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        還沒有帳號？
        <Link
          href="/register"
          className="ml-1 text-primary underline-offset-4 hover:underline"
        >
          立即註冊
        </Link>
      </div>
    </Form>
  )
}
