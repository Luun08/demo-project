import { useState } from "react"
import {
  Button,
  Hexagon,
  Icon,
  LanguageSwitch,
  Logo,
  SectionTitle,
  type IconName,
} from "../components/Shared"
import { useApp } from "../context/AppContext"

function Header() {
  const { t, goAuth, enterGuest } = useApp()
  const [open, setOpen] = useState(false)
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <Logo inverse />
        <nav className="desktop-nav" aria-label={t("navAbout")}>
          <a href="#about">{t("navAbout")}</a>
          <a href="#workspaces">{t("navParents")}</a>
          <a href="#workspaces">{t("navSpecialists")}</a>
          <a href="#questions">{t("navQuestions")}</a>
        </nav>
        <div className="topbar__actions">
          <LanguageSwitch dark />
          <Button variant="secondary" className="ghost-light" onClick={enterGuest}>
            {t("guest")}
          </Button>
          <Button variant="accent" onClick={() => goAuth("login")}>
            {t("login")}
          </Button>
        </div>
        <button
          className="menu-button"
          type="button"
          aria-label={open ? t("closeMenu") : t("openMenu")}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
      {open && (
        <nav className="mobile-nav" aria-label={t("openMenu")}>
          <a href="#about" onClick={() => setOpen(false)}>
            {t("navAbout")}
          </a>
          <a href="#workspaces" onClick={() => setOpen(false)}>
            {t("navWorkspaces")}
          </a>
          <a href="#questions" onClick={() => setOpen(false)}>
            {t("navQuestions")}
          </a>
          <LanguageSwitch dark />
          <Button variant="accent" onClick={() => goAuth("login")}>
            {t("login")}
          </Button>
        </nav>
      )}
    </header>
  )
}

function Footer() {
  const { t } = useApp()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <Logo inverse />
          <div className="footer__links">
            <a href="#about">{t("navAbout")}</a>
            <a href="#workspaces">{t("navParents")}</a>
            <a href="#workspaces">{t("navSpecialists")}</a>
            <a href="#questions">{t("navQuestions")}</a>
          </div>
          <LanguageSwitch dark />
        </div>
        <div className="footer__bottom">
          <span>{t("footerUni")}</span>
          <a href="#privacy">{t("privacyPolicy")}</a>
        </div>
      </div>
    </footer>
  )
}

