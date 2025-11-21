import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Course } from '@/types/course'

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="overflow-hidden border-primary/50 p-0">
      {/* Thumbnail */}
      <div
        className={`relative aspect-video bg-gradient-to-br ${course.thumbnail.gradient} p-6`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              {course.thumbnail.icon}
            </div>
            <h3 className="text-2xl font-bold text-white">{course.title}</h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <CardHeader>
        <CardTitle className="text-xl text-white">{course.title}</CardTitle>
        <span className="inline-block rounded bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
          {course.instructor}
        </span>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-400">{course.description}</p>
        {course.promotion && (
          <div className="text-sm text-gray-300">
            <span className="font-semibold text-primary">{course.promotion}</span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          variant={course.buttonVariant}
          className={
            course.buttonVariant === 'outline'
              ? 'w-full border-primary bg-transparent text-primary hover:bg-primary/10'
              : 'w-full bg-primary text-primary-foreground hover:bg-primary/90'
          }
        >
          {course.buttonText}
        </Button>
      </CardFooter>
    </Card>
  )
}
