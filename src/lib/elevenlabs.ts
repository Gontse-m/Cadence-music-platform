import axios from 'axios'

const API_BASE = 'https://api.elevenlabs.io/v1'

export async function generateNarration(text: string) {
  const voiceId = process.env.ELEVENLABS_VOICE_ID!
  const response = await axios.post(
    `${API_BASE}/text-to-speech/${voiceId}`,
    {
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: { stability: 0.5, similarity_boost: 0.75 },
    },
    {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        'Content-Type': 'application/json',
        Accept: 'audio/mpeg',
      },
      responseType: 'arraybuffer',
    },
  )
  return Buffer.from(response.data)
}

export async function transcribeAudio(audioUrl: string) {
  const response = await axios.post(
    `${API_BASE}/speech-to-speech/transcribe`,
    { audio_url: audioUrl },
    {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        'Content-Type': 'application/json',
      },
    },
  )
  return response.data?.text || ''
}
