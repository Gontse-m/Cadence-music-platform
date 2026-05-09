'use client'

import { useDropzone } from 'react-dropzone'

interface DropZoneProps {
  audioFile: File | null
  onDrop: (files: File[]) => void
}

export function DropZone({ audioFile, onDrop }: DropZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': ['.mp3', '.wav', '.flac', '.m4a'] },
    maxFiles: 1,
  })

  return (
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
  )
}
