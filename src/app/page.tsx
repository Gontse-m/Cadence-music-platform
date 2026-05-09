import Link from 'next/link'

export default function LandingPage() {
  return (
    <>
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/backgrounds/home.jpg')" }}
        aria-hidden
      />
      <div className="pt-16">
      {/* Hero — no card; image shows through. Text has a burgundy glow so it reads on any photo. */}
      <section className="py-32 px-6 text-center text-white">
        <h1 className="font-mael text-6xl font-bold mb-6 leading-tight [text-shadow:0_0_24px_#722F37,0_0_48px_#722F37,0_2px_6px_rgba(0,0,0,0.7)]">
          Music that pays<br />artists directly.
        </h1>
        <p className="text-xl max-w-xl mx-auto mb-10 [text-shadow:0_0_14px_#722F37,0_2px_4px_rgba(0,0,0,0.8)]">
          First listen is free. Every replay sends a micropayment straight to the artist — no label, no middleman, no delay.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/discover"
            className="bg-mustard text-white px-8 py-3 rounded-full font-medium hover:bg-mustard-dark transition-colors shadow-[0_0_30px_rgba(114,47,55,0.6)]"
          >
            Start listening
          </Link>
          <Link
            href="/upload"
            className="border border-white/40 text-white px-8 py-3 rounded-full font-medium hover:border-white transition-colors backdrop-blur-sm"
          >
            Upload your music
          </Link>
        </div>
      </section>

      {/* How it works — fully transparent so background image is visible */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className="font-mael text-4xl font-bold text-center text-white mb-16 drop-shadow-lg">
          How Cadence works
        </h2>
        <div className="grid grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Connect your wallet', body: 'Link your Phantom wallet. It takes 10 seconds.' },
            { step: '02', title: 'First listen is free', body: 'Discover new artists without spending a cent. Every song gets one free play.' },
            { step: '03', title: 'Replay pays the artist', body: 'Loved it? Hit play again. A tiny payment goes directly to the artist — instantly, on-chain.' },
          ].map(({ step, title, body }) => (
            <div
              key={step}
              className="text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-colors"
            >
              <div className="text-mustard font-mael text-5xl font-bold mb-4 drop-shadow">{step}</div>
              <h3 className="font-mael text-xl font-semibold text-white mb-2 drop-shadow">{title}</h3>
              <p className="text-white/80 text-sm leading-relaxed drop-shadow-sm">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Artist value prop — translucent panel sitting on the same image */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center bg-burgundy/60 backdrop-blur-md border border-white/10 rounded-3xl px-10 py-16">
          <h2 className="font-mael text-4xl font-bold text-white mb-6 drop-shadow-lg">
            Built for independent artists
          </h2>
          <p className="text-white/85 text-lg max-w-2xl mx-auto mb-10 drop-shadow">
            Spotify pays $0.004 per stream, then your label takes 75% of that. On Cadence, 85% of every stream goes directly to your wallet — instantly.
          </p>
          <Link
            href="/upload"
            className="bg-mustard text-white px-8 py-3 rounded-full font-medium hover:bg-mustard-dark transition-colors"
          >
            Upload your first track
          </Link>
        </div>
      </section>
      </div>
    </>
  )
}
