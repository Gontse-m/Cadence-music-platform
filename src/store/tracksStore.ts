import { create } from 'zustand'
import { Track, StreamSession } from '@/types'

interface TracksState {
  tracks: Track[]
  sessions: StreamSession[]
  setTracks: (tracks: Track[]) => void
  incrementPlayCount: (trackId: string, walletAddress: string) => number
  getPlayCount: (trackId: string, walletAddress: string) => number
}

export const useTracksStore = create<TracksState>((set, get) => ({
  tracks: [],
  sessions: [],
  setTracks: (tracks) => set({ tracks }),
  getPlayCount: (trackId, walletAddress) => {
    const session = get().sessions.find(
      s => s.trackId === trackId && s.walletAddress === walletAddress
    )
    return session?.playCount || 0
  },
  incrementPlayCount: (trackId, walletAddress) => {
    const sessions = get().sessions
    const existing = sessions.find(
      s => s.trackId === trackId && s.walletAddress === walletAddress
    )
    if (existing) {
      const updated = sessions.map(s =>
        s.trackId === trackId && s.walletAddress === walletAddress
          ? { ...s, playCount: s.playCount + 1, lastPlayedAt: new Date().toISOString() }
          : s
      )
      set({ sessions: updated })
      return existing.playCount + 1
    } else {
      set({
        sessions: [...sessions, {
          trackId,
          walletAddress,
          playCount: 1,
          lastPlayedAt: new Date().toISOString()
        }]
      })
      return 1
    }
  },
}))
