import type { Metadata, Viewport } from 'next'
import './globals.css'
import { WalletProvider } from '@/providers/WalletProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PlayerBar } from '@/components/layout/PlayerBar'

export const metadata: Metadata = {
  title: 'Cadence — Music that pays artists directly',
  description: 'Stream indie music on Solana. First listen free, every replay sends a micropayment straight to the artist.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#4D1A22',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-mael text-gray-900 min-h-screen flex flex-col overflow-x-hidden">
        <WalletProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
          <PlayerBar />
        </WalletProvider>
      </body>
    </html>
  )
}
