import axios from 'axios'

export async function checkWalletRisk(walletAddress: string) {
  try {
    const response = await axios.post(
      `${process.env.SARDINE_API_URL}/v1/customers`,
      {
        flow: 'stream',
        customerId: walletAddress,
        paymentMethodType: 'crypto',
      },
      {
        auth: {
          username: process.env.SARDINE_CLIENT_ID!,
          password: process.env.SARDINE_SECRET_KEY!,
        },
        timeout: 5000,
      },
    )
    const riskScore = response.data?.level ?? 'low'
    const isSuspicious = riskScore === 'high' || riskScore === 'very_high'
    return { isSuspicious, riskScore }
  } catch (err: any) {
    // Fail open
    return { isSuspicious: false, riskScore: 'unknown' as const }
  }
}
