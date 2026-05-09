import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortAddress(address: string, chars = 4) {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

export function lamportsToSol(lamports: number) {
  return lamports / 1_000_000_000
}
