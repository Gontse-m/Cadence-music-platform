import { NextResponse } from 'next/server'

// Audio URLs point at SoundHelix demo MP3s — public test files, fine for hackathon demo.
// Wallets are devnet keypairs generated for the demo. Swap in your own to receive payments.
const DEMO_TRACKS = [
  {
    id: '1',
    title: 'Golden Hour',
    artist: 'Amara Diouf',
    artistWallet: '4v86i6iikV5pi7qgLRVMFPQ8xAUw4MEodYjAAAKf9NUp',
    ipfsHash: 'QmDemoSoundHelix1',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    pricePerStream: 10000,
    streamCount: 142,
    genre: 'Afrobeats',
    uploadedAt: '2026-05-01T10:00:00Z',
  },
  {
    id: '2',
    title: 'Midnight in Joburg',
    artist: 'Thabo Sello',
    artistWallet: 'FWmqK9aZ3TQxabEHf82soKhHfAL6P8XVRAqr48Y9KK8V',
    ipfsHash: 'QmDemoSoundHelix2',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    pricePerStream: 12000,
    streamCount: 89,
    genre: 'Amapiano',
    uploadedAt: '2026-05-03T18:30:00Z',
  },
  {
    id: '3',
    title: 'Saltwater',
    artist: 'Naima Khouri',
    artistWallet: '9TioLgSwShrs3Qz4HGPP1cgtGSjNeSXgGLodMFuMUSfj',
    ipfsHash: 'QmDemoSoundHelix3',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    pricePerStream: 8000,
    streamCount: 34,
    genre: 'Indie folk',
    uploadedAt: '2026-05-06T08:15:00Z',
  },
]

export async function GET() {
  return NextResponse.json({ tracks: DEMO_TRACKS })
}
