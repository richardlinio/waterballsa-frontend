import type { MissionDetail } from '@/lib/api'

interface MissionInfoProps {
  mission: MissionDetail
}

export function MissionInfo({ mission }: MissionInfoProps) {
  const getMissionTypeLabel = (type: MissionDetail['type']) => {
    const labels = {
      VIDEO: '影片',
      ARTICLE: '文章',
      QUESTIONNAIRE: '問卷',
    }
    return labels[type]
  }

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-6">
      <h3 className="mb-4 text-xl font-bold text-white">任務資訊</h3>
      <div className="space-y-2 text-gray-400">
        <p>
          <span className="font-semibold text-gray-300">類型:</span>{' '}
          {getMissionTypeLabel(mission.type)}
        </p>
        <p>
          <span className="font-semibold text-gray-300">經驗值:</span>{' '}
          {mission.reward.exp} XP
        </p>
        {mission.isFreePreview && <p className="text-green-400">🎁 免費預覽</p>}
      </div>
    </div>
  )
}
