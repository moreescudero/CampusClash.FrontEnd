import { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'link'
type Size = 'sm' | 'md' | 'lg'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[oklch(49.1%_0.27_292.581)] focus-visible:ring-offset-2 focus-visible:ring-offset-[oklch(14.5%_0_0)] disabled:opacity-40 disabled:pointer-events-none cursor-pointer'

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-[oklch(47%_0.28_283)] to-[oklch(54%_0.27_307)] text-white hover:opacity-90 active:scale-[0.97] shadow-[0_4px_20px_oklch(49.1%_0.27_292.581/0.35)]',
  ghost:
    'border border-[oklch(30%_0_0)] text-[oklch(78%_0_0)] hover:border-[oklch(49.1%_0.27_292.581)/0.6] hover:text-white hover:bg-[oklch(49.1%_0.27_292.581/0.06)]',
  link: 'text-[oklch(55%_0.27_292.581)] hover:text-[oklch(65%_0.25_292.581)] underline-offset-4 hover:underline p-0 h-auto font-medium',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-6 text-sm w-full tracking-wide',
}

export function Button({ variant = 'primary', size = 'md', loading, children, className = '', ...props }: Props) {
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          {children}
        </span>
      ) : children}
    </button>
  )
}
