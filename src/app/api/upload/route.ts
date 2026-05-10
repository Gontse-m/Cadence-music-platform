import { NextRequest, NextResponse } from 'next/server'
import PinataClient from '@pinata/sdk'
import { Readable } from 'stream'

// Allow longer execution and larger bodies for audio uploads.
export const runtime = 'nodejs'
export const maxDuration = 180 // seconds — audio files can be 10MB+

const pinata = new PinataClient(
  process.env.PINATA_API_KEY!,
  process.env.PINATA_SECRET_KEY!,
)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File | null
    const metadataRaw = formData.get('metadata') as string | null

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: 'No audio file in request' },
        { status: 400 },
      )
    }

    const metadata = metadataRaw ? JSON.parse(metadataRaw) : {}

    const bytes = await audioFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const stream = Readable.from(buffer)

    // Pinata SDK requires a name on the stream when using `pinFileToIPFS`.
    // Without it, large uploads sometimes hang on the request boundary.
    ;(stream as any).path = audioFile.name || 'audio.mp3'

    const audioResult = await pinata.pinFileToIPFS(stream, {
      pinataMetadata: {
        name: `${metadata.title || 'untitled'} - ${metadata.artist || 'unknown'}`,
      },
    })

    return NextResponse.json({
      success: true,
      ipfsHash: audioResult.IpfsHash,
      audioUrl: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY}${audioResult.IpfsHash}`,
    })
  } catch (err: any) {
    console.error('[upload] failed:', err?.message, err?.response?.data)
    const detail = err?.response?.data?.error || err?.message || 'unknown'
    return NextResponse.json(
      { success: false, error: typeof detail === 'string' ? detail : JSON.stringify(detail) },
      { status: 500 },
    )
  }
}
