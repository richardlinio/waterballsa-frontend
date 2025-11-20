import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Logo } from '@/components/logo'

interface AuthCardProps {
  children: React.ReactNode
  title?: string
}

export function AuthCard({ children, title }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="space-y-4 flex flex-col items-center pb-8 pt-8">
          <Logo />
          {title && (
            <h1 className="text-xl font-medium text-foreground">{title}</h1>
          )}
        </CardHeader>
        <CardContent className="px-8 pb-8">{children}</CardContent>
      </Card>
    </div>
  )
}
