interface StreamBadgeProps {
  isPaid: boolean
  playCount: number
}

export function StreamBadge({ isPaid, playCount }: StreamBadgeProps) {
  if (playCount === 0) return null

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-medium ${
        isPaid
          ? 'bg-mustard text-white'
          : 'bg-white/20 text-white'
      }`}
    >
      {isPaid ? '✦ Paying artist' : '◎ Free listen'}
    </span>
  )
}
