import { ChangeEvent, DragEvent, FormEvent, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingLayout } from '../components/OnboardingLayout'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { api } from '../lib/api'

const YEARS = ['1°', '2°', '3°', '4°', '5°', 'Graduado/a']

const ACCEPTED = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
const MAX_MB = 5

function formatBytes(bytes: number) {
  return bytes < 1_000_000
    ? `${(bytes / 1_000).toFixed(0)} KB`
    : `${(bytes / 1_000_000).toFixed(1)} MB`
}

export function AcademicValidation() {
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fileError, setFileError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [form, setForm] = useState({
    legajo: '',
    university: '',
    faculty: '',
    career: '',
    year: '',
  })

  function set(field: keyof typeof form) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  function validateFile(f: File): boolean {
    setFileError('')
    if (!ACCEPTED.includes(f.type)) {
      setFileError('Solo se aceptan PDF, JPG o PNG.')
      return false
    }
    if (f.size > MAX_MB * 1_000_000) {
      setFileError(`El archivo no puede superar ${MAX_MB} MB.`)
      return false
    }
    return true
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f && validateFile(f)) setFile(f)
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f && validateFile(f)) setFile(f)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!file) { setFileError('Tenés que adjuntar la constancia.'); return }
    setLoading(true)
    try {
      await api.requestValidation({ ...form, file })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <OnboardingLayout
        currentStep={3}
        title="Constancia enviada"
        subtitle="Vamos a revisarla y te notificamos por mail cuando esté aprobada."
      >
        <div className="flex flex-col items-center gap-5 py-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-[oklch(49.1%_0.27_292.581)] opacity-20 blur-xl scale-110" />
            <div className="relative w-16 h-16 rounded-2xl bg-[oklch(20%_0_0)] border border-[oklch(49.1%_0.27_292.581/0.3)] flex items-center justify-center">
              <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
                <path d="M8 12h16M8 17h10" stroke="oklch(58% 0.27 292.581)" strokeWidth="1.8" strokeLinecap="round" />
                <rect x="4" y="4" width="24" height="28" rx="3" stroke="oklch(58% 0.27 292.581)" strokeWidth="1.8" />
                <path d="M20 4v6h8" stroke="oklch(58% 0.27 292.581)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div>
            <p className="text-white font-semibold">{file?.name}</p>
            <p className="text-xs text-[oklch(42%_0_0)] mt-0.5">{formatBytes(file?.size ?? 0)}</p>
          </div>

          <div className="w-full bg-[oklch(20%_0_0)] border border-[oklch(24%_0_0)] rounded-xl p-4 text-left space-y-2">
            {[
              { label: 'Legajo', value: form.legajo },
              { label: 'Universidad', value: form.university },
              { label: 'Facultad', value: form.faculty },
              { label: 'Carrera', value: form.career },
              { label: 'Año', value: form.year },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4">
                <span className="text-xs text-[oklch(40%_0_0)] uppercase tracking-widest font-semibold">{label}</span>
                <span className="text-xs text-[oklch(70%_0_0)] text-right">{value}</span>
              </div>
            ))}
          </div>

          <div className="w-full bg-[oklch(49.1%_0.27_292.581/0.08)] border border-[oklch(49.1%_0.27_292.581/0.2)] rounded-xl p-3">
            <p className="text-xs text-[oklch(60%_0.15_292.581)] leading-relaxed">
              Revisión en hasta <strong className="text-white">48 hs hábiles</strong>. Te llegará un mail a{' '}
              <strong className="text-white">tu dirección registrada</strong> cuando esté aprobada.
            </p>
          </div>

          <Button size="lg" onClick={() => navigate('/link-riot')}>
            Continuar →
          </Button>
        </div>
      </OnboardingLayout>
    )
  }

  return (
    <OnboardingLayout
      currentStep={3}
      title="Validación académica"
      subtitle="Subí tu constancia de alumno regular para verificar que sos estudiante universitario activo."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Info banner */}
        <div className="flex gap-2.5 bg-[oklch(49.1%_0.27_292.581/0.07)] border border-[oklch(49.1%_0.27_292.581/0.18)] rounded-xl p-3">
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 shrink-0 mt-0.5 text-[oklch(55%_0.2_292.581)]">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
            <path d="M8 7v4M8 5.5h.01" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <p className="text-xs text-[oklch(52%_0.1_292.581)] leading-relaxed">
            La constancia puede descargarse desde el portal de tu universidad. Tu documento no se comparte públicamente.
          </p>
        </div>

        <Input label="Legajo / Padrón" placeholder="Ej: 12345678" value={form.legajo} onChange={set('legajo')} required />
        <Input label="Universidad" placeholder="Ej: UBA" value={form.university} onChange={set('university')} required />

        <div className="grid grid-cols-2 gap-3">
          <Input label="Facultad" placeholder="Ej: FIUBA" value={form.faculty} onChange={set('faculty')} required />
          <Input label="Carrera" placeholder="Ej: Ingeniería en Sistemas" value={form.career} onChange={set('career')} required />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-[oklch(50%_0_0)]">Año de cursada</label>
          <select
            value={form.year}
            onChange={set('year')}
            required
            className="h-12 rounded-lg bg-[oklch(20%_0_0)] border border-[oklch(26%_0_0)] px-4 text-sm text-[oklch(96%_0_0)] outline-none focus:border-[oklch(49.1%_0.27_292.581)] focus:shadow-[0_0_0_3px_oklch(49.1%_0.27_292.581/0.15)] transition-all"
          >
            <option value="" disabled>Seleccioná el año</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* File upload */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-[oklch(50%_0_0)]">
            Constancia de alumno regular
          </label>

          {file ? (
            <div className="flex items-center gap-3 rounded-xl border border-[oklch(49.1%_0.27_292.581/0.3)] bg-[oklch(49.1%_0.27_292.581/0.06)] px-4 py-3">
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 shrink-0 text-[oklch(55%_0.2_292.581)]">
                <path d="M4 4a2 2 0 012-2h5l5 5v9a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" stroke="currentColor" strokeWidth="1.4" />
                <path d="M13 2v5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{file.name}</p>
                <p className="text-xs text-[oklch(42%_0_0)]">{formatBytes(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => { setFile(null); if (fileRef.current) fileRef.current.value = '' }}
                className="text-[oklch(40%_0_0)] hover:text-[oklch(62%_0.22_25)] transition-colors cursor-pointer shrink-0"
              >
                <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 cursor-pointer transition-all ${
                dragging
                  ? 'border-[oklch(49.1%_0.27_292.581)] bg-[oklch(49.1%_0.27_292.581/0.08)]'
                  : 'border-[oklch(26%_0_0)] bg-[oklch(19%_0_0)] hover:border-[oklch(35%_0_0)] hover:bg-[oklch(20%_0_0)]'
              }`}
            >
              <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8 text-[oklch(35%_0_0)]">
                <path d="M16 22V10M10 16l6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 26h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <div className="text-center">
                <p className="text-sm text-[oklch(60%_0_0)]">
                  Arrastrá el archivo o <span className="text-[oklch(55%_0.2_292.581)] font-semibold">hacé click para seleccionar</span>
                </p>
                <p className="text-xs text-[oklch(35%_0_0)] mt-1">PDF, JPG o PNG · máximo {MAX_MB} MB</p>
              </div>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
            className="hidden"
          />
          {fileError && <p className="text-xs text-[oklch(62%_0.22_25)]">{fileError}</p>}
        </div>

        {error && (
          <p className="text-sm text-[oklch(62%_0.22_25)] bg-[oklch(20%_0_0)] border border-[oklch(62%_0.22_25)/0.25] rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" loading={loading} className="mt-1">
          Enviar constancia
        </Button>

        <button
          type="button"
          onClick={() => navigate('/link-riot')}
          className="text-xs text-[oklch(35%_0_0)] hover:text-[oklch(50%_0_0)] transition-colors text-center cursor-pointer bg-transparent border-none"
        >
          Completar más tarde
        </button>
      </form>
    </OnboardingLayout>
  )
}
