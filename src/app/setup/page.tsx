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
      <div className="pt-20 sm:pt-24 px-4 sm:px-6 max-w-4xl mx-auto pb-20 sm:pb-24">
        <h1 className="font-mael text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 [text-shadow:0_0_24px_rgba(114,47,55,0.95),0_0_48px_rgba(114,47,55,0.7),0_2px_8px_rgba(0,0,0,0.6)]">
          Get started with Cadence
        </h1>
        <p className="text-white text-base sm:text-lg mb-6 font-medium [text-shadow:0_0_12px_rgba(114,47,55,0.85),0_2px_6px_rgba(0,0,0,0.7)]">
          Install a wallet, switch to devnet, and start streaming in about three minutes. No real money, no credit card.
        </p>

        {/* Mobile callout — links to the mobile section below */}
        <a
          href="#mobile"
          className="block bg-mustard/20 border border-mustard/50 backdrop-blur-md rounded-xl px-5 py-4 mb-10 sm:mb-12 hover:bg-mustard/30 transition-colors"
        >
          <p className="text-white text-sm sm:text-base">
            <span className="font-bold text-mustard">📱 On a phone?</span>{' '}
            The browser-extension flow doesn&apos;t apply. Skip to the{' '}
            <span className="underline">mobile guide below</span> — connecting via Phantom mobile is a different shape.
          </p>
        </a>

        {/* Steps */}
        <div className="space-y-5 sm:space-y-6 mb-12 sm:mb-16">
          {steps.map(({ n, title, body, cta, detail }) => (
            <div
              key={n}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-8"
            >
              <div className="flex items-start gap-4 sm:gap-6">
                <div className="font-mael text-3xl sm:text-5xl font-bold text-mustard drop-shadow shrink-0">
                  {n}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-mael text-xl sm:text-2xl font-bold text-white mb-2 drop-shadow-lg">
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

        {/* Mobile guide */}
        <div id="mobile" className="mb-12 sm:mb-16 scroll-mt-24">
          <h2 className="font-mael text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
            Connecting on mobile
          </h2>
          <p className="text-white/85 mb-6 sm:mb-8 drop-shadow text-sm sm:text-base">
            Mobile browsers don&apos;t have wallet extensions. You have two options — the in-app browser is the more reliable one.
          </p>

          {/* Option A — recommended */}
          <div className="bg-mustard/15 backdrop-blur-md border border-mustard/40 rounded-2xl p-5 sm:p-7 mb-4">
            <div className="flex items-start gap-3 mb-3">
              <span className="bg-mustard text-burgundy-darker text-xs font-bold px-2 py-1 rounded-full shrink-0">
                RECOMMENDED
              </span>
              <h3 className="font-mael text-lg sm:text-xl font-bold text-white drop-shadow">
                Option A — open Cadence inside the Phantom mobile app
              </h3>
            </div>
            <p className="text-white/85 text-sm leading-relaxed mb-3">
              Phantom mobile has a built-in dApp browser. When you visit Cadence from inside it, your wallet is already connected — no popups, no app-switching.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-white/85 text-sm leading-relaxed mb-4">
              <li>Install Phantom from the App Store (iOS) or Google Play (Android).</li>
              <li>Open Phantom → tap the <strong>globe / browser icon</strong> in the bottom navigation.</li>
              <li>Type the Cadence URL into the address bar (or paste it).</li>
              <li>The page loads with your wallet auto-connected. Hit play to stream.</li>
            </ol>
            <a
              href="https://phantom.app/download"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-burgundy text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-burgundy-dark transition-colors shadow-[0_0_24px_rgba(114,47,55,0.5)]"
            >
              Download Phantom mobile →
            </a>
          </div>

          {/* Option B — deep link */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-7 mb-4">
            <h3 className="font-mael text-lg sm:text-xl font-bold text-white mb-3 drop-shadow">
              Option B — Safari / Chrome with Phantom deep link
            </h3>
            <p className="text-white/85 text-sm leading-relaxed mb-3">
              If you want to use your normal mobile browser, the wallet adapter will hand off to the Phantom app via a deep link.
            </p>
            <ol className="list-decimal list-inside space-y-1.5 text-white/85 text-sm leading-relaxed">
              <li>Make sure the Phantom mobile app is installed and unlocked.</li>
              <li>Open Cadence in Safari (iOS) or Chrome (Android).</li>
              <li>Tap the hamburger menu → tap <strong>Connect wallet</strong>.</li>
              <li>Pick Phantom from the wallet picker. Your phone switches to the Phantom app.</li>
              <li>Approve the connection in Phantom.</li>
              <li>Tap your browser tab to come back — you&apos;ll see your wallet address in the navbar.</li>
            </ol>
          </div>

          {/* Mobile-specific devnet + faucet */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 sm:p-7">
            <h3 className="font-mael text-lg sm:text-xl font-bold text-white mb-3 drop-shadow">
              Switching to devnet + getting test SOL on mobile
            </h3>
            <ol className="list-decimal list-inside space-y-1.5 text-white/85 text-sm leading-relaxed">
              <li>Open the Phantom app → tap the <strong>profile icon</strong> (bottom-right).</li>
              <li>Tap the <strong>gear icon</strong> → <strong>Developer Settings</strong> → <strong>Testnet Mode</strong> → toggle on.</li>
              <li>Back on the home screen, tap the network selector and choose <strong>Solana Devnet</strong>.</li>
              <li>Tap your wallet address at the top of the Phantom screen to copy it.</li>
              <li>Open <a href="https://faucet.solana.com" target="_blank" rel="noreferrer" className="underline text-mustard hover:text-mustard-light">faucet.solana.com</a> in your mobile browser, paste the address, request 1 SOL.</li>
            </ol>
          </div>
        </div>

        {/* Precautions */}
        <div className="mb-12 sm:mb-16">
          <h2 className="font-mael text-2xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">
            Precautions
          </h2>
          <p className="text-white/85 mb-6 sm:mb-8 drop-shadow">
            Wallets are powerful. A few habits keep your funds and identity safe.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
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
            <div>
              <dt className="font-bold text-mustard mb-1">Mobile: tapping &quot;Connect wallet&quot; doesn&apos;t open Phantom</dt>
              <dd className="text-white/85 leading-relaxed">
                Make sure the Phantom app is installed and unlocked first. Some mobile browsers (notably iOS Safari in private mode) block deep links — switch to a normal Safari tab, or use the Phantom in-app browser instead.
              </dd>
            </div>
            <div>
              <dt className="font-bold text-mustard mb-1">Mobile: I approved in Phantom but my browser still says disconnected</dt>
              <dd className="text-white/85 leading-relaxed">
                Manually switch back to your browser tab. iOS in particular doesn&apos;t always auto-return after a deep link. If the address still doesn&apos;t show, refresh the page once.
              </dd>
            </div>
            <div>
              <dt className="font-bold text-mustard mb-1">Mobile: audio doesn&apos;t play automatically</dt>
              <dd className="text-white/85 leading-relaxed">
                Mobile browsers block autoplay. Tap the play button in the persistent player at the bottom of the screen — that counts as a user gesture and unlocks audio.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  )
}
