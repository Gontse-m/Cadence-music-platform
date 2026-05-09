'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

export default function UploadPage() {
  const { connected, publicKey } = useWallet()
  const { setVisible } = useWalletModal()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [form, setForm] = useState({ title: '', genre: '', pricePerStream: '0.00001' })
  const [status, setStatus] = useState<'idle' | 'checking' | 'uploading' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const onDrop = useCallback((files: File[]) => {
    if (files[0]) setAudioFile(files[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': ['.mp3', '.wav', '.flac', '.m4a'] },
    maxFiles: 1,
  })

  const handleUpload = async () => {
    if (!audioFile || !publicKey) return

    setStatus('checking')
    setMessage('Checking for duplicate tracks...')
    const fpForm = new FormData()
    fpForm.append('audio', audioFile)
    const fpRes = await fetch('/api/fingerprint', { method: 'POST', body: fpForm })
    const { isDuplicate, matchedTrack } = await fpRes.json()

    if (isDuplicate) {
      setStatus('error')
      setMessage(`This track already exists on Cadence (matched: ${matchedTrack}).`)
      return
    }

    setStatus('uploading')
    setMessage('Uploading to IPFS...')
    const uploadForm = new FormData()
    uploadForm.append('audio', audioFile)
    uploadForm.append('metadata', JSON.stringify({ ...form, artistWallet: publicKey.toBase58() }))
    const uploadRes = await fetch('/api/upload', { method: 'POST', body: uploadForm })
    const { ipfsHash, audioUrl } = await uploadRes.json()

    setMessage('Transcribing lyrics with Eleven Labs...')
    await fetch('/api/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioUrl }),
    })

    setMessage('Generating AI intro narration...')
    await fetch('/api/narrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        trackTitle: form.title,
        artistName: publicKey.toBase58().slice(0, 6) + '...',
        genre: form.genre,
      }),
    })

    setStatus('done')
    setMessage(`Track uploaded! IPFS hash: ${ipfsHash}`)
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
      <div className="pt-24 px-6 max-w-2xl mx-auto w-full pb-24">
        <h1 className="font-mael text-4xl font-bold text-white mb-2 drop-shadow-lg">Upload a track</h1>
        <p className="text-white/80 mb-10 drop-shadow">
          Your music goes straight to IPFS. Fans pay you directly — no label cut.
        </p>

        <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-xl">
          {/* Drop zone */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer mb-6 transition-colors ${
              isDragActive ? 'border-mustard bg-mustard-50' : 'border-gray-300 hover:border-burgundy'
            }`}
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
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-burgundy"
            />
            <input
              type="text"
              placeholder="Genre (e.g. Afrobeats, Amapiano)"
              value={form.genre}
              onChange={e => setForm({ ...form, genre: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-burgundy"
            />
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Price per stream (SOL)</label>
              <input
                type="number"
                step="0.000001"
                value={form.pricePerStream}
                onChange={e => setForm({ ...form, pricePerStream: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-burgundy"
              />
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={!audioFile || status === 'uploading' || status === 'checking'}
            className="w-full bg-burgundy text-white py-3 rounded-full font-medium hover:bg-burgundy-dark transition-colors disabled:opacity-50"
          >
            {status === 'idle' ? 'Upload track' : message}
          </button>

          {status === 'done' && (
            <p className="text-green-600 text-sm mt-4 text-center">{message}</p>
          )}
          {status === 'error' && (
            <p className="text-red-500 text-sm mt-4 text-center">{message}</p>
          )}
        </div>
      </div>
    </>
  )
}
