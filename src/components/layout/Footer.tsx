import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="backdrop-blur-xl bg-white/10 border-t border-white/20 text-white px-6 pt-16 pb-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
        <div>
          <Link href="/" className="font-mael text-2xl font-bold tracking-wide">
            Cadence
          </Link>
          <p className="text-sm mt-3 leading-relaxed text-white/80">
            Solana-powered indie streaming. First listen free, every replay pays the artist directly.
          </p>
        </div>

        <div>
          <h4 className="font-mael text-sm font-semibold mb-4 uppercase tracking-wider">
            Product
          </h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href="/discover" className="hover:text-mustard transition-colors">Discover</Link></li>
            <li><Link href="/upload" className="hover:text-mustard transition-colors">Upload</Link></li>
            <li><Link href="/dashboard" className="hover:text-mustard transition-colors">Artist dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mael text-sm font-semibold mb-4 uppercase tracking-wider">
            Resources
          </h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-mustard transition-colors">GitHub</a></li>
            <li><a href="https://faucet.solana.com" target="_blank" rel="noreferrer" className="hover:text-mustard transition-colors">Solana devnet faucet</a></li>
            <li><a href="https://phantom.app" target="_blank" rel="noreferrer" className="hover:text-mustard transition-colors">Get Phantom</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mael text-sm font-semibold mb-4 uppercase tracking-wider">
            Legal
          </h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><a href="#" className="hover:text-mustard transition-colors">Terms of service</a></li>
            <li><a href="#" className="hover:text-mustard transition-colors">Privacy policy</a></li>
            <li><a href="#" className="hover:text-mustard transition-colors">Artist agreement</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-white/15 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/70">
        <p>© {year} Cadence. Built on Solana.</p>
        <p>Devnet build · {process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'}</p>
      </div>
    </footer>
  )
}
