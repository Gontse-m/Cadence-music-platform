import Link from 'next/link'

export function ArtistValueProp() {
  return (
    <section className="bg-burgundy-50 py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-mael text-4xl font-bold text-burgundy mb-6">Built for independent artists</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
          Spotify pays $0.004 per stream, then your label takes 75% of that. On Cadence, 85% of every stream goes directly to your wallet — instantly.
        </p>
        <Link
          href="/upload"
          className="bg-burgundy text-white px-8 py-3 rounded-full font-medium hover:bg-burgundy-dark transition-colors"
        >
          Upload your first track
        </Link>
      </div>
    </section>
  )
}
