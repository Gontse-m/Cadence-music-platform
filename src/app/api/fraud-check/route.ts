import { NextRequest, NextResponse } from 'next/server'
import { checkWalletRisk } from '@/lib/sardine'

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json()
    const result = await checkWalletRisk(walletAddress)
    return NextResponse.json(result)
  } catch (err: any) {
    // Fail open
    return NextResponse.json({ isSuspicious: false, riskScore: 'unknown' })
  }
}
