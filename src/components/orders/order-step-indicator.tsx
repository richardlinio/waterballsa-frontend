interface StepIndicatorProps {
  number: number
  label: string
  isActive?: boolean
  isCompleted?: boolean
}

function StepIndicator({
  number,
  label,
  isActive,
  isCompleted,
}: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold ${
          isCompleted
            ? 'border-primary bg-primary text-primary-foreground'
            : isActive
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-muted-foreground bg-background text-muted-foreground'
        }`}
      >
        {number}
      </div>
      <span
        className={`text-xs font-medium ${isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        {label}
      </span>
    </div>
  )
}

function StepConnector({ isCompleted }: { isCompleted?: boolean }) {
  return (
    <div
      className={`h-0.5 w-16 ${isCompleted ? 'bg-primary' : 'bg-muted-foreground'}`}
    />
  )
}

interface OrderStepProgressProps {
  currentStep: 1 | 2 | 3
}

export function OrderStepProgress({ currentStep }: OrderStepProgressProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-4">
        <StepIndicator
          number={1}
          label="建立訂單"
          isCompleted={currentStep > 1}
          isActive={currentStep === 1}
        />
        <StepConnector isCompleted={currentStep > 1} />
        <StepIndicator
          number={2}
          label="完成支付"
          isCompleted={currentStep > 2}
          isActive={currentStep === 2}
        />
        <StepConnector isCompleted={currentStep > 2} />
        <StepIndicator
          number={3}
          label="開始上課！"
          isActive={currentStep === 3}
        />
      </div>
    </div>
  )
}
