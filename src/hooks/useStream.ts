'use client'

import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { useTracksStore } from '@/store/tracksStore'
import { Track } from '@/types'

// Try to construct a PublicKey, returning null if the value is missing/invalid.
// Used so a missing NEXT_PUBLIC_PLATFORM_WALLET degrades gracefully (artist gets 100%)
// instead of throwing "Invalid public key input" and blocking all paid replays.
function tryPublicKey(s: string | undefined | null): PublicKey | null {
  if (!s) return null
  if (s.startsWith('YOUR_') || s.startsWith('REPLACE_')) return null
  try {
    return new PublicKey(s)
  } catch {
    return null
  }
}

export function useStream() {
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const { getPlayCount, incrementPlayCount } = useTracksStore()

  const handlePlay = async (track: Track): Promise<{ allowed: boolean; isPaid: boolean; error?: string }> => {
    if (!publicKey) {
      return { allowed: false, isPaid: false, error: 'Connect your wallet to stream.' }
    }

    const walletAddress = publicKey.toBase58()
    const playCount = getPlayCount(track.id, walletAddress)
    console.log('[Cadence] handlePlay', { trackId: track.id, playCount, wallet: walletAddress.slice(0, 6) })

    // Fraud check (fail-open if Sardine errors)
    try {
      const fraudRes = await fetch('/api/fraud-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      })
      const { isSuspicious } = await fraudRes.json()
      if (isSuspicious) {
        return { allowed: false, isPaid: false, error: 'Unusual activity detected on this wallet.' }
      }
    } catch (e) {
      console.warn('[Cadence] fraud check failed, continuing', e)
    }

    // First listen is free
    if (playCount === 0) {
      incrementPlayCount(track.id, walletAddress)
      console.log('[Cadence] free listen granted')
      return { allowed: true, isPaid: false }
    }

    // Subsequent listens require micropayment
    const artistPublicKey = tryPublicKey(track.artistWallet)
    if (!artistPublicKey) {
      console.error('[Cadence] invalid artist wallet on track', track.artistWallet)
      return { allowed: false, isPaid: false, error: 'This track has an invalid artist wallet — cannot route payment.' }
    }

    const platformPublicKey = tryPublicKey(process.env.NEXT_PUBLIC_PLATFORM_WALLET)
    const streamCost = track.pricePerStream
    const platformFee = platformPublicKey ? Math.floor(streamCost * 0.15) : 0
    const artistShare = streamCost - platformFee

    if (!platformPublicKey) {
      console.warn('[Cadence] NEXT_PUBLIC_PLATFORM_WALLET not configured — sending 100% to artist')
    }

    try {
      const transaction = new Transaction()
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: artistPublicKey,
          lamports: artistShare,
        }),
      )
      if (platformPublicKey && platformFee > 0) {
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: publicKey,
            toPubkey: platformPublicKey,
            lamports: platformFee,
          }),
        )
      }

      console.log('[Cadence] requesting wallet signature for paid replay', {
        artist: artistPublicKey.toBase58().slice(0, 6),
        artistShareLamports: artistShare,
        platformFeeLamports: platformFee,
      })
      const signature = await sendTransaction(transaction, connection)
      console.log('[Cadence] tx submitted', signature)
      await connection.confirmTransaction(signature, 'confirmed')
      console.log('[Cadence] tx confirmed')

      incrementPlayCount(track.id, walletAddress)
      return { allowed: true, isPaid: true }
    } catch (err: any) {
      console.error('[Cadence] payment failed', err)
      return { allowed: false, isPaid: false, error: err?.message || 'Payment failed.' }
    }
  }

  return { handlePlay }
}
