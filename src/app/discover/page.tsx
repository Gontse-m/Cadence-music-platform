'use client'

import { useEffect } from 'react'
import { TrackCard } from '@/components/ui/TrackCard'
import { useTracksStore } from '@/store/tracksStore'

export default function DiscoverPage() {
  const { tracks, setTracks } = useTracksStore()

  useEffect(() => {
    fetch('/api/tracks')
      .then(r => r.json())
      .then(data => setTracks(data.tracks))
  }, [setTracks])

  return (
    <>
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/backgrounds/discover.jpg')" }}
        aria-hidden
      />
      <div className="pt-24 px-6 max-w-6xl mx-auto w-full pb-24">
        <h1 className="font-mael text-6xl font-bold text-white mb-3 [text-shadow:0_0_18px_rgba(114,47,55,0.95),0_0_36px_rgba(114,47,55,0.7),0_2px_8px_rgba(0,0,0,0.6)]">
          Discover
        </h1>
        <p className="text-white text-lg mb-10 font-semibold [text-shadow:0_0_12px_rgba(114,47,55,0.85),0_0_24px_rgba(114,47,55,0.55),0_2px_6px_rgba(0,0,0,0.7)]">
          First listen is always free. Find your next favourite artist.
        </p>

        {tracks.length === 0 ? (
          <div className="text-center text-white/70 py-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
            No tracks yet — be the first to upload.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {tracks.map(track => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
