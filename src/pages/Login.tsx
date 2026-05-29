import { FormEvent, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { api, setToken } from '../lib/api'
import { setProfile, getProfile } from '../lib/auth'

export function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.login({ email: form.email, password: form.password })
      setToken(res.token)
      // Preserve existing profile data, only update what login returns
      const existing = getProfile()
      setProfile({
        name: existing?.name ?? '',
        email: form.email,
        university: existing?.university ?? '',
        faculty: existing?.faculty ?? '',
        isEmailConfirmed: res.isEmailConfirmed ?? existing?.isEmailConfirmed ?? false,
        isRiotLinked: res.isRiotLinked ?? existing?.isRiotLinked ?? false,
        isValidated: res.isValidated ?? existing?.isValidated ?? false,
      })
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email o contraseña incorrectos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[oklch(14.5%_0_0)] bg-dots flex flex-col noise">
      {/* Glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[oklch(49.1%_0.27_292.581)] opacity-[0.06] blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-[oklch(20%_0_0)] bg-[oklch(14.5%_0_0)/0.8] backdrop-blur-sm">
        <Link to="/" className="no-underline">
          <img src="/logo.png" alt="Campus Clash" className="h-9 w-auto object-contain" />
        </Link>
      </nav>

      {/* Form */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white tracking-tight">Bienvenido de nuevo</h1>
            <p className="text-sm text-[oklch(45%_0_0)] mt-1">Iniciá sesión para continuar</p>
          </div>

          <div className="rounded-2xl border border-[oklch(22%_0_0)] bg-[oklch(17%_0_0)] overflow-hidden shadow-[0_0_40px_oklch(0%_0_0/0.5)]">
            <div className="h-[2px] bg-gradient-to-r from-[oklch(47%_0.28_283)] via-[oklch(58%_0.25_310)] to-transparent" />
            <form onSubmit={handleSubmit} className="p-7 flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="juan@mail.universidad.edu.ar"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
                required
              />
              <Input
                label="Contraseña"
                type="password"
                placeholder="Tu contraseña"
                value={form.password}
                onChange={set('password')}
                autoComplete="current-password"
                required
              />

              {error && (
                <p className="text-sm text-[oklch(62%_0.22_25)] bg-[oklch(20%_0_0)] border border-[oklch(62%_0.22_25)/0.25] rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <Button type="submit" size="lg" loading={loading} className="mt-1">
                Iniciar sesión
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-[oklch(38%_0_0)] mt-5">
            ¿No tenés cuenta?{' '}
            <Link
              to="/register"
              className="text-[oklch(55%_0.2_292.581)] hover:text-[oklch(65%_0.25_292.581)] no-underline font-semibold transition-colors"
            >
              Registrate gratis
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
