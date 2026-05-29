import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingLayout } from '../components/OnboardingLayout'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { api } from '../lib/api'

const REGIONS = [
  { value: 'LAS', label: 'LAS – Latinoamérica Sur' },
  { value: 'LAN', label: 'LAN – Latinoamérica Norte' },
  { value: 'NA', label: 'NA – Norteamérica' },
  { value: 'EUW', label: 'EUW – Europa Oeste' },
]

export function LinkRiot() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ summonerName: '', region: 'LAS' })

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.linkRiot(form)
      navigate('/success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo vincular la cuenta. Verificá el nombre.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <OnboardingLayout
      currentStep={4}
      title="Vinculá tu cuenta Riot"
      subtitle="Conectamos tu cuenta de League of Legends o Valorant para verificar tu nivel."
    >
      {/* Riot badge */}
      <div className="flex items-center gap-3 bg-[oklch(18.5%_0_0)] border border-[oklch(28%_0_0)] rounded-lg p-3 mb-5">
        <div className="w-9 h-9 rounded-md bg-[oklch(22%_0_0)] border border-[oklch(28%_0_0)] flex items-center justify-center flex-shrink-0">
          {/* Riot-style R icon */}
          <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
            <path
              d="M4 4h7a5 5 0 010 10H8v6H4V4z"
              stroke="oklch(49.1% 0.27 292.581)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path d="M11 14l5 6" stroke="oklch(49.1% 0.27 292.581)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-semibold text-white">Riot Games</p>
          <p className="text-xs text-[oklch(50%_0_0)]">League of Legends · Valorant · TFT</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-[oklch(50%_0_0)]">Región</label>
          <select
            value={form.region}
            onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
            className="h-12 rounded-lg bg-[oklch(20%_0_0)] border border-[oklch(26%_0_0)] px-4 text-sm text-[oklch(96%_0_0)] outline-none focus:border-[oklch(49.1%_0.27_292.581)] focus:shadow-[0_0_0_3px_oklch(49.1%_0.27_292.581/0.15)] transition-all"
          >
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <Input
          label="Nombre de invocador"
          placeholder="Ej: Faker#LAS"
          value={form.summonerName}
          onChange={(e) => setForm((f) => ({ ...f, summonerName: e.target.value }))}
          hint="Incluí el #TAG si usás Riot ID (Nombre#TAG)"
          required
        />

        {error && (
          <p className="text-sm text-[oklch(62%_0.22_25)] bg-[oklch(22%_0_0)] border border-[oklch(62%_0.22_25)/0.3] rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" loading={loading} className="mt-2">
          Vincular cuenta
        </Button>

        <button
          type="button"
          onClick={() => navigate('/success')}
          className="text-sm text-[oklch(40%_0_0)] hover:text-[oklch(55%_0_0)] transition-colors text-center cursor-pointer bg-transparent border-none"
        >
          Vincular más tarde
        </button>
      </form>
    </OnboardingLayout>
  )
}
