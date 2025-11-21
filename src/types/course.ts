export interface Course {
  id: string
  title: string
  subtitle: string
  instructor: string
  description: string
  promotion?: string
  buttonText: string
  buttonVariant: 'default' | 'outline'
  imageUrl: string
}
