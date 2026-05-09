'use client'

import { PaymentRecord } from '@/types'

export function PaymentHistory({ payments = [] }: { payments?: PaymentRecord[] }) {
  return (
    <div>
      <h2 className="font-mael text-xl font-semibold text-burgundy mb-4">Recent payments</h2>
      {payments.length === 0 ? (
        <div className="border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
          No payments yet — upload a track to start earning.
        </div>
      ) : (
        <ul className="space-y-2">
          {payments.map(p => (
            <li
              key={p.txSignature}
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{p.trackId}</p>
                <p className="text-xs text-gray-500 font-mono">{p.listenerWallet.slice(0, 8)}…</p>
              </div>
              <span className="text-burgundy font-medium text-sm">
                {(p.amount / 1_000_000_000).toFixed(6)} SOL
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
