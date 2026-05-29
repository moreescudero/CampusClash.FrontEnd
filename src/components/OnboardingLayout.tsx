import { Fragment, ReactNode } from 'react'
import { Link } from 'react-router-dom'

const STEPS = ['Registro', 'Email', 'Validación', 'Riot']

interface Props {
  currentStep: number // 1-based
  title: string
  subtitle?: string
  children: ReactNode
}

export function OnboardingLayout({ currentStep, title, subtitle, children }: Props) {
  const progressPct = ((currentStep - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="min-h-screen bg-[oklch(14.5%_0_0)] bg-dots flex flex-col noise">
      {/* Progress bar — fullwidth at top */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-[oklch(22%_0_0)]">
        <div
          className="h-full bg-gradient-to-r from-[oklch(47%_0.28_283)] to-[oklch(58%_0.25_310)] transition-all duration-500 shadow-[0_0_8px_oklch(49.1%_0.27_292.581/0.6)]"
          style={{ width: `${progressPct === 0 ? 8 : progressPct}%` }}
        />
      </div>

      {/* Header */}
      <header className="pt-[2px] border-b border-[oklch(20%_0_0)] bg-[oklch(14.5%_0_0)/0.9] backdrop-blur-sm sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center no-underline">
          <img src="/logo.png" alt="Campus Clash" className="h-9 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[oklch(38%_0_0)]">
            Paso
          </span>
          <div className="flex items-center gap-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i + 1 < currentStep
                    ? 'w-4 bg-[oklch(49.1%_0.27_292.581)]'
                    : i + 1 === currentStep
                    ? 'w-4 bg-gradient-to-r from-[oklch(47%_0.28_283)] to-[oklch(58%_0.25_310)]'
                    : 'w-2 bg-[oklch(25%_0_0)]'
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-semibold text-[oklch(38%_0_0)]">
            {currentStep}/{STEPS.length}
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center px-4 py-10">
        {/* Step breadcrumb */}
        <div className="w-full max-w-md mb-6 flex items-center gap-2">
          {STEPS.map((step, i) => {
            const stepNum = i + 1
            const isDone = stepNum < currentStep
            const isActive = stepNum === currentStep
            return (
              <Fragment key={step}>
                <div className={`flex items-center gap-1.5 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-[oklch(49.1%_0.27_292.581/0.12)] border border-[oklch(49.1%_0.27_292.581/0.3)] px-2.5 py-1' : ''
                }`}>
                  {isDone ? (
                    <div className="w-4 h-4 rounded-full bg-[oklch(49.1%_0.27_292.581)] flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5">
                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ) : (
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                      isActive
                        ? 'bg-[oklch(49.1%_0.27_292.581)] text-white'
                        : 'bg-[oklch(22%_0_0)] text-[oklch(35%_0_0)]'
                    }`}>
                      {stepNum}
                    </div>
                  )}
                  {isActive && (
                    <span className="text-[11px] font-semibold text-[oklch(60%_0.2_292.581)] pr-0.5">
                      {step}
                    </span>
                  )}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px ${stepNum < currentStep ? 'bg-[oklch(35%_0.1_292.581)]' : 'bg-[oklch(20%_0_0)]'}`} />
                )}
              </Fragment>
            )
          })}
        </div>

        {/* Card */}
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-[oklch(22%_0_0)] bg-[oklch(17%_0_0)] overflow-hidden shadow-[0_0_40px_oklch(0%_0_0/0.5)]">
            {/* Gradient top line */}
            <div className="h-[2px] bg-gradient-to-r from-[oklch(47%_0.28_283)] via-[oklch(58%_0.25_310)] to-transparent" />
            <div className="p-7">
              <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">{title}</h1>
              {subtitle && (
                <p className="text-sm text-[oklch(48%_0_0)] mb-6 leading-relaxed">{subtitle}</p>
              )}
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
