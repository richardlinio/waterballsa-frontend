import { Button } from '@/components/ui/button'

interface MissionDeliverButtonProps {
  expReward: number
  isDelivering: boolean
  onDeliver: () => void
}

export function MissionDeliverButton({
  expReward,
  isDelivering,
  onDeliver,
}: MissionDeliverButtonProps) {
  return (
    <div className="mb-8">
      <Button
        onClick={onDeliver}
        disabled={isDelivering}
        size="lg"
        className="w-full"
      >
        {isDelivering ? '處理中...' : `完成任務並領取 ${expReward} XP`}
      </Button>
    </div>
  )
}
