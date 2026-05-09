'use client'

import { Track } from '@/types'
import { TrackCard } from '@/components/ui/TrackCard'

export function TrackGrid({ tracks }: { tracks: Track[] }) {
  if (tracks.length === 0) {
    return <div className="text-center text-gray-400 py-32">No tracks yet — be the first to upload.</div>
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {tracks.map(track => (
        <TrackCard key={track.id} track={track} />
      ))}
    </div>
  )
}
