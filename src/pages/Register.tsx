import { FormEvent, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { OnboardingLayout } from '../components/OnboardingLayout'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { api, setToken } from '../lib/api'
import { setProfile } from '../lib/auth'

const UNIVERSITIES = [
  'UBA – Universidad de Buenos Aires',
  'UTN – Universidad Tecnológica Nacional',
  'UADE – Universidad Argentina de la Empresa',
  'UdeSA – Universidad de San Andrés',
  'UCA – Universidad Católica Argentina',
  'UNLP – Universidad Nacional de La Plata',
  'UNC – Universidad Nacional de Córdoba',
  'UNSAM – Universidad Nacional de San Martín',
  'Otra',
]

export function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
    university: '',
    faculty: '',
  })

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

    setLoading(true)
    try {
      const res = await api.register({
        name: form.name,
        email: form.email,
        password: form.password,
        university: form.university,
        faculty: form.faculty,
      })
      setToken(res.token)
      setProfile({
        name: form.name,
        email: form.email,
        university: form.university,
        faculty: form.faculty,
        isEmailConfirmed: false,
        isRiotLinked: false,
        isValidated: false,
      })
      navigate('/confirm-email')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

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

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-widest text-[oklch(50%_0_0)]">Universidad</label>
          <select
            value={form.university}
            onChange={set('university')}
            required
            className="h-12 rounded-lg bg-[oklch(20%_0_0)] border border-[oklch(26%_0_0)] px-4 text-sm text-[oklch(96%_0_0)] outline-none focus:border-[oklch(49.1%_0.27_292.581)] focus:shadow-[0_0_0_3px_oklch(49.1%_0.27_292.581/0.15)] transition-all"
          >
            <option value="" disabled>Seleccioná tu universidad</option>
            {UNIVERSITIES.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        <Input
          label="Facultad / Carrera"
          placeholder="Ej: Ingeniería en Sistemas"
          value={form.faculty}
          onChange={set('faculty')}
          required
        />

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
