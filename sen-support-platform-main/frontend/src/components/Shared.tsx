import { type ButtonHTMLAttributes, type ReactNode } from "react"
import { useApp } from "../context/AppContext"
import { locales } from "../types"

export type IconName =
  | "access"
  | "arrow"
  | "calendar"
  | "check"
  | "chevron"
  | "child"
  | "clock"
  | "close"
  | "diary"
  | "exit"
  | "eye"
  | "flower"
  | "home"
  | "lock"
  | "menu"
  | "minus"
  | "notebook"
  | "people"
  | "plus"
  | "search"
  | "shield"

export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  }
  const paths: Record<IconName, ReactNode> = {
    access: (
      <>
        <path d="M4 19v-2a4 4 0 0 1 4-4h4" />
        <circle cx="10" cy="7" r="4" />
        <path d="M15 17h6M18 14v6" />
      </>
    ),
    arrow: <path d="M5 12h14M14 7l5 5-5 5" />,
    calendar: (
      <>
        <rect x="3.5" y="5.5" width="17" height="15" rx="2" />
        <path d="M8 3.5v4M16 3.5v4M3.5 10h17M8 14h2M14 14h2M8 17h2" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    chevron: <path d="m8 10 4 4 4-4" />,
    child: (
      <>
        <circle cx="12" cy="7" r="3" />
        <path d="M7 21v-3a5 5 0 0 1 10 0v3M8 11l-3 4M16 11l3 4" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    close: <path d="m6 6 12 12M18 6 6 18" />,
    diary: (
      <>
        <path d="M5 4h12a2 2 0 0 1 2 2v14H7a3 3 0 0 1-3-3V5a1 1 0 0 1 1-1Z" />
        <path d="M8 4v16M11 9h5M11 13h4" />
      </>
    ),
    exit: (
      <>
        <path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10" />
      </>
    ),
    eye: (
      <>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    flower: (
      <>
        <circle cx="12" cy="12" r="2.2" />
        <circle cx="12" cy="6.5" r="3" />
        <circle cx="17" cy="10" r="3" />
        <circle cx="15" cy="16" r="3" />
        <circle cx="9" cy="16" r="3" />
        <circle cx="7" cy="10" r="3" />
      </>
    ),
    home: (
      <>
        <path d="m3 11 9-8 9 8" />
        <path d="M5 10v10h14V10M9 20v-6h6v6" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    minus: <path d="M5 12h14" />,
    notebook: (
      <>
        <path d="M6 4h12a2 2 0 0 1 2 2v14H7a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2Z" />
        <path d="M8 4v16M11 9h5M11 13h5" />
      </>
    ),
    people: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="10" r="2.5" />
        <path d="M3.5 19v-1.5A4.5 4.5 0 0 1 8 13h2a4.5 4.5 0 0 1 4.5 4.5V19M14.5 14.5a4 4 0 0 1 6 3.5v1" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 5 5" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 20 6v5c0 5-3.2 8.2-8 10-4.8-1.8-8-5-8-10V6l8-3Z" />
        <path d="m8.5 12 2.2 2.2 4.8-5" />
      </>
    ),
  }
  return <svg {...common}>{paths[name]}</svg>
}

export function Logo({
  compact = false,
  inverse = false,
}: {
  compact?: boolean
  inverse?: boolean
}) {
  return (
    <div className={`logo ${inverse ? "logo--inverse" : ""}`}>
      <div className="logo__mark">
        <Icon name="flower" size={25} />
      </div>
      {!compact && <span>SEN Support</span>}
    </div>
  )
}

export function Button({
  children,
  variant = "primary",
  icon,
  disabled,
  type = "button",
  onClick,
  className = "",
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: "primary" | "accent" | "secondary" | "link"
  icon?: boolean
}) {
  return (
    <button
      type={type}
      className={`button button--${variant} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      <span>{children}</span>
      {icon && <Icon name="arrow" size={19} />}
    </button>
  )
}

export function SectionTitle({
  eyebrow,
  children,
  centered = false,
}: {
  eyebrow?: string
  children: ReactNode
  centered?: boolean
}) {
  return (
    <div className={`section-title ${centered ? "section-title--centered" : ""}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{children}</h2>
    </div>
  )
}

export function Hexagon({
  size = "large",
  tone = "sage",
  children,
}: {
  size?: "small" | "medium" | "large"
  tone?: "sage" | "peach" | "blue"
  children?: ReactNode
}) {
  return (
    <div className={`hexagon hexagon--${size} hexagon--${tone}`}>
      <div className="hexagon__scene">
        <span className="scene__sun" />
        <span className="scene__person scene__person--one" />
        <span className="scene__person scene__person--two" />
        <span className="scene__desk" />
        {children}
      </div>
    </div>
  )
}

export function LanguageSwitch({ dark = false }: { dark?: boolean }) {
  const { lang, setLang, t } = useApp()
  return (
    <div className={`language ${dark ? "language--dark" : ""}`} role="group" aria-label={t("lang")}>
      {locales.map((code, index) => (
        <span key={code} className="language__item">
          {index > 0 && <span aria-hidden="true">/</span>}
          <button
            type="button"
            className={lang === code ? "language__active" : ""}
            aria-pressed={lang === code}
            onClick={() => setLang(code)}
          >
            {t(code)}
          </button>
        </span>
      ))}
    </div>
  )
}

export function Badge({
  type,
  children,
  icon,
}: {
  type: "neutral" | "success" | "accent"
  children: ReactNode
  icon?: IconName
}) {
  return (
    <span className={`badge badge--${type}`}>
      {icon && <Icon name={icon} size={15} />}
      {children}
    </span>
  )
}

export function MiniAvatar({ tone = "peach" }: { tone?: "peach" | "sage" }) {
  return (
    <span className={`mini-avatar mini-avatar--${tone}`}>
      <span />
    </span>
  )
}

export function AppField({
  label,
  placeholder,
  value,
  hint,
  error,
  type = "text",
  onChange,
  id,
}: {
  label: string
  placeholder?: string
  value?: string
  hint?: string
  error?: string
  type?: string
  onChange?: (value: string) => void
  id?: string
}) {
  const fieldId = id ?? label
  const errorId = `${fieldId}-error`
  return (
    <label className={`app-field ${error ? "app-field--error" : ""}`} htmlFor={fieldId}>
      <span>{label}</span>
      <div className="app-field__control">
        <input
          id={fieldId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
      </div>
      {(hint || error) && (
        <small id={error ? errorId : undefined}>
          {error && <span className="field-error-icon">!</span>}
          {error || hint}
        </small>
      )}
    </label>
  )
}

export function AppStatus({
  type,
  children,
}: {
  type: "planned" | "done" | "canceled" | "warning" | "blocked"
  children: ReactNode
}) {
  const icon: IconName =
    type === "done"
      ? "check"
      : type === "canceled" || type === "blocked"
        ? "minus"
        : type === "warning"
          ? "shield"
          : "clock"
  return (
    <span className={`app-status app-status--${type}`}>
      <Icon name={icon} size={14} />
      {children}
    </span>
  )
}

export function ScreenStates({
  onRetry,
}: {
  onRetry: () => void
}) {
  const { t, screenState } = useApp()
  if (screenState === "loading") {
    return (
      <div className="state-block" role="status">
        <div className="skeleton-card">
          <span />
          <span />
          <span />
        </div>
        <p>{t("loading")}</p>
      </div>
    )
  }
  if (screenState === "error") {
    return (
      <div className="state-block" role="alert">
        <strong>{t("errorTitle")}</strong>
        <Button onClick={onRetry}>{t("retry")}</Button>
      </div>
    )
  }
  return null
}
