import Image from 'next/image'

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-12 w-12">
        <Image
          src="/logo.svg"
          alt="水球軟體學院 Logo"
          width={48}
          height={48}
          priority
        />
      </div>
      <div className="flex flex-col">
        <span className="text-lg font-semibold text-foreground">
          水球軟體學院
        </span>
        <span className="text-xs text-muted-foreground">WATERBALLSA.TW</span>
      </div>
    </div>
  )
}
