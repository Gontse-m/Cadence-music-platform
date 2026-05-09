import { NextRequest, NextResponse } from 'next/server'
import PinataClient from '@pinata/sdk'
import { Readable } from 'stream'

const pinata = new PinataClient(
  process.env.PINATA_API_KEY!,
  process.env.PINATA_SECRET_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File
    const metadata = JSON.parse(formData.get('metadata') as string)

    const bytes = await audioFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const stream = Readable.from(buffer)

    const audioResult = await pinata.pinFileToIPFS(stream, {
      pinataMetadata: { name: `${metadata.title} - ${metadata.artist}` },
    })

    return NextResponse.json({
      success: true,
      ipfsHash: audioResult.IpfsHash,
      audioUrl: `${process.env.NEXT_PUBLIC_PINATA_GATEWAY}${audioResult.IpfsHash}`,
    })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