export function LandingPage() {
  const { t, goAuth, enterAs } = useApp()
  const [openAcc, setOpenAcc] = useState<number | null>(0)
  const features = [
    { icon: "calendar" as IconName, title: t("feat1t"), text: t("feat1d") },
    { icon: "notebook" as IconName, title: t("feat2t"), text: t("feat2d") },
    { icon: "people" as IconName, title: t("feat3t"), text: t("feat3d") },
  ]
  const accordion = [
    [t("acc1t"), t("acc1d")],
    [t("acc2t"), t("acc2d")],
    [t("acc3t"), t("acc3d")],
  ]
  return (
    <div className="landing">
      <a className="skip-link" href="#main">
        {t("skip")}
      </a>
      <Header />
      <main id="main">
        <section className="hero" id="about">
          <div className="container hero__inner">
            <div className="hero__visual">
              <span className="hero__dot hero__dot--one" />
              <span className="hero__dot hero__dot--two" />
              <Hexagon size="large" tone="peach" />
              <div className="hero__note">
                <Icon name="check" size={18} />
                <span>{t("note")}</span>
              </div>
            </div>
            <div className="hero__copy">
              <span className="eyebrow">{t("heroEyebrow")}</span>
              <h1>{t("heroTitle")}</h1>
              <span className="brush" />
              <p>{t("heroText")}</p>
              <div className="hero__buttons">
                <Button onClick={() => goAuth("register")}>{t("start")}</Button>
                <Button variant="link" icon onClick={() => document.getElementById("workspaces")?.scrollIntoView()}>
                  {t("aboutFeatures")}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="section features">
          <div className="container">
            <SectionTitle eyebrow={t("featuresEyebrow")}>{t("featuresTitle")}</SectionTitle>
            <div className="feature-grid">
              {features.map((feature, index) => (
                <article className="feature-card" key={feature.title}>
                  <div className="icon-tile">
                    <Icon name={feature.icon} size={30} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                  <span className="feature-card__number">0{index + 1}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="workspaces section" id="workspaces">
          <div className="container">
            <div className="workspace-head">
              <SectionTitle eyebrow={t("wsEyebrow")}>{t("wsTitle")}</SectionTitle>
              <p className="workspace-lead">{t("wsLead")}</p>
            </div>
            <div className="workspace-grid">
              <article className="workspace-card">
                <div className="workspace-preview workspace-preview--parent" aria-hidden="true">
                  <div className="mock-app">
                    <span className="mock-app__label">{t("previewParent")}</span>
                    <strong>{t("welcomePreview")}</strong>
                    <div className="mock-bar">
                      <i style={{ width: "72%" }} />
                    </div>
                    <div className="mock-pills">
                      <span>{t("planned")}</span>
                      <span>{t("draft")}</span>
                    </div>
                  </div>
                </div>
                <div className="workspace-card__body">
                  <span>01</span>
                  <h3>{t("parent")}</h3>
                  <p>{t("parentDesc")}</p>
                  <button type="button" className="workspace-link" onClick={() => enterAs("parent")}>
                    {t("openParent")} <Icon name="arrow" size={18} />
                  </button>
                </div>
              </article>
              <article className="workspace-card">
                <div className="workspace-preview workspace-preview--spec" aria-hidden="true">
                  <div className="mock-app mock-app--dark">
                    <span className="mock-app__label">{t("previewSpecialist")}</span>
                    <strong>04</strong>
                    <ul>
                      <li>15:00 · {t("speech")}</li>
                      <li>17:30 · {t("offline")}</li>
                    </ul>
                  </div>
                </div>
                <div className="workspace-card__body">
                  <span>02</span>
                  <h3>{t("specialist")}</h3>
                  <p>{t("specialistDesc")}</p>
                  <button type="button" className="workspace-link" onClick={() => enterAs("specialist")}>
                    {t("openSpecialist")} <Icon name="arrow" size={18} />
                  </button>
                </div>
              </article>
              <article className="workspace-card">
                <div className="workspace-preview workspace-preview--admin" aria-hidden="true">
                  <div className="mock-app">
                    <span className="mock-app__label">{t("previewAdmin")}</span>
                    <div className="mock-stats">
                      <b>12</b>
                      <b>8</b>
                      <b>3</b>
                    </div>
                    <span className="mock-chart" />
                  </div>
                </div>
                <div className="workspace-card__body">
                  <span>03</span>
                  <h3>{t("admin")}</h3>
                  <p>{t("adminDesc")}</p>
                  <button type="button" className="workspace-link" onClick={() => enterAs("admin")}>
                    {t("openAdmin")} <Icon name="arrow" size={18} />
                  </button>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="photo-band" aria-label={t("photoLabel")}>
          <div className="photo-band__landscape">
            <span className="photo-band__sun" />
            <div className="photo-band__figures">
              <span />
              <span />
              <span />
            </div>
            <div className="photo-band__book" />
          </div>
        </section>

        <section className="section why" id="questions">
          <div className="container why__grid">
            <div>
              <SectionTitle eyebrow={t("whyEyebrow")}>{t("whyTitle")}</SectionTitle>
              <p className="why__intro">{t("whyText")}</p>
            </div>
            <div className="accordion">
              {accordion.map(([title, text], index) => {
                const opened = openAcc === index
                return (
                  <div key={title}>
                    <button
                      className={`accordion__item ${opened ? "accordion__item--open" : ""}`}
                      type="button"
                      aria-expanded={opened}
                      onClick={() => setOpenAcc(opened ? null : index)}
                    >
                      <span className="accordion__number">0{index + 1}</span>
                      <span>{title}</span>
                      <span className="accordion__icon">
                        <Icon name={opened ? "minus" : "plus"} size={20} />
                      </span>
                    </button>
                    {opened && <p className="accordion-answer">{text}</p>}
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="gradient-section how">
          <div className="container">
            <SectionTitle eyebrow={t("howEyebrow")} centered>
              {t("howTitle")}
            </SectionTitle>
            <div className="steps">
              {[
                [t("step1n"), t("step1t"), t("step1d")],
                [t("step2n"), t("step2t"), t("step2d")],
                [t("step3n"), t("step3t"), t("step3d")],
              ].map(([number, title, text]) => (
                <article className="step-card" key={number}>
                  <span className="step-card__number">{number}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section privacy" id="privacy">
          <div className="container">
            <div className="privacy-card">
              <div className="privacy-card__icon">
                <Icon name="shield" size={36} />
              </div>
              <div className="privacy-card__copy">
                <span className="eyebrow">{t("privacyEyebrow")}</span>
                <h2>{t("privacyTitle")}</h2>
              </div>
              <ul>
                <li>
                  <Icon name="check" size={18} />
                  {t("privacy1")}
                </li>
                <li>
                  <Icon name="eye" size={18} />
                  {t("privacy2")}
                </li>
                <li>
                  <Icon name="notebook" size={18} />
                  {t("privacy3")}
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="cta">
          <div className="container cta__inner">
            <div>
              <span className="eyebrow">{t("ctaEyebrow")}</span>
              <h2>{t("ctaTitle")}</h2>
            </div>
            <Button variant="accent" icon onClick={() => document.getElementById("workspaces")?.scrollIntoView()}>
              {t("navWorkspaces")}
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
