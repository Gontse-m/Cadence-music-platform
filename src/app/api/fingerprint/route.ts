import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { buildStringToSign, sign } from '@/lib/acrcloud'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File
    const bytes = await audioFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const host = process.env.ACRCLOUD_HOST!
    const accessKey = process.env.ACRCLOUD_ACCESS_KEY!
    const accessSecret = process.env.ACRCLOUD_ACCESS_SECRET!
    const uri = '/v1/identify'
    const dataType = 'audio'
    const signatureVersion = '1'
    const timestamp = String(Math.floor(Date.now() / 1000))

    const stringToSign = buildStringToSign('POST', uri, accessKey, dataType, signatureVersion, timestamp)
    const signature = sign(stringToSign, accessSecret)

    const form = new FormData()
    form.append('sample', new Blob([buffer]), 'audio.mp3')
    form.append('access_key', accessKey)
    form.append('data_type', dataType)
    form.append('signature_version', signatureVersion)
    form.append('signature', signature)
    form.append('sample_bytes', String(buffer.length))
    form.append('timestamp', timestamp)

    const response = await axios.post(`https://${host}${uri}`, form, {
      timeout: 45_000,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    })
    const result = response.data

    const isDuplicate = result.status?.code === 0
    const matchedTrack = isDuplicate
      ? `${result.metadata?.music?.[0]?.title} by ${result.metadata?.music?.[0]?.artists?.[0]?.name}`
      : undefined

    return NextResponse.json({ isDuplicate, matchedTrack })
  } catch (err: any) {
    return NextResponse.json({ isDuplicate: false, error: err.message })
  }
}
