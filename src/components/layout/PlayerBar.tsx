'use client'

import { usePlayerStore } from '@/store/playerStore'
import { useStream } from '@/hooks/useStream'
import { useTracksStore } from '@/store/tracksStore'
import { useWallet } from '@solana/wallet-adapter-react'
import { StreamBadge } from '@/components/ui/StreamBadge'
import { useEffect, useRef, useState } from 'react'

export function PlayerBar() {
  const { currentTrack, isPlaying, setIsPlaying } = usePlayerStore()
  const { handlePlay } = useStream()
  const { getPlayCount } = useTracksStore()
  const { publicKey } = useWallet()
  const [isPaid, setIsPaid] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    setIsPaid(false)
    setError(null)
  }, [currentTrack?.id])

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    if (isPlaying) el.play().catch(() => setIsPlaying(false))
    else el.pause()
  }, [isPlaying, currentTrack?.id, setIsPlaying])

  if (!currentTrack) return null

  const playCount = publicKey ? getPlayCount(currentTrack.id, publicKey.toBase58()) : 0

  const onPlayPause = async () => {
    if (!isPlaying) {
      const result = await handlePlay(currentTrack)
      if (!result.allowed) {
        setError(result.error || 'Cannot play track.')
        return
      }
      setIsPaid(result.isPaid)
      setError(null)
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-burgundy text-white px-3 sm:px-6 py-3 sm:py-4 z-50 border-t border-burgundy-dark">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />

      {/* Mobile-first row layout: track info (truncates) | play | price (hidden on xs) */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <div className="min-w-0 flex-1">
            <p className="font-mael font-semibold text-sm truncate">{currentTrack.title}</p>
            <p className="text-white/60 text-xs truncate">{currentTrack.artist}</p>
          </div>
          <div className="hidden sm:block">
            <StreamBadge isPaid={isPaid} playCount={playCount} />
          </div>
        </div>

        <button
          onClick={onPlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-mustard flex items-center justify-center hover:bg-mustard-dark transition-colors shrink-0 text-base"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div className="hidden md:block text-xs text-white/60 shrink-0">
          {currentTrack.pricePerStream / 1_000_000_000} SOL / stream
        </div>
      </div>

      {/* Mobile: badge + price live on a second row when relevant */}
      <div className="flex items-center justify-between mt-1.5 sm:hidden text-[11px] text-white/60">
        <StreamBadge isPaid={isPaid} playCount={playCount} />
        <span>{currentTrack.pricePerStream / 1_000_000_000} SOL / stream</span>
      </div>

      {error && (
        <p className="text-red-300 text-xs mt-2 sm:mt-0 sm:absolute sm:bottom-full sm:left-6">{error}</p>
      )}
    </div>
  )
}
