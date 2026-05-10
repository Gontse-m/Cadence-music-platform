'use client'

import { useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useTracksStore } from '@/store/tracksStore'
import { usePlayerStore } from '@/store/playerStore'

export default function DashboardPage() {
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const uploadedTracks = useTracksStore((s) => s.uploadedTracks)
  const removeUploadedTrack = useTracksStore((s) => s.removeUploadedTrack)
  const setTrack = usePlayerStore((s) => s.setTrack)

  const myTracks = useMemo(() => {
    if (!publicKey) return []
    const me = publicKey.toBase58()
    return uploadedTracks.filter((t) => t.artistWallet === me)
  }, [uploadedTracks, publicKey])

  const Background = () => (
    <div
      className="fixed inset-0 -z-10 bg-cover bg-center"
      style={{ backgroundImage: "url('/backgrounds/dashboard.jpg')" }}
      aria-hidden
    />
  )

  if (!connected) {
    return (
      <>
        <Background />
        <div className="flex-1 flex items-center justify-center px-6 py-24">
          <div className="max-w-lg w-full text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12">
            <h1 className="font-mael text-4xl font-bold text-white mb-4 drop-shadow-lg">Artist dashboard</h1>
            <p className="text-white/80 mb-8 drop-shadow">Connect your wallet to view your earnings and streams.</p>
            <button
              onClick={() => setVisible(true)}
              className="bg-burgundy text-white px-8 py-3 rounded-full font-medium hover:bg-burgundy-dark transition-colors"
            >
              Connect wallet
            </button>
          </div>
        </div>
      </>
    )
  }

  // Sum of all stream counts for this artist's tracks (placeholder until on-chain indexer)
  const totalStreams = myTracks.reduce((sum, t) => sum + (t.streamCount || 0), 0)

  return (
    <>
      <Background />
      <div className="pt-20 sm:pt-24 px-4 sm:px-6 max-w-5xl mx-auto w-full pb-20 sm:pb-24">
        <h1 className="font-mael text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">Your dashboard</h1>
        <p className="text-white/80 mb-8 sm:mb-10 text-xs sm:text-sm font-mono drop-shadow break-all">{publicKey?.toBase58()}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
          {[
            { label: 'Total earnings', value: '0.00 SOL' },
            { label: 'Total streams', value: String(totalStreams) },
            { label: 'Tracks uploaded', value: String(myTracks.length) },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 sm:p-6"
            >
              <p className="text-white/70 text-xs mb-1 drop-shadow">{label}</p>
              <p className="font-mael text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">{value}</p>
            </div>
          ))}
        </div>

        {/* Your uploads */}
        <div className="mb-10">
          <h2 className="font-mael text-xl font-semibold text-white mb-4 drop-shadow-lg">Your uploads</h2>
          {myTracks.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 text-center text-white/70 text-sm">
              No uploads yet — head to the Upload page to publish your first track.
            </div>
          ) : (
            <ul className="space-y-3">
              {myTracks.map((t) => (
                <li
                  key={t.id}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-burgundy/40 flex items-center justify-center text-2xl shrink-0">
                    🎵
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mael font-semibold text-white truncate">{t.title}</p>
                    <p className="text-white/60 text-xs truncate">
                      {t.genre || 'Untagged'} · {(t.pricePerStream / 1_000_000_000).toFixed(6)} SOL/stream · pinned <a href={t.audioUrl} target="_blank" rel="noreferrer" className="underline hover:text-mustard">{t.ipfsHash.slice(0, 8)}…</a>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setTrack(t)}
                      className="text-xs px-3 py-1.5 rounded-full bg-mustard text-white hover:bg-mustard-dark transition-colors"
                    >
                      Play
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove "${t.title}" from your local catalogue? (The IPFS pin stays.)`)) {
                          removeUploadedTrack(t.id)
                        }
                      }}
                      className="text-xs px-3 py-1.5 rounded-full border border-white/30 text-white/80 hover:bg-white/10 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="font-mael text-xl font-semibold text-white mb-4 drop-shadow-lg">Recent payments</h2>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 text-center text-white/70 text-sm">
            No payments yet — payments hit your wallet directly. Check Phantom for incoming SOL transfers.
          </div>
        </div>
      </div>
    </>
  )
}
