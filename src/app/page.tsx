import { CourseCard } from '@/components/course-card'
import { courses } from '@/data/courses'

export default function HomePage() {
  return (
    <div className="min-h-screen border-t-4 border-t-primary bg-background px-8 py-12">
      {/* Welcome Section */}
      <div className="mb-12">
        <h1 className="mb-4 text-4xl font-bold text-white">
          歡迎來到水球軟體學院
        </h1>
        <div className="text-gray-400">
          <p className="mb-2">
            水球軟體學院提供最先進的軟體設計思路教材，並透過線上 Code Review
            來帶你掌握進階軟體架能力。
          </p>
          <p>
            只要每週投資 5 小時，就能打造不平等的優勢，成為硬核的 Coding
            實戰高手。
          </p>
        </div>
      </div>

      {/* Course Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}
