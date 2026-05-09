'use client'

import { useEffect } from 'react'
import { useTracksStore } from '@/store/tracksStore'

export function useTracks() {
  const { tracks, setTracks } = useTracksStore()

  useEffect(() => {
    if (tracks.length > 0) return
    fetch('/api/tracks')
      .then(r => r.json())
      .then(data => setTracks(data.tracks))
      .catch(() => {})
  }, [tracks.length, setTracks])

  return tracks
}
