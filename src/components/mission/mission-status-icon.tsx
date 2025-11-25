import {
  CheckCircle,
  Circle,
  Video,
  FileText,
  ClipboardList,
} from 'lucide-react'
import type { MissionStatus, MissionType } from '@/lib/api'
import { cn } from '@/lib/utils'

interface MissionStatusIconProps {
  status: MissionStatus | null
  className?: string
}

export function MissionStatusIcon({
  status,
  className,
}: MissionStatusIconProps) {
  const baseClassName = cn('h-4 w-4 shrink-0', className)

  // DELIVERED: green circle with checkmark
  if (status === 'DELIVERED') {
    return <CheckCircle className={cn(baseClassName, 'text-green-500')} />
  }

  // COMPLETED: white circle with checkmark
  if (status === 'COMPLETED') {
    return <CheckCircle className={cn(baseClassName, 'text-white')} />
  }

  // UNCOMPLETED or null: white dashed circle
  return (
    <Circle className={cn(baseClassName, 'text-white')} strokeDasharray="3 3" />
  )
}

// Helper function to get mission type icon
export function MissionTypeIcon({
  type,
  className,
}: {
  type: MissionType
  className?: string
}) {
  const baseClassName = cn('h-4 w-4 shrink-0', className)

  switch (type) {
    case 'VIDEO':
      return <Video className={baseClassName} />
    case 'ARTICLE':
      return <FileText className={baseClassName} />
    case 'QUESTIONNAIRE':
      return <ClipboardList className={baseClassName} />
    default:
      return <Circle className={baseClassName} />
  }
}
