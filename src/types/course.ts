export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  promotion?: string
  buttonText: string
  buttonVariant: 'default' | 'outline'
  thumbnail: {
    gradient: string
    icon: React.ReactNode
  }
}
