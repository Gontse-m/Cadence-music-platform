'use client'

import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'

export function WalletButton() {
  const { setVisible } = useWalletModal()
  const { connected, publicKey, disconnect } = useWallet()

  if (connected && publicKey) {
    const address = publicKey.toBase58()
    const short = `${address.slice(0, 4)}...${address.slice(-4)}`
    return (
      <button
        onClick={() => disconnect()}
        className="bg-mustard text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-mustard-dark transition-colors"
      >
        {short}
      </button>
    )
  }

  return (
    <button
      onClick={() => setVisible(true)}
      className="bg-mustard text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-mustard-dark transition-colors"
    >
      Connect wallet
    </button>
  )
}
