import type { MissionDetail } from '@/lib/api'

interface MissionHeaderProps {
  mission: MissionDetail
}

export function MissionHeader({ mission }: MissionHeaderProps) {
  return (
    <div className="mb-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-white">{mission.title}</h1>
      </div>
      <p className="text-lg text-gray-400">{mission.description}</p>
      <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
        {mission.videoLength && <span>影片長度: {mission.videoLength}</span>}
        <span>獎勵: {mission.reward.exp} XP</span>
      </div>
    </div>
  )
}
