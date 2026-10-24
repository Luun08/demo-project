import { useState } from "react"
import {
  AppField,
  Hexagon,
  Icon,
  LanguageSwitch,
  Logo,
} from "../components/Shared"
import { useApp } from "../context/AppContext"
import type { Role } from "../types"

export function AuthPage() {
  const { t, authMode, goAuth, goLanding, login, register } = useApp()
  const [role, setRole] = useState<Exclude<Role, "guest">>("parent")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = () => {
    const action = authMode === "register" ? register : login
    const result = action(email, password, role)
    setError(result)
  }

  return (
    <div className="login-screen">
      <a className="skip-link" href="#auth-main">
        {t("skip")}
      </a>
      <div className="login-top">
        <button type="button" className="logo-button" onClick={goLanding} aria-label={t("toLanding")}>
          <Logo />
        </button>
        <LanguageSwitch />
      </div>
      <div className="login-layout" id="auth-main">
        <div className="login-story">
          <Hexagon size="large" tone="peach" />
          <div>
            <span className="eyebrow">SEN SUPPORT</span>
            <h1>{t("authStory")}</h1>
            <p>{t("authStoryText")}</p>
          </div>
        </div>
        <div className="login-card">
          {authMode !== "recover" && (
            <div className="login-tabs" role="tablist">
              <button
                type="button"
                className={authMode === "login" ? "active" : ""}
                onClick={() => goAuth("login")}
              >
                {t("login")}
              </button>
              <button
                type="button"
                className={authMode === "register" ? "active" : ""}
                onClick={() => goAuth("register")}
              >
                {t("register")}
              </button>
            </div>
          )}
          {authMode === "recover" ? (
            <>
              <div className="login-card__heading">
                <h2>{t("recoverTitle")}</h2>
                <p>{t("recoverText")}</p>
              </div>
              <div className="login-form">
                <AppField
                  label={t("email")}
                  placeholder="name@example.kz"
                  value={email}
                  onChange={setEmail}
                  error={error === "email" ? t("emailError") : undefined}
                />
                {sent && <p role="status">{t("recoverDone")}</p>}
                <button
                  className="button button--primary login-submit"
                  type="button"
                  onClick={() => {
                    if (!email.includes("@")) setError("email")
                    else {
                      setError(null)
                      setSent(true)
                    }
                  }}
                >
                  {t("sendLink")}
                </button>
                <button type="button" className="forgot-link" onClick={() => goAuth("login")}>
                  {t("backToLogin")}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="login-card__heading">
                <h2>{authMode === "register" ? t("createAccount") : t("welcomeBack")}</h2>
                <p>{t("chooseRole")}</p>
              </div>
              <div className="role-select">
                <button
                  type="button"
                  className={role === "parent" ? "selected" : ""}
                  onClick={() => setRole("parent")}
                >
                  <Icon name="people" />
                  <span>
                    <strong>{t("parent")}</strong>
                    <small>{t("parentHint")}</small>
                  </span>
                  {role === "parent" && <Icon name="check" size={18} />}
                </button>
                <button
                  type="button"
                  className={role === "specialist" ? "selected" : ""}
                  onClick={() => setRole("specialist")}
                >
                  <Icon name="notebook" />
                  <span>
                    <strong>{t("specialist")}</strong>
                    <small>{t("specialistHint")}</small>
                  </span>
                  {role === "specialist" && <Icon name="check" size={18} />}
                </button>
              </div>
              <div className="login-form">
                <AppField
                  label={t("email")}
                  placeholder="name@example.kz"
                  value={email}
                  onChange={setEmail}
                  error={error === "email" ? t("emailError") : undefined}
                />
                <label className="app-field">
                  <span>{t("password")}</span>
                  <div className="app-field__control">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("password")}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Icon name="eye" size={19} />
                    </button>
                  </div>
                  <small>{t("passwordHint")}</small>
                </label>
                {authMode === "login" && (
                  <button type="button" className="forgot-link" onClick={() => goAuth("recover")}>
                    {t("forgot")}
                  </button>
                )}
                <button className="button button--primary login-submit" type="button" onClick={submit}>
                  {authMode === "register" ? t("submitRegister") : t("submitLogin")}
                </button>
                <button type="button" className="text-action" onClick={goLanding}>
                  {t("toLanding")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
