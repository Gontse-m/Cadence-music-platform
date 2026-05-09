interface EarningsCardProps {
  label: string
  value: string
}

export function EarningsCard({ label, value }: EarningsCardProps) {
  return (
    <div className="bg-burgundy-50 rounded-xl p-6 border border-burgundy/10">
      <p className="text-gray-500 text-xs mb-1">{label}</p>
      <p className="font-mael text-3xl font-bold text-burgundy">{value}</p>
    </div>
  )
}
