import { AuthCard } from '@/components/auth/auth-card'
import { RegisterForm } from '@/components/auth/register-form'

export default function RegisterPage() {
  return (
    <AuthCard title="註冊新帳號">
      <RegisterForm />
    </AuthCard>
  )
}
