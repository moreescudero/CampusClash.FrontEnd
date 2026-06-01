import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { OnboardingLayout } from '../components/OnboardingLayout'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { api, setToken } from '../lib/api'
import { setProfile } from '../lib/auth'

export function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [universities, setUniversities] = useState<{ id: string; name: string }[]>([])
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    universityId: '',
    faculty: '',
    career: '',
  })

  useEffect(() => {
    api.getUniversities()
      .then(setUniversities)
      .catch(() => {})
  }, [])

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }
    if (form.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }

    const selectedUniversity = universities.find((u) => u.id === form.universityId)

    setLoading(true)
    try {
      const res = await api.register({
        name: form.name,
        email: form.email,
        password: form.password,
        university: selectedUniversity?.name ?? form.universityId,
        faculty: form.faculty,
        career: form.career,
      })
      setToken(res.token)
      setProfile({
        name: form.name,
        email: form.email,
        university: selectedUniversity?.name ?? form.universityId,
        faculty: form.faculty,
        career: form.career,
        isEmailConfirmed: false,
        isRiotLinked: false,
        isValidated: false,
        validationSubmitted: false,
      })
      navigate('/confirm-email')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const selectClass = "h-12 rounded-lg bg-[oklch(20%_0_0)] border border-[oklch(26%_0_0)] px-4 text-sm text-[oklch(96%_0_0)] outline-none focus:border-[oklch(49.1%_0.27_292.581)] focus:shadow-[0_0_0_3px_oklch(49.1%_0.27_292.581/0.15)] transition-all"

  return (
    <OnboardingLayout
      currentStep={1}
      title="Creá tu cuenta"
      subtitle="Ingresá tus datos para registrarte en Campus Clash."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Nombre completo"
          placeholder="Juan Pérez"
          value={form.name}
          onChange={set('name')}
          autoComplete="name"
          required
        />

        <Input
          label="Email universitario"
          type="email"
          placeholder="juan@mail.universidad.edu.ar"
          value={form.email}
          onChange={set('email')}
          autoComplete="email"
          required
        />

        {/* Universidad */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-[oklch(50%_0_0)]">Universidad</label>
          <select
            value={form.universityId}
            onChange={set('universityId')}
            required
            className={selectClass}
          >
            <option value="" disabled>
              {universities.length === 0 ? 'Cargando universidades…' : 'Seleccioná tu universidad'}
            </option>
            {universities.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        {/* Facultad y Carrera en grid */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Facultad"
            placeholder="Ej: Ingeniería"
            value={form.faculty}
            onChange={set('faculty')}
            required
          />
          <Input
            label="Carrera"
            placeholder="Ej: Sistemas"
            value={form.career}
            onChange={set('career')}
            required
          />
        </div>

        <Input
          label="Contraseña"
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={form.password}
          onChange={set('password')}
          autoComplete="new-password"
          required
        />

        <Input
          label="Confirmar contraseña"
          type="password"
          placeholder="Repetí tu contraseña"
          value={form.confirm}
          onChange={set('confirm')}
          autoComplete="new-password"
          required
        />

        {error && (
          <p className="text-sm text-[oklch(62%_0.22_25)] bg-[oklch(22%_0_0)] border border-[oklch(62%_0.22_25)/0.3] rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" loading={loading} className="mt-2">
          Crear cuenta
        </Button>

        <p className="text-center text-sm text-[oklch(45%_0_0)]">
          ¿Ya tenés cuenta?{' '}
          <Link to="/login" className="text-[oklch(49.1%_0.27_292.581)] hover:text-[oklch(60%_0.27_292.581)] no-underline font-medium">
            Iniciá sesión
          </Link>
        </p>
      </form>
    </OnboardingLayout>
  )
}
