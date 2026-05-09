'use client'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <input
      type="search"
      placeholder="Search tracks or artists..."
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full max-w-md border border-gray-200 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-burgundy"
    />
  )
}
