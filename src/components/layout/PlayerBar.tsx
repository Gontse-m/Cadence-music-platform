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

  // Reset paid badge when the track changes
  useEffect(() => {
    setIsPaid(false)
    setError(null)
  }, [currentTrack?.id])

  // Sync the <audio> element to play/pause state
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
    <div className="fixed bottom-0 left-0 right-0 bg-burgundy text-white px-6 py-4 flex items-center justify-between z-50 border-t border-burgundy-dark">
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onEnded={() => setIsPlaying(false)}
        preload="auto"
      />
      <div className="flex items-center gap-4">
        <div>
          <p className="font-mael font-semibold text-sm">{currentTrack.title}</p>
          <p className="text-white/60 text-xs">{currentTrack.artist}</p>
        </div>
        <StreamBadge isPaid={isPaid} playCount={playCount} />
      </div>

      <button
        onClick={onPlayPause}
        className="w-10 h-10 rounded-full bg-mustard flex items-center justify-center hover:bg-mustard-dark transition-colors"
      >
        {isPlaying ? '⏸' : '▶'}
      </button>

      {error && (
        <p className="text-red-300 text-xs absolute bottom-16 left-6">{error}</p>
      )}

      <div className="text-xs text-white/60">
        {currentTrack.pricePerStream / 1_000_000_000} SOL / stream
      </div>
    </div>
  )
}
