import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Course } from '@/types/course'
import Image from 'next/image'

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="group flex flex-col overflow-hidden border-2 border-white/20 bg-card p-0 transition-all duration-250 hover:-translate-y-1 hover:scale-102 hover:border-primary/60 hover:bg-primary/10 hover:shadow-2lg hover:shadow-black/30">
      {/* Image Header */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={course.imageUrl}
          alt={course.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-8 pb-8 pt-4">
        <div className="flex-1 space-y-4">
          {/* Title */}
          <div>
            <h3 className="mb-2 text-2xl font-bold text-white">
              {course.title}
            </h3>
            <p className="text-m font-semibold text-primary">
              {course.instructor}
            </p>
          </div>

          {/* Description */}
          <p className="text-base text-muted-foreground">
            {course.description}
          </p>

          {/* Promotion */}
          {course.promotion && (
            <p className="text-center text-lg font-medium text-primary">
              {course.promotion}
            </p>
          )}
        </div>

        {/* Button */}
        <Button
          className={
            course.buttonVariant === 'outline'
              ? 'mt-6 w-full rounded-xl border-0 bg-primary py-6 text-base font-semibold text-primary-foreground shadow-none transition-colors hover:bg-primary/90'
              : 'mt-6 w-full rounded-xl border-2 border-primary/30 bg-transparent py-6 text-base font-semibold text-primary shadow-none transition-colors hover:border-primary hover:bg-primary hover:text-black'
          }
        >
          {course.buttonText}
        </Button>
      </div>
    </Card>
  )
}
