export interface Track {
  id: string
  title: string
  artist: string
  artistWallet: string
  ipfsHash: string
  audioUrl: string
  coverUrl?: string
  pricePerStream: number   // in lamports (1 USDC = 1_000_000 lamports)
  streamCount: number
  lyrics?: string
  narrationUrl?: string   // ElevenLabs TTS intro — played before first free stream
  genre?: string
  uploadedAt: string
}

export interface StreamSession {
  trackId: string
  walletAddress: string
  playCount: number
  lastPlayedAt: string
}

export interface PaymentRecord {
  trackId: string
  listenerWallet: string
  artistWallet: string
  amount: number
  txSignature: string
  timestamp: string
}

export interface UploadFormData {
  title: string
  artist: string
  genre: string
  pricePerStream: number
  audioFile: File
  coverFile?: File
}

export interface FraudCheckResult {
  isSuspicious: boolean
  riskScore: number
  reason?: string
}

export interface FingerprintResult {
  isDuplicate: boolean
  matchedTrack?: string
  confidence?: number
}
