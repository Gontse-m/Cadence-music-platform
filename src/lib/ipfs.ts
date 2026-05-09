export const IPFS_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud/ipfs/'

export function ipfsUrl(hash: string) {
  return `${IPFS_GATEWAY}${hash}`
}
