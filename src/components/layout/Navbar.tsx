'use client'

import Link from 'next/link'
import { WalletButton } from '@/components/ui/WalletButton'

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-burgundy-darker text-white px-6 py-4 flex items-center justify-between shadow-lg">
      <Link href="/" className="flex items-center gap-2 group">
        <img
          src="/logo.png"
          alt="Cadence"
          className="h-9 w-9 object-contain transition-transform group-hover:scale-105"
        />
        <span className="font-mael text-2xl font-bold tracking-wide text-white">
          Cadence
        </span>
      </Link>
      <div className="flex items-center gap-8">
        <Link href="/discover" className="text-white hover:text-mustard transition-colors text-sm font-bold tracking-wide">
          Discover
        </Link>
        <Link href="/upload" className="text-white hover:text-mustard transition-colors text-sm font-bold tracking-wide">
          Upload
        </Link>
        <Link href="/dashboard" className="text-white hover:text-mustard transition-colors text-sm font-bold tracking-wide">
          Dashboard
        </Link>
        <WalletButton />
      </div>
    </nav>
  )
}
