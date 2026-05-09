import { create } from 'zustand'
import { Track } from '@/types'

interface PlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  volume: number
  progress: number
  setTrack: (track: Track) => void
  setIsPlaying: (playing: boolean) => void
  setVolume: (volume: number) => void
  setProgress: (progress: number) => void
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  // Loads the track but leaves it paused — playback runs through PlayerBar's gate.
  setTrack: (track) => set({ currentTrack: track, isPlaying: false }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setVolume: (volume) => set({ volume }),
  setProgress: (progress) => set({ progress }),
}))
