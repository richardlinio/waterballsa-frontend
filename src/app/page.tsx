import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="min-h-screen border-t-4 border-t-yellow-500 bg-[#0f0f0f] px-8 py-12">
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
        {/* Card 1: 軟體設計模式精通之旅 */}
        <div className="overflow-hidden rounded-lg border border-yellow-500/50 bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f]">
          {/* Card Image */}
          <div className="relative aspect-video bg-linear-to-br from-blue-900/30 to-purple-900/30 p-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
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
                    <rect
                      x="37.5"
                      y="55"
                      width="25"
                      height="25"
                      fill="#f59e0b"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  軟體設計模式精通之旅
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  用一線認證的時間，成為讓優秀的 Coding 實戰高手
                </p>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <div className="mb-3">
              <h4 className="mb-2 text-xl font-bold text-white">
                軟體設計模式精通之旅
              </h4>
              <span className="inline-block rounded bg-yellow-500 px-2 py-1 text-xs font-semibold text-black">
                水球演
              </span>
            </div>
            <p className="mb-4 text-sm text-gray-400">
              用一線認證的時間，成為讓優秀的 Coding 實戰高手
            </p>
            <div className="mb-4 text-sm text-gray-300">
              <span className="font-semibold text-yellow-500">
                看完課程介紹
              </span>
              ，
              <span className="font-semibold text-yellow-500">
                立即折價 3,000 元
              </span>
            </div>
            <Button className="w-full bg-yellow-500 text-black hover:bg-yellow-400">
              立即購買
            </Button>
          </div>
        </div>

        {/* Card 2: AI x BDD */}
        <div className="overflow-hidden rounded-lg border border-yellow-500/50 bg-linear-to-br from-[#1a1a1a] to-[#0f0f0f]">
          {/* Card Image */}
          <div className="relative aspect-video bg-linear-to-br from-blue-900/30 to-cyan-900/30 p-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
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
                </div>
                <h3 className="text-2xl font-bold text-white">
                  AI x BDD : 規格驅動全自動開發術
                </h3>
                <p className="mt-2 text-sm text-gray-400">
                  善用數位轉職，破到 100% 全自動化。
                </p>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <div className="mb-3">
              <h4 className="mb-2 text-xl font-bold text-white">
                AI x BDD : 規格驅動全自動開發術
              </h4>
              <span className="inline-block rounded bg-yellow-500 px-2 py-1 text-xs font-semibold text-black">
                水球演
              </span>
            </div>
            <p className="mb-4 text-sm text-gray-400">
              AI Top 1% 工程師必備技能，掌握規格驅動的全自動化開發
            </p>
            <Button
              variant="outline"
              className="w-full border-yellow-500 bg-transparent text-yellow-500 hover:bg-yellow-500/10"
            >
              立即購買
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
