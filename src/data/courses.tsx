import { Course } from '@/types/course'

export const courses: Course[] = [
  {
    id: '1',
    title: '軟體設計模式精通之旅',
    description: 'AI Top 1% 工程師必備技能，掌握規格驅動的全自動化開發',
    instructor: '水球演',
    promotion: '看完課程介紹，立即折價 3,000 元',
    buttonText: '立即購買',
    buttonVariant: 'default',
    thumbnail: {
      gradient: 'from-blue-900/30 to-purple-900/30',
      icon: (
        <svg
          viewBox="0 0 100 100"
          className="h-24 w-24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="20"
            y="20"
            width="25"
            height="25"
            fill="#3b82f6"
            transform="rotate(45 32.5 32.5)"
          />
          <rect
            x="55"
            y="20"
            width="25"
            height="25"
            fill="#ef4444"
            transform="rotate(-45 67.5 32.5)"
          />
          <rect x="37.5" y="55" width="25" height="25" fill="#f59e0b" />
        </svg>
      ),
    },
  },
  {
    id: '2',
    title: 'AI x BDD : 規格驅動全自動開發術',
    description: 'AI Top 1% 工程師必備技能，掌握規格驅動的全自動化開發',
    instructor: '水球演',
    buttonText: '立即購買',
    buttonVariant: 'outline',
    thumbnail: {
      gradient: 'from-blue-900/30 to-cyan-900/30',
      icon: (
        <svg
          viewBox="0 0 100 100"
          className="h-24 w-24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30 70L50 30L70 70H30Z"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          <path
            d="M40 60L50 40L60 60"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="50" r="5" fill="#06b6d4" />
        </svg>
      ),
    },
  },
]
