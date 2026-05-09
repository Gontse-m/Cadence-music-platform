import { NextRequest, NextResponse } from 'next/server'

// Server-side stream-event log endpoint. Acts as a journal for analytics.
// Free-vs-paid enforcement is in the client hook (useStream) + on-chain via the Anchor program.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { trackId, walletAddress, isPaid, txSignature } = body
    if (!trackId || !walletAddress) {
      return NextResponse.json({ ok: false, error: 'trackId and walletAddress required' }, { status: 400 })
    }
    console.log('[stream]', { trackId, walletAddress, isPaid, txSignature, at: new Date().toISOString() })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
