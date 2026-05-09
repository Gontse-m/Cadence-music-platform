import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: NextRequest) {
  try {
    const { trackTitle, artistName, genre } = await req.json()

    const narrationText = `Now playing: ${trackTitle} by ${artistName}. A ${genre || 'indie'} track on Cadence — where every replay pays the artist directly.`

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
      {
        text: narrationText,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY!,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        responseType: 'arraybuffer',
      }
    )

    const base64Audio = Buffer.from(response.data).toString('base64')
    return NextResponse.json({
      success: true,
      audioBase64: base64Audio,
      mimeType: 'audio/mpeg',
    })
  } catch (err: any) {
    console.error('ElevenLabs narrate failed:', err.message)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
