import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import type { WalletContextState } from '@solana/wallet-adapter-react'

export function getProgramId() {
  const id = process.env.NEXT_PUBLIC_PROGRAM_ID
  if (!id || id === 'YOUR_DEPLOYED_PROGRAM_ID') return null
  return new PublicKey(id)
}

export function getProvider(connection: Connection, wallet: WalletContextState) {
  if (!wallet.publicKey || !wallet.signTransaction || !wallet.signAllTransactions) return null
  return new AnchorProvider(
    connection,
    {
      publicKey: wallet.publicKey,
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
    } as any,
    AnchorProvider.defaultOptions(),
  )
}

export { Program, web3 }
