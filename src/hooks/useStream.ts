'use client'

import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js'
import { useTracksStore } from '@/store/tracksStore'
import { Track } from '@/types'

export function useStream() {
  const { publicKey, sendTransaction } = useWallet()
  const { connection } = useConnection()
  const { getPlayCount, incrementPlayCount } = useTracksStore()

  const handlePlay = async (track: Track): Promise<{ allowed: boolean; isPaid: boolean; error?: string }> => {
    if (!publicKey) {
      return { allowed: false, isPaid: false, error: 'Connect your wallet to stream.' }
    }

    const walletAddress = publicKey.toBase58()

    // Check fraud via Sardine before allowing any stream
    const fraudRes = await fetch('/api/fraud-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletAddress }),
    })
    const { isSuspicious } = await fraudRes.json()
    if (isSuspicious) {
      return { allowed: false, isPaid: false, error: 'Unusual activity detected on this wallet.' }
    }

    const playCount = getPlayCount(track.id, walletAddress)

    // First listen is free
    if (playCount === 0) {
      incrementPlayCount(track.id, walletAddress)
      return { allowed: true, isPaid: false }
    }

    // Subsequent listens require micropayment
    try {
      const artistPublicKey = new PublicKey(track.artistWallet)
      const platformPublicKey = new PublicKey(process.env.NEXT_PUBLIC_PLATFORM_WALLET!)

      const streamCost = track.pricePerStream // in lamports
      const platformFee = Math.floor(streamCost * 0.15) // 15% platform cut
      const artistShare = streamCost - platformFee

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: artistPublicKey,
          lamports: artistShare,
        }),
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: platformPublicKey,
          lamports: platformFee,
        })
      )

      const signature = await sendTransaction(transaction, connection)
      await connection.confirmTransaction(signature, 'confirmed')

      incrementPlayCount(track.id, walletAddress)
      return { allowed: true, isPaid: true }
    } catch (err: any) {
      return { allowed: false, isPaid: false, error: err.message || 'Payment failed.' }
    }
  }

  return { handlePlay }
}
