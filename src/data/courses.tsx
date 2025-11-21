import { Course } from '@/types/course'

export const courses: Course[] = [
  {
    id: '1',
    title: '軟體設計模式精通之旅',
    subtitle: '用一趟旅程,精通一套能落地的高效率設計思路',
    instructor: '水球潘',
    description: '用一趟旅程的時間,成為硬核的 Coding 實戰高手',
    promotion: '看完課程介紹,立刻折價 3,000 元',
    buttonText: '立刻體驗',
    buttonVariant: 'outline',
    buttonLink: '/journeys/software-design-pattern/chapters/1/missions/1',
    imageUrl: 'https://world.waterballsa.tw/world/courses/course_0.png',
  },
  {
    id: '2',
    title: 'AI x BDD:規格驅動全自動開發術',
    subtitle: '善用軟體工藝,做到 100% 全自動化、高精準度的 Vibe Coding',
    instructor: '水球潘',
    description: 'AI Top 1% 工程師必修課,掌握規格驅動的全自動化開發',
    buttonText: '立刻購買',
    buttonVariant: 'default',
    buttonLink: '/journeys/software-design-pattern/chapters/1/missions/1',
    imageUrl: 'https://world.waterballsa.tw/world/courses/course_4.png',
  },
]
