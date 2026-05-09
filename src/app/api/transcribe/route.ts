import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

// ElevenLabs Speech-to-Text — fetches the audio URL server-side, then forwards as multipart.
// (The plan's `/v1/speech-to-speech/transcribe` endpoint does not exist.)
export async function POST(req: NextRequest) {
  try {
    const { audioUrl } = await req.json()
    if (!audioUrl) {
      return NextResponse.json({ lyrics: '', error: 'audioUrl required' }, { status: 400 })
    }

    const audioRes = await axios.get(audioUrl, { responseType: 'arraybuffer' })
    const audioBuffer = Buffer.from(audioRes.data)

    const form = new FormData()
    form.append('model_id', 'scribe_v1')
    form.append('file', new Blob([audioBuffer], { type: 'audio/mpeg' }), 'audio.mp3')

    const response = await axios.post(
      'https://api.elevenlabs.io/v1/speech-to-text',
      form,
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      },
    )

    return NextResponse.json({ lyrics: response.data?.text || '' })
  } catch (err: any) {
    console.error('[transcribe] failed:', err?.response?.status, err?.response?.data, err.message)
    const data = err?.response?.data
    const detail = data?.detail?.message || data?.detail || data?.message || err.message || 'unknown'
    return NextResponse.json({
      lyrics: '',
      status: err?.response?.status,
      error: typeof detail === 'string' ? detail : JSON.stringify(detail),
    })
  }
}
