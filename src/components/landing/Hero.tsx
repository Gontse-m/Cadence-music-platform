import Link from 'next/link'

export function Hero() {
  return (
    <section className="bg-burgundy text-white py-32 px-6 text-center">
      <h1 className="font-mael text-6xl font-bold mb-6 leading-tight">
        Music that pays<br />artists directly.
      </h1>
      <p className="text-white/70 text-xl max-w-xl mx-auto mb-10">
        First listen is free. Every replay sends a micropayment straight to the artist — no label, no middleman, no delay.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/discover"
          className="bg-mustard text-white px-8 py-3 rounded-full font-medium hover:bg-mustard-dark transition-colors"
        >
          Start listening
        </Link>
        <Link
          href="/upload"
          className="border border-white/40 text-white px-8 py-3 rounded-full font-medium hover:border-white transition-colors"
        >
          Upload your music
        </Link>
      </div>
    </section>
  )
}
