'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { WalletButton } from '@/components/ui/WalletButton'

const links = [
  { href: '/discover', label: 'Discover' },
  { href: '/upload', label: 'Upload' },
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/setup', label: 'Setup' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-burgundy-darker text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-lg">
        <Link href="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <img
            src="/logo.png"
            alt="Cadence"
            className="h-8 w-8 sm:h-9 sm:w-9 object-contain transition-transform group-hover:scale-105"
          />
          <span className="font-mael text-xl sm:text-2xl font-bold tracking-wide text-white">
            Cadence
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-white hover:text-mustard transition-colors text-sm font-bold tracking-wide"
            >
              {label}
            </Link>
          ))}
          <WalletButton />
        </div>

        {/* Mobile: wallet button + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <WalletButton />
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {open ? (
                <>
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="6" y1="18" x2="18" y2="6" />
                </>
              ) : (
                <>
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
        <div
          className={`absolute top-[60px] left-0 right-0 bg-burgundy-darker border-t border-white/10 shadow-2xl transition-transform ${open ? 'translate-y-0' : '-translate-y-4'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex flex-col py-2">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-6 py-4 text-base font-bold tracking-wide border-b border-white/5 last:border-b-0 transition-colors ${
                  pathname === href ? 'text-mustard bg-white/5' : 'text-white hover:bg-white/5 hover:text-mustard'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
