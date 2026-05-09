'use client'

interface TrackFormProps {
  form: { title: string; genre: string; pricePerStream: string }
  onChange: (form: { title: string; genre: string; pricePerStream: string }) => void
}

export function TrackForm({ form, onChange }: TrackFormProps) {
  return (
    <div className="space-y-4 mb-8">
      <input
        type="text"
        placeholder="Track title"
        value={form.title}
        onChange={e => onChange({ ...form, title: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-burgundy"
      />
      <input
        type="text"
        placeholder="Genre (e.g. Afrobeats, Amapiano)"
        value={form.genre}
        onChange={e => onChange({ ...form, genre: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-burgundy"
      />
      <div>
        <label className="text-xs text-gray-500 mb-1 block">Price per stream (SOL)</label>
        <input
          type="number"
          step="0.000001"
          value={form.pricePerStream}
          onChange={e => onChange({ ...form, pricePerStream: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-burgundy"
        />
      </div>
    </div>
  )
}
