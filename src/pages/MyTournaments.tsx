import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MainLayout } from '../components/MainLayout'
import { TournamentCard } from '../components/TournamentCard'
import { api } from '../lib/api'
import { Tournament } from '../types/tournament'

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-[oklch(22%_0_0)] bg-[oklch(17%_0_0)] overflow-hidden animate-pulse">
      <div className="h-1.5 bg-[oklch(22%_0_0)]" />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-12 rounded-md bg-[oklch(22%_0_0)]" />
          <div className="h-4 w-32 rounded bg-[oklch(22%_0_0)]" />
        </div>
        <div className="h-3 w-full rounded bg-[oklch(22%_0_0)]" />
        <div className="mt-2 pt-4 border-t border-[oklch(20%_0_0)] flex justify-between">
          <div className="h-3 w-24 rounded bg-[oklch(20%_0_0)]" />
        </div>
      </div>
    </div>
  )
}

export function MyTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getMyTournaments()
      .then(setTournaments)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar tus torneos'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">Mis torneos</h1>
            <p className="text-sm text-[oklch(42%_0_0)]">Torneos en los que participás o organizás</p>
          </div>
          <Link
            to="/tournaments/create"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[oklch(47%_0.28_283)] to-[oklch(54%_0.27_307)] text-white text-sm font-semibold hover:opacity-90 transition-all no-underline shadow-[0_4px_20px_oklch(49.1%_0.27_292.581/0.3)]"
          >
            <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            Crear torneo
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-[oklch(62%_0.22_25)/0.3] bg-[oklch(22%_0_0)] px-5 py-4 text-sm text-[oklch(62%_0.22_25)] mb-6">
            {error}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : tournaments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl border border-[oklch(24%_0_0)] bg-[oklch(18%_0_0)] flex items-center justify-center mb-5">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-[oklch(32%_0_0)]">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[oklch(45%_0_0)] mb-1">No estás en ningún torneo todavía</p>
            <p className="text-xs text-[oklch(32%_0_0)] mb-6">Anotate en un torneo existente o creá el tuyo</p>
            <div className="flex items-center gap-3">
              <Link
                to="/tournaments"
                className="px-4 py-2 rounded-lg border border-[oklch(28%_0_0)] text-sm text-[oklch(65%_0_0)] hover:text-white hover:border-[oklch(38%_0_0)] no-underline transition-all"
              >
                Ver torneos
              </Link>
              <Link
                to="/tournaments/create"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[oklch(47%_0.28_283)] to-[oklch(54%_0.27_307)] text-white text-sm font-semibold hover:opacity-90 transition-all no-underline"
              >
                Crear torneo
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournaments.map((t) => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
