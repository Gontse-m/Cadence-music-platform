'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

export default function DashboardPage() {
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()

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

  return (
    <>
      <Background />
      <div className="pt-24 px-6 max-w-5xl mx-auto w-full pb-24">
        <h1 className="font-mael text-4xl font-bold text-white mb-2 drop-shadow-lg">Your dashboard</h1>
        <p className="text-white/80 mb-10 text-sm font-mono drop-shadow">{publicKey?.toBase58()}</p>

        <div className="grid grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total earnings', value: '0.00 SOL' },
            { label: 'Total streams', value: '0' },
            { label: 'Tracks uploaded', value: '0' },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6"
            >
              <p className="text-white/70 text-xs mb-1 drop-shadow">{label}</p>
              <p className="font-mael text-3xl font-bold text-white drop-shadow-lg">{value}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="font-mael text-xl font-semibold text-white mb-4 drop-shadow-lg">Recent payments</h2>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 text-center text-white/70 text-sm">
            No payments yet — upload a track to start earning.
          </div>
        </div>
      </div>
    </>
  )
}
