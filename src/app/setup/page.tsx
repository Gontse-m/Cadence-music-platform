import Link from 'next/link'

export const metadata = {
  title: 'Setup — Cadence',
  description: 'Install Phantom, switch to devnet, and connect to Cadence in 3 minutes.',
}

const steps = [
  {
    n: '01',
    title: 'Install Phantom',
    body: 'Phantom is a free Solana wallet that lives in your browser. We recommend it because every demo flow is tested against it.',
    cta: { href: 'https://phantom.app/download', label: 'Get Phantom' },
    detail: [
      'Open phantom.app in Chrome, Brave, Firefox, or Edge.',
      'Click "Add to Browser" — the extension installs in about 5 seconds.',
      'Pin the Phantom icon to your toolbar so you can reach it easily.',
    ],
  },
  {
    n: '02',
    title: 'Create or import a wallet',
    body: 'You can spin up a brand-new wallet in 30 seconds, or import an existing one with a recovery phrase.',
    detail: [
      'Click the Phantom icon → "Create new wallet".',
      'Set a strong password (this unlocks the extension on your device only).',
      'Phantom will show you a 12-word secret recovery phrase. Write it down on paper. Never store it in a screenshot, cloud note, or password manager you don\'t fully trust.',
    ],
  },
  {
    n: '03',
    title: 'Switch Phantom to Devnet',
    body: 'Cadence runs on Solana Devnet. This is a free test network — no real money is at risk.',
    detail: [
      'Open Phantom → Settings (gear icon) → "Developer Settings".',
      'Tap "Change Network" → select "Devnet".',
      'Your balance will reset to 0 SOL — that\'s expected. Devnet wallets are separate from mainnet.',
    ],
  },
  {
    n: '04',
    title: 'Get free Devnet SOL',
    body: 'You need a tiny bit of devnet SOL to pay for replays. The Solana faucet gives it away for free.',
    cta: { href: 'https://faucet.solana.com', label: 'Open the faucet' },
    detail: [
      'Copy your wallet address from Phantom (click the address at the top of the extension).',
      'Open faucet.solana.com, paste the address, request 1 SOL.',
      'It lands in your wallet within seconds. 1 SOL covers thousands of replays at our 0.00001 SOL price.',
    ],
  },
  {
    n: '05',
    title: 'Connect to Cadence',
    body: 'You\'re ready. Hit the Connect wallet button in the top-right corner.',
    cta: { href: '/discover', label: 'Go to Discover' },
    detail: [
      'Click "Connect wallet" in the Cadence navbar.',
      'A wallet picker appears — choose Phantom.',
      'Phantom\'s popup asks you to approve the connection. Approve it. (If the popup doesn\'t appear, click the Phantom toolbar icon — the request is usually pending there.)',
      'Your wallet address now shows in the top-right. You can play, pay, and upload.',
    ],
  },
]

const precautions = [
  {
    title: 'Never share your recovery phrase',
    body: 'Anyone with your 12-word phrase has full control of your wallet. Cadence will never ask for it. Neither will Phantom support, Solana support, or any legitimate dApp.',
  },
  {
    title: 'Use a separate wallet for testing',
    body: 'For this hackathon demo we recommend creating a fresh wallet, not using one that holds real funds. Even though devnet is sandboxed, good hygiene means keeping testing wallets separate from production wallets.',
  },
  {
    title: 'Devnet is play money',
    body: 'Every SOL transfer you make on Cadence right now is on Solana Devnet — a test network. Tokens have no real value. The same code on mainnet would settle real money in under a second.',
  },
  {
    title: 'Always verify the URL',
    body: 'Phishing wallets are the #1 attack vector in crypto. Bookmark the real Cadence URL and only connect from there. If a connection prompt looks off — wrong domain, unexpected permissions — reject it.',
  },
  {
    title: 'Approve transactions consciously',
    body: 'When Phantom shows a transaction prompt, read what it does. On Cadence, the only transactions you should ever sign are: (a) connecting your wallet (no SOL moves), and (b) paying for a replay (two transfers totalling the track\'s price).',
  },
]

