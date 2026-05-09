export function HowItWorks() {
  const steps = [
    { step: '01', title: 'Connect your wallet', body: 'Link your Phantom wallet. It takes 10 seconds.' },
    { step: '02', title: 'First listen is free', body: 'Discover new artists without spending a cent. Every song gets one free play.' },
    { step: '03', title: 'Replay pays the artist', body: 'Loved it? Hit play again. A tiny payment goes directly to the artist — instantly, on-chain.' },
  ]
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <h2 className="font-mael text-4xl font-bold text-center text-burgundy mb-16">How Cadence works</h2>
      <div className="grid grid-cols-3 gap-12">
        {steps.map(({ step, title, body }) => (
          <div key={step} className="text-center">
            <div className="text-mustard font-mael text-5xl font-bold mb-4">{step}</div>
            <h3 className="font-mael text-xl font-semibold text-burgundy mb-2">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
