import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingLayout } from '../components/OnboardingLayout'
import { Button } from '../components/ui/Button'

export function ConfirmEmail() {
  const navigate = useNavigate()
  const email = localStorage.getItem('cc_email') ?? 'tu email'
  const [resent, setResent] = useState(false)

  function handleResend() {
    // TODO: call resend endpoint when available
    setResent(true)
    setTimeout(() => setResent(false), 4000)
  }

  return (
    <OnboardingLayout
      currentStep={2}
      title="Confirmá tu email"
      subtitle="Revisá tu casilla de correo y hacé click en el link que te enviamos."
    >
      <div className="flex flex-col items-center gap-6 py-4">
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-[oklch(18.5%_0_0)] border border-[oklch(28%_0_0)] flex items-center justify-center">
          <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
            <rect x="4" y="10" width="32" height="22" rx="3" stroke="oklch(49.1% 0.27 292.581)" strokeWidth="1.8" />
            <path d="M4 14l16 10 16-10" stroke="oklch(49.1% 0.27 292.581)" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="text-center">
          <p className="text-[oklch(58%_0_0)] text-sm">
            Enviamos un link de verificación a
          </p>
          <p className="text-white font-semibold mt-0.5">{email}</p>
        </div>

        <div className="w-full bg-[oklch(18.5%_0_0)] border border-[oklch(28%_0_0)] rounded-lg p-4">
          <p className="text-xs text-[oklch(55%_0_0)] leading-relaxed">
            Revisá también la carpeta de spam. El mail puede tardar hasta 5 minutos en llegar.
          </p>
        </div>

        {resent && (
          <p className="text-sm text-[oklch(64%_0.2_145)] font-medium">
            ¡Mail reenviado!
          </p>
        )}

        <div className="flex flex-col w-full gap-3 mt-2">
          {/* Placeholder: go to next step directly */}
          <Button size="lg" onClick={() => navigate('/validation')}>
            Ya confirmé mi email
          </Button>
          <Button variant="ghost" size="lg" onClick={handleResend}>
            Reenviar email
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  )
}
