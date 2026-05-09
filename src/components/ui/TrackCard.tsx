'use client'

import { Track } from '@/types'
import { usePlayerStore } from '@/store/playerStore'

interface TrackCardProps {
  track: Track
}

export function TrackCard({ track }: TrackCardProps) {
  const { setTrack, currentTrack } = usePlayerStore()
  const isActive = currentTrack?.id === track.id

  return (
    <div
      onClick={() => setTrack(track)}
      className={`cursor-pointer rounded-xl p-4 border backdrop-blur-md transition-all ${
        isActive
          ? 'border-mustard bg-mustard/25 shadow-[0_0_24px_rgba(200,155,60,0.4)]'
          : 'border-white/25 hover:border-mustard bg-white/10 hover:bg-white/15'
      }`}
    >
      <div className="aspect-square bg-burgundy/30 backdrop-blur-sm border border-white/15 rounded-lg mb-3 flex items-center justify-center text-4xl">
        🎵
      </div>
      <p className="font-mael font-semibold text-sm text-white truncate drop-shadow">{track.title}</p>
      <p className="text-xs text-white/70 mt-0.5 truncate drop-shadow-sm">{track.artist}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-white/60 drop-shadow-sm">{track.streamCount} streams</span>
        <span className="text-xs font-bold text-burgundy [text-shadow:0_0_8px_rgba(255,255,255,0.95),0_0_16px_rgba(255,255,255,0.75)]">
          {(track.pricePerStream / 1_000_000_000).toFixed(6)} SOL
        </span>
      </div>
    </div>
  )
}
