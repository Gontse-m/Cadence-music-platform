'use client'

import { useCallback, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useTracksStore } from '@/store/tracksStore'
import type { Track } from '@/types'

type Status = 'idle' | 'checking' | 'uploading' | 'transcribing' | 'narrating' | 'done' | 'error' | 'cancelled'

// Per-step timeouts. Anything longer means something is wrong, not slow.
const TIMEOUTS = {
  fingerprint: 60_000,
  upload: 180_000, // IPFS pin can be slow on big files
  transcribe: 60_000,
  narrate: 30_000,
}

// Wraps a fetch with both a user-cancel signal and a step timeout.
async function fetchStep(
  url: string,
  init: RequestInit,
  userSignal: AbortSignal,
  timeoutMs: number,
) {
  const timeoutCtrl = new AbortController()
  const timer = setTimeout(() => timeoutCtrl.abort(new DOMException('Step timed out', 'TimeoutError')), timeoutMs)

  // Bridge user cancel into the timeout controller so a single signal flows down.
  const onUserAbort = () => timeoutCtrl.abort(userSignal.reason)
  userSignal.addEventListener('abort', onUserAbort, { once: true })

  try {
    const res = await fetch(url, { ...init, signal: timeoutCtrl.signal })
    return res
  } finally {
    clearTimeout(timer)
    userSignal.removeEventListener('abort', onUserAbort)
  }
}

