import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { Track, StreamSession } from '@/types'

interface TracksState {
  // Demo tracks fetched from /api/tracks (not persisted — re-fetched on load)
  tracks: Track[]
  // Tracks the current user has uploaded — persisted to localStorage so they
  // survive a page reload and surface on /discover and /dashboard.
  uploadedTracks: Track[]
  // Per-(track, wallet) play counts for free-vs-paid gating (in-memory only).
  sessions: StreamSession[]

  setTracks: (tracks: Track[]) => void
  addUploadedTrack: (track: Track) => void
  removeUploadedTrack: (trackId: string) => void
  incrementPlayCount: (trackId: string, walletAddress: string) => number
  getPlayCount: (trackId: string, walletAddress: string) => number
}

export const useTracksStore = create<TracksState>()(
  persist(
    (set, get) => ({
      tracks: [],
      uploadedTracks: [],
      sessions: [],

      setTracks: (tracks) => set({ tracks }),

      addUploadedTrack: (track) =>
        set((state) => ({
          // newest first; dedupe by id in case of retry
          uploadedTracks: [track, ...state.uploadedTracks.filter((t) => t.id !== track.id)],
        })),

      removeUploadedTrack: (trackId) =>
        set((state) => ({
          uploadedTracks: state.uploadedTracks.filter((t) => t.id !== trackId),
        })),

      getPlayCount: (trackId, walletAddress) => {
        const session = get().sessions.find(
          (s) => s.trackId === trackId && s.walletAddress === walletAddress,
        )
        return session?.playCount || 0
      },

      incrementPlayCount: (trackId, walletAddress) => {
        const sessions = get().sessions
        const existing = sessions.find(
          (s) => s.trackId === trackId && s.walletAddress === walletAddress,
        )
        if (existing) {
          const updated = sessions.map((s) =>
            s.trackId === trackId && s.walletAddress === walletAddress
              ? { ...s, playCount: s.playCount + 1, lastPlayedAt: new Date().toISOString() }
              : s,
          )
          set({ sessions: updated })
          return existing.playCount + 1
        }
        set({
          sessions: [
            ...sessions,
            { trackId, walletAddress, playCount: 1, lastPlayedAt: new Date().toISOString() },
          ],
        })
        return 1
      },
    }),
    {
      name: 'cadence-tracks',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : ({} as any))),
      // Only persist uploaded tracks; demo tracks come from the API and sessions are session-scoped.
      partialize: (state) => ({ uploadedTracks: state.uploadedTracks }),
    },
  ),
)
