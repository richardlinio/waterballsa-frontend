import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Course } from '@/types/course'
import Image from 'next/image'

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="group overflow-hidden border-2 border-primary/30 bg-card p-0 transition-all hover:border-primary/60">
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
      <div className="space-y-6 p-8">
        {/* Title */}
        <div>
          <h3 className="mb-2 text-2xl font-bold text-white">
            {course.title}
          </h3>
          <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            {course.instructor}
          </span>
        </div>

        {/* Description */}
        <p className="text-base text-muted-foreground">{course.description}</p>

        {/* Promotion */}
        {course.promotion && (
          <div className="rounded-lg bg-primary/10 p-3">
            <p className="text-center text-sm font-medium text-primary">
              {course.promotion}
            </p>
          </div>
        )}

        {/* Button */}
        <Button
          variant={course.buttonVariant}
          className={
            course.buttonVariant === 'outline'
              ? 'w-full rounded-xl border-2 border-primary bg-transparent py-6 text-base font-semibold text-primary transition-colors hover:bg-primary/10'
              : 'w-full rounded-xl bg-primary py-6 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90'
          }
        >
          {course.buttonText}
        </Button>
      </div>
    </Card>
  )
}