export default function SetupPage() {
  return (
    <>
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url('/backgrounds/home.jpg')" }}
        aria-hidden
      />
      <div className="pt-24 px-6 max-w-4xl mx-auto pb-24">
        <h1 className="font-mael text-5xl font-bold text-white mb-3 [text-shadow:0_0_24px_rgba(114,47,55,0.95),0_0_48px_rgba(114,47,55,0.7),0_2px_8px_rgba(0,0,0,0.6)]">
          Get started with Cadence
        </h1>
        <p className="text-white text-lg mb-12 font-medium [text-shadow:0_0_12px_rgba(114,47,55,0.85),0_2px_6px_rgba(0,0,0,0.7)]">
          Install a wallet, switch to devnet, and start streaming in about three minutes. No real money, no credit card.
        </p>

        {/* Steps */}
        <div className="space-y-6 mb-16">
          {steps.map(({ n, title, body, cta, detail }) => (
            <div
              key={n}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8"
            >
              <div className="flex items-start gap-6">
                <div className="font-mael text-5xl font-bold text-mustard drop-shadow shrink-0">
                  {n}
                </div>
                <div className="flex-1">
                  <h2 className="font-mael text-2xl font-bold text-white mb-2 drop-shadow-lg">
                    {title}
                  </h2>
                  <p className="text-white/90 mb-4 drop-shadow">{body}</p>
                  <ol className="list-decimal list-inside space-y-2 text-white/85 text-sm leading-relaxed mb-4">
                    {detail.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ol>
                  {cta && (
                    cta.href.startsWith('http') ? (
                      <a
                        href={cta.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block bg-burgundy text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-burgundy-dark transition-colors shadow-[0_0_24px_rgba(114,47,55,0.5)]"
                      >
                        {cta.label} →
                      </a>
                    ) : (
                      <Link
                        href={cta.href}
                        className="inline-block bg-mustard text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-mustard-dark transition-colors"
                      >
                        {cta.label} →
                      </Link>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Precautions */}
        <div className="mb-16">
          <h2 className="font-mael text-3xl font-bold text-white mb-2 drop-shadow-lg">
            Precautions
          </h2>
          <p className="text-white/85 mb-8 drop-shadow">
            Wallets are powerful. A few habits keep your funds and identity safe.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {precautions.map(({ title, body }) => (
              <div
                key={title}
                className="bg-burgundy/30 backdrop-blur-md border border-mustard/30 rounded-2xl p-6"
              >
                <h3 className="font-mael text-lg font-bold text-mustard mb-2 [text-shadow:0_0_8px_rgba(255,255,255,0.6)]">
                  {title}
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
          <h2 className="font-mael text-2xl font-bold text-white mb-4 drop-shadow-lg">
            Troubleshooting
          </h2>
          <dl className="space-y-5 text-sm">
            <div>
              <dt className="font-bold text-mustard mb-1">The wallet picker opens but Phantom never prompts</dt>
              <dd className="text-white/85 leading-relaxed">
                Click the Phantom icon in your browser toolbar — the connection request is usually pending there. Phantom doesn&apos;t always auto-launch its popup on localhost.
              </dd>
            </div>
            <div>
              <dt className="font-bold text-mustard mb-1">Connection succeeds but my balance shows 0</dt>
              <dd className="text-white/85 leading-relaxed">
                Phantom is probably on Mainnet. Switch to Devnet (Step 03) and request airdrop SOL again (Step 04).
              </dd>
            </div>
            <div>
              <dt className="font-bold text-mustard mb-1">Faucet says &quot;rate limited&quot;</dt>
              <dd className="text-white/85 leading-relaxed">
                Wait 30 seconds and retry, or use the Solana CLI: <code className="text-white bg-black/40 px-1.5 py-0.5 rounded">solana airdrop 1 &lt;your-address&gt; --url devnet</code>.
              </dd>
            </div>
            <div>
              <dt className="font-bold text-mustard mb-1">Replay fails with &quot;Transaction simulation failed&quot;</dt>
              <dd className="text-white/85 leading-relaxed">
                Out of devnet SOL. Top up at faucet.solana.com.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  )
}
