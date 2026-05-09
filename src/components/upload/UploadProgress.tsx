interface UploadProgressProps {
  status: 'idle' | 'checking' | 'uploading' | 'done' | 'error'
  message: string
}

export function UploadProgress({ status, message }: UploadProgressProps) {
  if (status === 'idle') return null
  const colorClass =
    status === 'done' ? 'text-green-600' : status === 'error' ? 'text-red-500' : 'text-gray-500'
  return <p className={`text-sm mt-4 text-center ${colorClass}`}>{message}</p>
}
