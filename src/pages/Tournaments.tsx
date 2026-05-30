import { useEffect, useState } from 'react'
import { MainLayout } from '../components/MainLayout'
import { TournamentCard } from '../components/TournamentCard'
import { api } from '../lib/api'
import { Tournament, GameString, GAME_CONFIG } from '../types/tournament'

type GameFilter = 'all' | GameString

const FILTERS: { value: GameFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'leagueoflegends', label: GAME_CONFIG.leagueoflegends.label },
  { value: 'valorant', label: GAME_CONFIG.valorant.label },
  { value: 'cs2', label: GAME_CONFIG.cs2.label },
]

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
        <div className="h-3 w-3/4 rounded bg-[oklch(22%_0_0)]" />
        <div className="mt-2 flex gap-4">
          <div className="h-3 w-20 rounded bg-[oklch(20%_0_0)]" />
          <div className="h-3 w-24 rounded bg-[oklch(20%_0_0)]" />
        </div>
        <div className="mt-2 pt-4 border-t border-[oklch(20%_0_0)] flex justify-between">
          <div className="h-3 w-24 rounded bg-[oklch(20%_0_0)]" />
          <div className="h-4 w-20 rounded-full bg-[oklch(20%_0_0)]" />
        </div>
      </div>
    </div>
  )
}

export function Tournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<GameFilter>('all')

  useEffect(() => {
    api.getTournaments()
      .then(setTournaments)
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar los torneos'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all'
    ? tournaments
    : tournaments.filter((t) => t.game === filter)

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-1">Torneos</h1>
          <p className="text-sm text-[oklch(42%_0_0)]">Encontrá torneos y anotate con tu facultad</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 mb-8 flex-wrap">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer border ${
                filter === value
                  ? 'text-white bg-[oklch(49.1%_0.27_292.581/0.15)] border-[oklch(49.1%_0.27_292.581/0.4)]'
                  : 'text-[oklch(45%_0_0)] bg-transparent border-[oklch(22%_0_0)] hover:text-white hover:border-[oklch(30%_0_0)]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-[oklch(62%_0.22_25)/0.3] bg-[oklch(22%_0_0)] px-5 py-4 text-sm text-[oklch(62%_0.22_25)] mb-6">
            {error}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-2xl border border-[oklch(24%_0_0)] bg-[oklch(18%_0_0)] flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-[oklch(35%_0_0)]">
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[oklch(45%_0_0)]">No hay torneos disponibles</p>
            <p className="text-xs text-[oklch(32%_0_0)] mt-1">Probá cambiando el filtro de juego</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((t) => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}
