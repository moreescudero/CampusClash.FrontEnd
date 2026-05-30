import { Link } from 'react-router-dom'
import { Tournament, GAME_CONFIG, STATUS_CONFIG, formatDate } from '../types/tournament'

interface Props {
  tournament: Tournament
}

export function TournamentCard({ tournament }: Props) {
  const game = GAME_CONFIG[tournament.game]
  const status = STATUS_CONFIG[tournament.status]
  const enrolledTeams = tournament.teams.length

  return (
    <Link
      to={`/tournaments/${tournament.id}`}
      className="group block rounded-2xl border border-[oklch(22%_0_0)] bg-[oklch(17%_0_0)] overflow-hidden hover:border-[oklch(30%_0_0)] transition-all duration-200 no-underline shadow-[0_2px_16px_oklch(0%_0_0/0.3)]"
    >
      {/* Game banner */}
      <div className={`h-1.5 bg-gradient-to-r ${game.gradient}`} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r ${game.gradient}`}>
              {game.shortLabel}
            </div>
            <h3 className="text-sm font-semibold text-white truncate group-hover:text-[oklch(75%_0.15_292.581)] transition-colors">
              {tournament.name}
            </h3>
          </div>
          <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.className}`}>
            {status.label}
          </span>
        </div>

        {/* Description */}
        {tournament.description && (
          <p className="text-xs text-[oklch(42%_0_0)] line-clamp-2 mb-4 leading-relaxed">
            {tournament.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-[oklch(38%_0_0)]">
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 shrink-0">
              <circle cx="6" cy="4" r="2.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M2 10c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {tournament.organizerUsername}
          </span>
          <span className="flex items-center gap-1.5">
            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3 shrink-0">
              <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M1 5h10" stroke="currentColor" strokeWidth="1.2" />
              <path d="M4 1v2M8 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            {formatDate(tournament.startDate)}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-[oklch(20%_0_0)] flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs">
            <div className="flex -space-x-1">
              {Array.from({ length: Math.min(enrolledTeams, 3) }).map((_, i) => (
                <div key={i} className="w-4 h-4 rounded-full bg-[oklch(25%_0_0)] border border-[oklch(17%_0_0)]" />
              ))}
            </div>
            <span className="text-[oklch(42%_0_0)]">
              {enrolledTeams}/{tournament.maxTeams} equipos
            </span>
          </div>
          {tournament.isInterUniversity ? (
            <span className="text-[10px] font-semibold text-[oklch(55%_0.12_292.581)] bg-[oklch(49.1%_0.27_292.581/0.08)] border border-[oklch(49.1%_0.27_292.581/0.2)] px-2 py-0.5 rounded-full">
              Inter-universitario
            </span>
          ) : (
            <span className="text-[10px] text-[oklch(35%_0_0)]">
              {tournament.universityName}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
