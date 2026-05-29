import { InputHTMLAttributes, forwardRef } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-widest text-[oklch(50%_0_0)]">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`h-12 rounded-lg bg-[oklch(20%_0_0)] border px-4 text-sm text-[oklch(96%_0_0)] placeholder:text-[oklch(38%_0_0)] outline-none transition-all
            ${error
              ? 'border-[oklch(62%_0.22_25)] shadow-[0_0_0_3px_oklch(62%_0.22_25/0.12)]'
              : 'border-[oklch(26%_0_0)] focus:border-[oklch(49.1%_0.27_292.581)] focus:shadow-[0_0_0_3px_oklch(49.1%_0.27_292.581/0.15)] focus:bg-[oklch(21.5%_0_0)]'
            } ${className}`}
          {...props}
        />
        {error && <p className="text-xs text-[oklch(62%_0.22_25)]">{error}</p>}
        {hint && !error && <p className="text-xs text-[oklch(42%_0_0)]">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
