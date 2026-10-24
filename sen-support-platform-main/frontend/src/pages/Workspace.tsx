import { useMemo, useState } from "react"
import {
  AppField,
  AppStatus,
  Badge,
  Button,
  Icon,
  LanguageSwitch,
  Logo,
  MiniAvatar,
  ScreenStates,
  type IconName,
} from "../components/Shared"
import { navFor, useApp } from "../context/AppContext"
import type { AppScreen, DiaryType, SessionFormat } from "../types"

const navMeta: { id: AppScreen; icon: IconName; label: "home" | "schedule" | "diary" | "access" | "profile" | "team" | "adminPanel" }[] = [
  { id: "home", icon: "home", label: "home" },
  { id: "schedule", icon: "calendar", label: "schedule" },
  { id: "diary", icon: "diary", label: "diary" },
  { id: "access", icon: "access", label: "access" },
  { id: "profile", icon: "child", label: "profile" },
  { id: "team", icon: "people", label: "team" },
  { id: "admin", icon: "shield", label: "adminPanel" },
]

function formatWhen(value: string, lang: string) {
  const parsed = Date.parse(value)
  if (Number.isNaN(parsed)) return value
  return new Intl.DateTimeFormat(lang, {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed)
}

export function Workspace() {
  const app = useApp()
  const { t, role, user, screen, setScreen, logout, goLanding, notice, dismissNotice, screenState, setScreenState } = app
  const items = navMeta.filter((item) => navFor(role).includes(item.id))
  const titles: Record<AppScreen, string> = {
    home: t("home"),
    profile: t("profile"),
    schedule: t("schedule"),
    diary: t("diary"),
    access: t("access"),
    team: t("team"),
    admin: t("adminPanel"),
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#app-main">
        {t("skip")}
      </a>
      <aside className="app-sidebar">
        <div className="app-sidebar__logo">
          <Logo inverse />
        </div>
        <nav aria-label={t("screen")}>
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={screen === item.id ? "active" : ""}
              aria-current={screen === item.id ? "page" : undefined}
              onClick={() => setScreen(item.id)}
            >
              <Icon name={item.icon} size={21} />
              <span>{t(item.label)}</span>
            </button>
          ))}
        </nav>
        <button className="app-sidebar__exit" type="button" onClick={logout}>
          <Icon name="exit" size={21} />
          {t("logout")}
        </button>
      </aside>
      <div className="app-workspace">
        <header className="app-topbar">
          <button className="app-menu" type="button" aria-label={t("openMenu")}>
            <Icon name="menu" />
          </button>
          <h1>{titles[screen]}</h1>
          <div className="app-topbar__tools">
            <Button variant="link" onClick={goLanding}>
              {t("toLanding")}
            </Button>
            <LanguageSwitch />
            <div className="user-chip">
              <MiniAvatar />
              <span>
                <strong>{user?.name ?? t("guest")}</strong>
                <small>
                  {role === "admin" ? t("admin") : role === "specialist" ? t("specialist") : t("parent")}
                </small>
              </span>
            </div>
          </div>
        </header>
        {notice && (
          <div className="notice-banner" role="status">
            <Icon name="clock" />
            <p>{notice.text}</p>
            <button type="button" onClick={dismissNotice} aria-label={t("dismiss")}>
              <Icon name="close" size={18} />
            </button>
          </div>
        )}
        <main className="app-content" id="app-main">
          <ScreenStates onRetry={() => setScreenState("ready")} />
          {screenState === "ready" && (
            <>
              {screen === "home" && <HomeScreen />}
              {screen === "profile" && <ProfileScreen />}
              {screen === "schedule" && <ScheduleScreen />}
              {screen === "diary" && <DiaryScreen />}
              {screen === "access" && <AccessScreen />}
              {screen === "admin" && <AdminScreen />}
              {screen === "team" && <TeamScreen />}
            </>
          )}
        </main>
      </div>
      <nav className="bottom-nav" aria-label={t("screen")}>
        {items.slice(0, 4).map((item) => (
          <button
            key={item.id}
            type="button"
            className={screen === item.id ? "active" : ""}
            onClick={() => setScreen(item.id)}
          >
            <Icon name={item.icon} size={20} />
            <span>{item.id === "access" ? t("accessShort") : t(item.label)}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

function HomeScreen() {
  const { t, user, role, child, lessons, diary, accessLog, setScreen } = useApp()
  const planned = lessons.filter((item) => item.status === "planned")
  const next = planned[0]
  return (
    <div className="page-stack">
      <div className="welcome-card">
        <div>
          <span className="eyebrow">
            {t("goodDay")}, {user?.name}
          </span>
          <h2>
            {role === "specialist" ? t("specialist") : t("parent")} · {child.displayName}
          </h2>
          <p>
            {t("nextLesson")} {t("noNotices")}
          </p>
        </div>
        <div className="welcome-hex">
          <Icon name="flower" size={46} />
        </div>
      </div>
      <div className="summary-grid">
        <button className="summary-card" type="button" onClick={() => setScreen("schedule")}>
          <Icon name="calendar" />
          <span>
            <strong>2 {t("weekLessons")}</strong>
          </span>
          <Icon name="arrow" />
        </button>
        <button className="summary-card" type="button" onClick={() => setScreen("diary")}>
          <Icon name="diary" />
          <span>
            <strong>
              {diary.length} {t("diaryCount")}
            </strong>
          </span>
          <Icon name="arrow" />
        </button>
        {role === "parent" && (
          <button className="summary-card" type="button" onClick={() => setScreen("access")}>
            <Icon name="eye" />
            <span>
              <strong>
                {accessLog.length} {t("viewsCount")}
              </strong>
            </span>
            <Icon name="arrow" />
          </button>
        )}
      </div>
      {next && (
        <div className="app-card">
          <div className="card-title-row">
            <div>
              <span className="eyebrow">{t("today")}</span>
              <h3>{t("nearest")}</h3>
            </div>
            <AppStatus type="planned">{t("planned")}</AppStatus>
          </div>
          <div className="next-session">
            <div className="date-block">
              <strong>14</strong>
              <span>{t("juneShort")}</span>
            </div>
            <div>
              <strong>{next.title}</strong>
              <p>
                {next.time} · {next.format === "online" ? t("online") : t("offline")}
              </p>
            </div>
            <Button variant="secondary" onClick={() => setScreen("schedule")}>
              {t("open")}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function ProfileScreen() {
  const { t, child, saveChild } = useApp()
  const [name, setName] = useState(child.displayName)
  const [birth, setBirth] = useState(child.birthDate)
  const [consent, setConsent] = useState(child.consent)
  return (
    <div className="page-stack narrow-page">
      <div className="page-intro">
        <h2>{t("basics")}</h2>
        <p>{t("basicsText")}</p>
      </div>
      <section className="app-card profile-form-card">
        <div className="two-fields">
          <AppField label={t("childName")} value={name} onChange={setName} />
          <AppField label={t("birthDate")} value={birth} onChange={setBirth} />
        </div>
      </section>
      <section className="app-card consent-card">
        <div className="consent-card__icon">
          <Icon name="shield" size={28} />
        </div>
        <div>
          <h3>{t("consentTitle")}</h3>
          <p>{t("consentText")}</p>
          <label className="consent-check">
            <input
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
            />
            <span className="fake-check">{consent && <Icon name="check" size={14} />}</span>
            {t("consentCheck")}
          </label>
          {child.consent ? (
            <button
              type="button"
              className="text-action"
              onClick={() => {
                setConsent(false)
                saveChild({ consent: false })
              }}
            >
              {t("revoke")}
            </button>
          ) : (
            <button
              type="button"
              className="text-action"
              onClick={() => {
                setConsent(true)
                saveChild({ consent: true })
              }}
            >
              {t("restoreConsent")}
            </button>
          )}
          {!child.consent && <p role="status">{t("consentRevoked")}</p>}
        </div>
      </section>
      <div className="form-actions">
        <span>{consent ? t("consentOk") : t("consentNeeded")}</span>
        <button
          className="button button--primary"
          type="button"
          disabled={!consent}
          onClick={() => saveChild({ displayName: name, birthDate: birth, consent })}
        >
          {t("save")}
        </button>
      </div>
    </div>
  )
}

function ScheduleScreen() {
  const { t, lessons, addLesson, setScreenState, screenState } = useApp()
  const [panel, setPanel] = useState(false)
  const [view, setView] = useState<"list" | "calendar">("calendar")
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("16 июня")
  const [time, setTime] = useState("10:00")
  const [format, setFormat] = useState<SessionFormat>("online")
  const empty = lessons.length === 0

  return (
    <div className="page-stack">
      <div className="page-toolbar">
        <div className="segmented app-segmented" role="tablist">
          <button type="button" className={view === "list" ? "active" : ""} onClick={() => setView("list")}>
            {t("list")}
          </button>
          <button
            type="button"
            className={view === "calendar" ? "active" : ""}
            onClick={() => setView("calendar")}
          >
            {t("calendar")}
          </button>
        </div>
        <button className="button button--primary" type="button" onClick={() => setPanel(true)}>
          <Icon name="plus" size={19} />
          {t("addLesson")}
        </button>
      </div>
      {view === "calendar" && <MonthCalendar />}
      {empty ? (
        <div className="empty-state">
          <div>
            <Icon name="calendar" />
          </div>
          <strong>{t("emptyLessons")}</strong>
          <p>{t("emptyLessonsHint")}</p>
        </div>
      ) : (
        <div className="schedule-layout">
          <section>
            <div className="list-heading">
              <h3>{t("upcoming")}</h3>
              <span>{lessons.length}</span>
            </div>
            <div className="session-list">
              {lessons.map((session) => (
                <article className="app-session" key={session.id}>
                  <div className="app-session__date">
                    <strong>{session.date}</strong>
                    <span>{session.time}</span>
                  </div>
                  <div className="app-session__main">
                    <h3>{session.title}</h3>
                    <span className="format-tag">
                      {session.format === "online" ? t("online") : t("offline")}
                    </span>
                  </div>
                  <AppStatus type={session.status}>
                    {session.status === "planned"
                      ? t("planned")
                      : session.status === "done"
                        ? t("done")
                        : t("canceled")}
                  </AppStatus>
                </article>
              ))}
            </div>
          </section>
          <aside className="state-examples">
            <span className="component-label">{t("loading")}</span>
            <button type="button" className="text-action" onClick={() => setScreenState(screenState === "error" ? "ready" : "error")}>
              {t("errorTitle")}
            </button>
          </aside>
        </div>
      )}
      {panel && (
        <div className="panel-overlay" onClick={() => setPanel(false)}>
          <aside
            className="side-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-lesson-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="side-panel__head">
              <div>
                <span className="eyebrow">{t("newEvent")}</span>
                <h2 id="add-lesson-title">{t("addLesson")}</h2>
              </div>
              <button type="button" onClick={() => setPanel(false)} aria-label={t("close")}>
                <Icon name="close" />
              </button>
            </div>
            <div className="panel-fields">
              <AppField label={t("lessonTitle")} value={title} onChange={setTitle} />
              <AppField label={t("date")} value={date} onChange={setDate} />
              <AppField label={t("time")} value={time} onChange={setTime} />
              <label className="app-field">
                <span>{t("format")}</span>
                <select value={format} onChange={(event) => setFormat(event.target.value as SessionFormat)}>
                  <option value="online">{t("online")}</option>
                  <option value="offline">{t("offline")}</option>
                </select>
              </label>
            </div>
            <div className="side-panel__actions">
              <Button variant="secondary" onClick={() => setPanel(false)}>
                {t("cancel")}
              </Button>
              <Button
                onClick={() => {
                  addLesson({
                    title: title || t("speech"),
                    date,
                    time,
                    format,
                    status: "planned",
                  })
                  setPanel(false)
                  setTitle("")
                }}
              >
                {t("add")}
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}

function MonthCalendar() {
  const { t } = useApp()
  const days = Array.from({ length: 35 }, (_, index) => index - 1)
  return (
    <section className="app-card month-card">
      <div className="month-card__head">
        <button type="button" aria-label={t("prevMonth")}>
          ←
        </button>
        <h3>{t("june")}</h3>
        <button type="button" aria-label={t("nextMonth")}>
          →
        </button>
      </div>
      <div className="calendar-grid calendar-grid--labels">
        {([t("wd1"), t("wd2"), t("wd3"), t("wd4"), t("wd5"), t("wd6"), t("wd7")] as const).map(
          (day) => (
            <span key={day}>{day}</span>
          ),
        )}
      </div>
      <div className="calendar-grid">
        {days.map((day, index) => (
          <button
            type="button"
            className={`${day < 1 || day > 30 ? "muted" : ""} ${day === 14 ? "today" : ""}`}
            key={index}
          >
            <span>{day < 1 ? 30 + day : day > 30 ? day - 30 : day}</span>
            {[8, 12, 14, 21].includes(day) && <i className={day === 8 ? "coral" : ""} />}
          </button>
        ))}
      </div>
    </section>
  )
}

function DiaryScreen() {
  const { t, role, diary, addDiary, setScreen, child } = useApp()
  const [privateEntry, setPrivateEntry] = useState(false)
  const [type, setType] = useState<DiaryType>("observation")
  const [text, setText] = useState("")
  const [openHistory, setOpenHistory] = useState<string | null>(null)
  const [table, setTable] = useState(false)
  const visible = diary.filter((entry) => role !== "parent" || entry.visibility === "shared")
  const typeLabel = {
    observation: t("observation"),
    progress: t("progress"),
    recommendation: t("recommendation"),
  }

  return (
    <div className="page-stack">
      {!child.consent && (
        <div className="info-banner" role="status">
          <Icon name="lock" />
          <p>{t("consentRevoked")}</p>
        </div>
      )}
      <div className="diary-layout">
        <section>
          <div className="list-heading">
            <div>
              <h2>{t("diaryTitle")}</h2>
              <p>{t("diaryLead")}</p>
            </div>
            {role === "parent" && (
              <button className="text-action" type="button" onClick={() => setScreen("access")}>
                {t("whoSaw")} <Icon name="arrow" size={17} />
              </button>
            )}
          </div>
          <div className="diary-feed">
            {visible.length === 0 && (
              <div className="empty-state">
                <strong>{t("emptyTitle")}</strong>
              </div>
            )}
            {visible.map((entry) => (
              <article className="entry-card" key={entry.id}>
                <div className="entry-card__meta">
                  <span
                    className={`entry-type entry-type--${
                      entry.type === "progress" ? "progress" : entry.type === "recommendation" ? "advice" : "note"
                    }`}
                  >
                    {typeLabel[entry.type]}
                  </span>
                  <span>{entry.createdAt}</span>
                </div>
                <h3>{entry.title}</h3>
                <p>{entry.text}</p>
                <div className="entry-card__foot">
                  <Badge type="neutral" icon={entry.visibility === "shared" ? "eye" : "lock"}>
                    {entry.visibility === "shared" ? t("shared") : t("specialistsOnly")}
                  </Badge>
                  <button type="button" onClick={() => setOpenHistory(openHistory === entry.id ? null : entry.id)}>
                    {t("history")}
                  </button>
                </div>
                {openHistory === entry.id && (
                  <ul className="history-list">
                    {entry.history.map((item) => (
                      <li key={item.at + item.action}>
                        {item.at} · {item.by} · {item.action}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </section>
        {role !== "admin" && child.consent && (
          <aside className="app-card new-entry-card">
            <span className="eyebrow">{t("addToDiary")}</span>
            <h2>{t("newEntry")}</h2>
            <label className="app-field">
              <span>{t("entryType")}</span>
              <select value={type} onChange={(event) => setType(event.target.value as DiaryType)}>
                <option value="observation">{t("observation")}</option>
                <option value="progress">{t("progress")}</option>
                <option value="recommendation">{t("recommendation")}</option>
              </select>
            </label>
            <label className="app-field">
              <span>{t("whatHappened")}</span>
              <textarea value={text} onChange={(event) => setText(event.target.value)} />
            </label>
            <button type="button" className="attach-button">
              <Icon name="plus" size={18} />
              {t("attach")}
            </button>
            {role === "specialist" && (
              <label className="visibility-toggle">
                <input
                  type="checkbox"
                  checked={privateEntry}
                  onChange={(event) => setPrivateEntry(event.target.checked)}
                />
                <span className="fake-toggle" />
                <span>
                  <strong>{t("specialistsOnly")}</strong>
                </span>
              </label>
            )}
            <button
              className="button button--primary"
              type="button"
              onClick={() => {
                addDiary({
                  type,
                  title: t("savedEntry"),
                  text,
                  visibility: role === "specialist" && privateEntry ? "specialists_only" : "shared",
                })
                setText("")
              }}
            >
              {t("saveEntry")}
            </button>
          </aside>
        )}
      </div>
      <section className="app-card progress-card">
        <div className="card-title-row">
          <div>
            <span className="eyebrow">{t("dynamics")}</span>
            <h3>{t("sixWeeks")}</h3>
          </div>
          <Button variant="secondary" onClick={() => setTable(!table)}>
            {table ? t("showChart") : t("showTable")}
          </Button>
        </div>
        {table ? (
          <table className="progress-table">
            <caption className="sr-only">{t("chartLabel")}</caption>
            <thead>
              <tr>
                <th scope="col">{t("week")}</th>
                <th scope="col">{t("goal")}</th>
                <th scope="col">{t("value")}</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["1", t("speech"), "2"],
                ["2", t("speech"), "3"],
                ["3", t("speech"), "3"],
                ["4", t("speech"), "5"],
                ["5", t("speech"), "6"],
                ["6", t("speech"), "7"],
              ].map((row) => (
                <tr key={row[0]}>
                  <td>{row[0]}</td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="chart" role="img" aria-label={t("chartLabel")}>
            <span className="chart__line" />
            <i style={{ left: "8%", bottom: "18%" }} />
            <i style={{ left: "26%", bottom: "35%" }} />
            <i style={{ left: "45%", bottom: "30%" }} />
            <i style={{ left: "63%", bottom: "54%" }} />
            <i style={{ left: "81%", bottom: "68%" }} />
          </div>
        )}
      </section>
    </div>
  )
}

function AccessScreen() {
  const { t, lang, filterAccess } = useApp()
  const [from, setFrom] = useState("2026-01-01")
  const [to, setTo] = useState("2026-12-31")
  const [applied, setApplied] = useState(filterAccess("2026-01-01", "2026-12-31"))
  const rows = useMemo(() => applied, [applied])
  return (
    <div className="page-stack">
      <div className="page-intro">
        <h2>{t("accessTitle")}</h2>
        <p>{t("accessLead")}</p>
      </div>
      <form
        className="app-card filter-bar"
        onSubmit={(event) => {
          event.preventDefault()
          setApplied(filterAccess(from, to))
        }}
      >
        <AppField label={t("from")} type="date" value={from} onChange={setFrom} />
        <AppField label={t("to")} type="date" value={to} onChange={setTo} />
        <Button type="submit">{t("apply")}</Button>
      </form>
      <div className="app-card access-table">
        <div className="access-row access-row--head">
          <span>{t("who")}</span>
          <span>{t("when")}</span>
          <span>{t("what")}</span>
          <span>{t("status")}</span>
        </div>
        {rows.map((row) => (
          <div className={`access-row ${row.allowed ? "" : "access-row--warning"}`} key={row.id}>
            <span data-label={t("who")}>
              <strong>{row.who}</strong>
            </span>
            <span data-label={t("when")}>{formatWhen(row.at, lang)}</span>
            <span data-label={t("what")}>{row.what}</span>
            <span data-label={t("status")}>
              {row.allowed ? (
                <span className="access-ok">
                  <Icon name="check" size={16} />
                  {t("allowed")}
                </span>
              ) : (
                <AppStatus type="warning">{t("denied")}</AppStatus>
              )}
            </span>
          </div>
        ))}
      </div>
      <div className="security-note">
        <Icon name="shield" />
        <div>
          <strong>{t("protected")}</strong>
          <p>{t("protectedText")}</p>
        </div>
      </div>
    </div>
  )
}

function AdminScreen() {
  const { t, users, setUserStatus } = useApp()
  const [query, setQuery] = useState("")
  const visible = users.filter(
    (item) =>
      item.role !== "admin" &&
      (item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.email.toLowerCase().includes(query.toLowerCase())),
  )
  return (
    <div className="page-stack">
      <div className="info-banner">
        <Icon name="lock" />
        <div>
          <strong>{t("noDiary")}</strong>
          <p>{t("noDiaryText")}</p>
        </div>
      </div>
      <div className="page-toolbar">
        <label className="search-box">
          <Icon name="search" size={20} />
          <input
            placeholder={t("findUser")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <div className="app-card admin-table">
        <div className="admin-row admin-row--head">
          <span>{t("user")}</span>
          <span>{t("role")}</span>
          <span>{t("status")}</span>
          <span>{t("actions")}</span>
        </div>
        {visible.map((item) => (
          <div className="admin-row" key={item.id}>
            <span>
              <MiniAvatar tone="sage" />
              <strong>{item.name}</strong>
            </span>
            <span data-label={t("role")}>{item.role === "parent" ? t("parent") : t("specialist")}</span>
            <span data-label={t("status")}>
              <AppStatus
                type={
                  item.status === "active" ? "done" : item.status === "pending" ? "planned" : "blocked"
                }
              >
                {item.status === "active"
                  ? t("confirmed")
                  : item.status === "pending"
                    ? t("pending")
                    : t("blocked")}
              </AppStatus>
            </span>
            <span className="row-actions">
              {item.status === "pending" && (
                <button type="button" onClick={() => setUserStatus(item.id, "active")}>
                  {t("confirm")}
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  setUserStatus(item.id, item.status === "blocked" ? "active" : "blocked")
                }
              >
                {item.status === "blocked" ? t("unblock") : t("block")}
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function TeamScreen() {
  const { t, users, child, role, assignSpecialist, unassignSpecialist, setScreen } = useApp()
  const specialists = users.filter((item) => item.role === "specialist" && item.status !== "blocked")
  const assigned = specialists.filter((item) => child.specialistIds.includes(item.id))
  return (
    <div className="page-stack">
      <div className="page-intro">
        <h2>{t("assigned")}</h2>
        <p>{t("team")}</p>
      </div>
      <section className="app-card">
        {assigned.length === 0 && <p>{t("noTeam")}</p>}
        {assigned.map((item) => (
          <div className="child-row" key={item.id}>
            <MiniAvatar />
            <span>
              <strong>{item.name}</strong>
              <small>{item.email}</small>
            </span>
            {role === "parent" && (
              <button className="button button--secondary" type="button" onClick={() => unassignSpecialist(item.id)}>
                {t("unassign")}
              </button>
            )}
            {role === "specialist" && (
              <button className="button button--secondary" type="button" onClick={() => setScreen("diary")}>
                {t("addNote")}
              </button>
            )}
          </div>
        ))}
      </section>
      {role === "parent" && (
        <section className="app-card">
          <h3>{t("assign")}</h3>
          {specialists
            .filter((item) => !child.specialistIds.includes(item.id))
            .map((item) => (
              <div className="child-row" key={item.id}>
                <MiniAvatar tone="sage" />
                <span>
                  <strong>{item.name}</strong>
                  <small>
                    {item.status === "pending" ? t("pending") : item.email}
                  </small>
                </span>
                <button
                  className="button button--primary"
                  type="button"
                  disabled={item.status !== "active"}
                  onClick={() => assignSpecialist(item.id)}
                >
                  {t("assign")}
                </button>
              </div>
            ))}
        </section>
      )}
    </div>
  )
}