export default function UploadPage() {
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [form, setForm] = useState({ title: '', genre: '', pricePerStream: '0.00001' })
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const abortRef = useRef<AbortController | null>(null)
  const addUploadedTrack = useTracksStore((s) => s.addUploadedTrack)

  const onDrop = useCallback((files: File[]) => {
    if (files[0]) setAudioFile(files[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': ['.mp3', '.wav', '.flac', '.m4a'] },
    maxFiles: 1,
    disabled: status === 'checking' || status === 'uploading' || status === 'transcribing' || status === 'narrating',
  })

  const inFlight = status === 'checking' || status === 'uploading' || status === 'transcribing' || status === 'narrating'

  const handleCancel = () => {
    abortRef.current?.abort(new DOMException('User cancelled', 'AbortError'))
    abortRef.current = null
    setStatus('cancelled')
    setMessage('Upload cancelled.')
  }

  const handleUpload = async () => {
    if (!audioFile || !publicKey) return

    abortRef.current = new AbortController()
    const signal = abortRef.current.signal

    try {
      // Step 1 — Fingerprint
      setStatus('checking')
      setMessage('Checking for duplicate tracks (ACRCloud)...')
      const fpForm = new FormData()
      fpForm.append('audio', audioFile)
      const fpRes = await fetchStep(
        '/api/fingerprint',
        { method: 'POST', body: fpForm },
        signal,
        TIMEOUTS.fingerprint,
      )
      if (!fpRes.ok) throw new Error(`Fingerprint check failed (HTTP ${fpRes.status})`)
      const { isDuplicate, matchedTrack, error: fpErr } = await fpRes.json()
      if (fpErr) throw new Error(`Fingerprint error: ${fpErr}`)
      if (isDuplicate) {
        setStatus('error')
        setMessage(`This track already exists on Cadence (matched: ${matchedTrack}).`)
        return
      }

      // Step 2 — Upload to IPFS
      setStatus('uploading')
      setMessage('Uploading to IPFS via Pinata...')
      const uploadForm = new FormData()
      uploadForm.append('audio', audioFile)
      uploadForm.append(
        'metadata',
        JSON.stringify({ ...form, artist: form.title || 'Unknown', artistWallet: publicKey.toBase58() }),
      )
      const uploadRes = await fetchStep(
        '/api/upload',
        { method: 'POST', body: uploadForm },
        signal,
        TIMEOUTS.upload,
      )
      const uploadJson = await uploadRes.json().catch(() => ({}))
      if (!uploadRes.ok || !uploadJson.success) {
        throw new Error(`IPFS upload failed: ${uploadJson.error || `HTTP ${uploadRes.status}`}`)
      }
      const { ipfsHash, audioUrl } = uploadJson

      // Persist the new track locally so it shows up on /discover and /dashboard.
      const priceSol = parseFloat(form.pricePerStream || '0') || 0
      const newTrack: Track = {
        id: ipfsHash,
        title: form.title || 'Untitled',
        artist: publicKey.toBase58().slice(0, 4) + '…' + publicKey.toBase58().slice(-4),
        artistWallet: publicKey.toBase58(),
        ipfsHash,
        audioUrl,
        pricePerStream: Math.round(priceSol * 1_000_000_000), // SOL → lamports
        streamCount: 0,
        genre: form.genre || undefined,
        uploadedAt: new Date().toISOString(),
      }
      addUploadedTrack(newTrack)

      // Step 3 — Transcribe (non-fatal — instrumental tracks return empty lyrics)
      setStatus('transcribing')
      setMessage('Transcribing lyrics with Eleven Labs...')
      try {
        await fetchStep(
          '/api/transcribe',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ audioUrl }),
          },
          signal,
          TIMEOUTS.transcribe,
        )
      } catch (e) {
        if ((e as any)?.name === 'AbortError') throw e
        // swallow — transcription failure shouldn't block upload
        console.warn('[upload] transcribe failed', e)
      }

      // Step 4 — Narrate (non-fatal)
      setStatus('narrating')
      setMessage('Generating AI intro narration with Eleven Labs...')
      try {
        await fetchStep(
          '/api/narrate',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              trackTitle: form.title,
              artistName: publicKey.toBase58().slice(0, 6) + '...',
              genre: form.genre,
            }),
          },
          signal,
          TIMEOUTS.narrate,
        )
      } catch (e) {
        if ((e as any)?.name === 'AbortError') throw e
        console.warn('[upload] narrate failed', e)
      }

      setStatus('done')
      setMessage(`Track uploaded! IPFS hash: ${ipfsHash}`)
    } catch (err: any) {
      if (err?.name === 'AbortError' || err?.name === 'TimeoutError') {
        if (status !== 'cancelled') {
          setStatus('error')
          setMessage(
            err.name === 'TimeoutError'
              ? `Step timed out: ${message}. Try a shorter audio file or check your connection.`
              : 'Upload cancelled.',
          )
        }
        return
      }
      console.error('[upload] failed:', err)
      setStatus('error')
      setMessage(err?.message || 'Upload failed.')
    } finally {
      abortRef.current = null
    }
  }

  const Background = () => (
    <div
      className="fixed inset-0 -z-10 bg-cover bg-center"
      style={{ backgroundImage: "url('/backgrounds/upload.jpg')" }}
      aria-hidden
    />
  )

  if (!connected) {
    return (
      <>
        <Background />
        <div className="flex-1 flex items-center justify-center px-6 py-24">
          <div className="max-w-lg w-full text-center bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12">
            <h1 className="font-mael text-4xl font-bold text-white mb-4 drop-shadow-lg">Upload your music</h1>
            <p className="text-white/80 mb-8 drop-shadow">Connect your wallet to start uploading and earning.</p>
            <button
              onClick={() => setVisible(true)}
              className="bg-burgundy text-white px-8 py-3 rounded-full font-medium hover:bg-burgundy-dark transition-colors"
            >
              Connect wallet
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Background />
      <div className="pt-20 sm:pt-24 px-4 sm:px-6 max-w-2xl mx-auto w-full pb-20 sm:pb-24">
        <h1 className="font-mael text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-lg">Upload a track</h1>
        <p className="text-white/80 mb-8 sm:mb-10 drop-shadow text-sm sm:text-base">
          Your music goes straight to IPFS. Fans pay you directly — no label cut.
        </p>

        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-5 sm:p-8 shadow-xl">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer mb-6 transition-colors ${
              isDragActive ? 'border-mustard bg-mustard-50' : 'border-gray-300 hover:border-burgundy'
            } ${inFlight ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <input {...getInputProps()} />
            {audioFile ? (
              <p className="text-burgundy font-medium">{audioFile.name}</p>
            ) : (
              <p className="text-gray-400">Drag your audio file here, or click to select</p>
            )}
          </div>

          <div className="space-y-4 mb-8">
            <input
              type="text"
              placeholder="Track title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              disabled={inFlight}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-burgundy disabled:bg-gray-50"
            />
            <input
              type="text"
              placeholder="Genre (e.g. Afrobeats, Amapiano)"
              value={form.genre}
              onChange={e => setForm({ ...form, genre: e.target.value })}
              disabled={inFlight}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-burgundy disabled:bg-gray-50"
            />
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Price per stream (SOL)</label>
              <input
                type="number"
                step="0.000001"
                value={form.pricePerStream}
                onChange={e => setForm({ ...form, pricePerStream: e.target.value })}
                disabled={inFlight}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-burgundy disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* Action row: upload + cancel side by side while in-flight */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleUpload}
              disabled={!audioFile || inFlight}
              className="flex-1 bg-burgundy text-white py-3 rounded-full font-medium hover:bg-burgundy-dark transition-colors disabled:opacity-50"
            >
              {inFlight ? message : status === 'done' ? 'Upload another' : 'Upload track'}
            </button>
            {inFlight && (
              <button
                onClick={handleCancel}
                className="px-6 py-3 rounded-full font-medium border border-red-400 text-red-600 hover:bg-red-50 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Live progress — visible only while a step is running */}
          {inFlight && (
            <div className="mt-5 space-y-1 text-xs text-gray-600">
              <Step label="Fingerprint check (ACRCloud)" done={status !== 'checking'} active={status === 'checking'} />
              <Step label="Upload to IPFS (Pinata)" done={status === 'transcribing' || status === 'narrating'} active={status === 'uploading'} />
              <Step label="Transcribe lyrics (Eleven Labs)" done={status === 'narrating'} active={status === 'transcribing'} />
              <Step label="Generate intro narration (Eleven Labs)" done={false} active={status === 'narrating'} />
            </div>
          )}

          {status === 'done' && (
            <p className="text-green-600 text-sm mt-4 text-center break-all">{message}</p>
          )}
          {status === 'error' && (
            <p className="text-red-600 text-sm mt-4 text-center break-words">{message}</p>
          )}
          {status === 'cancelled' && (
            <p className="text-gray-500 text-sm mt-4 text-center">{message}</p>
          )}
        </div>
      </div>
    </>
  )
}

function Step({ label, done, active }: { label: string; done: boolean; active: boolean }) {
  const icon = done ? '✓' : active ? '◌' : '·'
  const color = done ? 'text-green-600' : active ? 'text-burgundy font-semibold' : 'text-gray-400'
  return (
    <div className={`flex items-center gap-2 ${color}`}>
      <span className="w-3 inline-block">{icon}</span>
      <span>{label}</span>
    </div>
  )
}
