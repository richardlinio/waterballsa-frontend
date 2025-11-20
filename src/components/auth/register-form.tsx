'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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

// Validation schema based on API spec
const registerSchema = z.object({
  username: z
    .string()
    .min(3, '使用者名稱至少需要 3 個字元')
    .max(50, '使用者名稱最多 50 個字元')
    .regex(/^[a-zA-Z0-9_]+$/, '使用者名稱只能包含英文、數字和底線'),
  password: z
    .string()
    .min(8, '密碼至少需要 8 個字元')
    .max(72, '密碼最多 72 個字元')
    .regex(
      /^[a-zA-Z0-9@$!%*?&#]+$/,
      '密碼只能包含英文、數字和特殊符號 (@$!%*?&#)'
    ),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  async function onSubmit(data: RegisterFormValues) {
    setIsLoading(true)

    try {
      const result = await authApi.register(data)

      if (result.success) {
        toast.success('註冊成功！', {
          description: '即將跳轉到登入頁面...',
        })
        setTimeout(() => {
          router.push('/login')
        }, 1500)
        return
      }

      // Handle error cases - use backend error messages directly
      toast.error(result.error.message)

      // Set form error for 409 conflict (username already exists)
      if (result.error.status === 409) {
        form.setError('username', {
          type: 'manual',
          message: '此使用者名稱已存在，請使用其他使用者名稱',
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
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? '註冊中...' : '註冊'}
        </Button>
      </form>
    </Form>
  )
}
