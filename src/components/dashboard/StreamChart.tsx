'use client'

// Simple inline SVG sparkline — no chart library to keep bundle small for the demo.
interface StreamChartProps {
  data?: number[]
}

export function StreamChart({ data = [3, 5, 4, 8, 6, 12, 9] }: StreamChartProps) {
  const max = Math.max(...data, 1)
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${100 - (v / max) * 100}`)
    .join(' ')

  return (
    <div className="border border-gray-200 rounded-xl p-6">
      <h3 className="font-mael text-lg font-semibold text-burgundy mb-4">Streams over time</h3>
      <svg viewBox="0 0 100 100" className="w-full h-32" preserveAspectRatio="none">
        <polyline fill="none" stroke="#722F37" strokeWidth="1.5" points={points} />
      </svg>
    </div>
  )
}
