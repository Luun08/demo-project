import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { applyLang, dictionary, readLang, type Msg } from "../i18n"
import type {
  AccessEvent,
  AppNotice,
  AppScreen,
  AuthMode,
  ChildProfile,
  DiaryEntry,
  DiaryType,
  Lang,
  Lesson,
  Role,
  SessionFormat,
  User,
  View,
  Visibility,
} from "../types"

const usersSeed: User[] = [
  {
    id: "u-parent",
    name: "Айгерим",
    email: "parent@sen.kz",
    role: "parent",
    status: "active",
  },
  {
    id: "u-spec",
    name: "Динара",
    email: "specialist@sen.kz",
    role: "specialist",
    status: "pending",
  },
  {
    id: "u-admin",
    name: "Нурлан",
    email: "admin@sen.kz",
    role: "admin",
    status: "active",
  },
  {
    id: "u-spec-2",
    name: "Самал",
    email: "samal@sen.kz",
    role: "specialist",
    status: "active",
  },
  {
    id: "u-blocked",
    name: "Пользователь 03",
    email: "blocked@sen.kz",
    role: "specialist",
    status: "blocked",
  },
]

const childSeed: ChildProfile = {
  id: "child-a",
  displayName: "Ребёнок А",
  birthDate: "12.04.2018",
  consent: true,
  parentId: "u-parent",
  specialistIds: ["u-spec"],
}

const lessonsSeed: Lesson[] = [
  {
    id: "l1",
    childId: "child-a",
    title: "Занятие с логопедом",
    specialistId: "u-spec",
    date: "14 июня",
    time: "15:00",
    format: "online",
    status: "planned",
  },
  {
    id: "l2",
    childId: "child-a",
    title: "Развивающее занятие",
    specialistId: "u-spec",
    date: "12 июня",
    time: "11:30",
    format: "offline",
    status: "done",
  },
  {
    id: "l3",
    childId: "child-a",
    title: "Консультация для родителя",
    specialistId: "u-spec",
    date: "8 июня",
    time: "16:00",
    format: "online",
    status: "canceled",
  },
]

const diarySeed: DiaryEntry[] = [
  {
    id: "d1",
    childId: "child-a",
    type: "observation",
    title: "Самостоятельно попросил помощь",
    text: "Ребёнок А использовал короткую фразу и спокойно дождался ответа.",
    visibility: "shared",
    authorId: "u-spec",
    createdAt: "Сегодня, 14:20",
    history: [{ at: "Сегодня, 14:20", by: "Динара", action: "Создано" }],
  },
  {
    id: "d2",
    childId: "child-a",
    type: "progress",
    title: "Удерживал внимание 12 минут",
    text: "На занятии получилось выполнить упражнение без дополнительной подсказки.",
    visibility: "shared",
    authorId: "u-spec",
    createdAt: "12 июня, 17:40",
    history: [{ at: "12 июня, 17:40", by: "Динара", action: "Создано" }],
  },
  {
    id: "d3",
    childId: "child-a",
    type: "recommendation",
    title: "Повторить упражнение дома",
    text: "Динара предлагает повторять артикуляционное упражнение по 5 минут.",
    visibility: "specialists_only",
    authorId: "u-spec",
    createdAt: "10 июня, 11:15",
    history: [{ at: "10 июня, 11:15", by: "Динара", action: "Создано" }],
  },
]

const accessSeed: AccessEvent[] = [
  {
    id: "a1",
    who: "Динара, логопед",
    at: "2026-06-14T14:22:00",
    what: "Запись «Самостоятельно попросил помощь»",
    allowed: true,
  },
  {
    id: "a2",
    who: "Айгерим",
    at: "2026-06-14T09:10:00",
    what: "Расписание",
    allowed: true,
  },
  {
    id: "a3",
    who: "Неизвестный аккаунт",
    at: "2026-06-13T23:48:00",
    what: "Профиль ребёнка",
    allowed: false,
  },
  {
    id: "a4",
    who: "Динара, логопед",
    at: "2026-06-10T16:05:00",
    what: "Дневник развития",
    allowed: true,
  },
]

interface AppState {
  lang: Lang
  view: View
  authMode: AuthMode
  role: Role
  user: User | null
  screen: AppScreen
  screenState: "ready" | "loading" | "empty" | "error"
  users: User[]
  child: ChildProfile
  lessons: Lesson[]
  diary: DiaryEntry[]
  accessLog: AccessEvent[]
  notice: AppNotice | null
  t: (key: Msg) => string
  setLang: (lang: Lang) => void
  goLanding: () => void
  goAuth: (mode?: AuthMode) => void
  enterAs: (role: Exclude<Role, "guest">) => void
  enterGuest: () => void
  login: (email: string, password: string, role: Exclude<Role, "guest">) => string | null
  register: (email: string, password: string, role: Exclude<Role, "guest">) => string | null
  logout: () => void
  setScreen: (screen: AppScreen) => void
  setScreenState: (state: AppState["screenState"]) => void
  logAccess: (what: string) => void
  saveChild: (patch: Partial<ChildProfile>) => void
  addLesson: (lesson: Omit<Lesson, "id" | "childId" | "specialistId">) => void
  addDiary: (entry: {
    type: DiaryType
    title: string
    text: string
    visibility: Visibility
  }) => void
  assignSpecialist: (id: string) => void
  unassignSpecialist: (id: string) => void
  setUserStatus: (id: string, status: User["status"]) => void
  dismissNotice: () => void
  filterAccess: (from: string, to: string) => AccessEvent[]
}

const AppContext = createContext<AppState | null>(null)

function navFor(role: Role): AppScreen[] {
  if (role === "admin") return ["admin"]
  if (role === "specialist") return ["home", "schedule", "diary", "team"]
  if (role === "parent") return ["home", "schedule", "diary", "access", "profile", "team"]
  return []
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readLang)
  const [view, setView] = useState<View>("landing")
  const [authMode, setAuthMode] = useState<AuthMode>("login")
  const [role, setRole] = useState<Role>("guest")
  const [user, setUser] = useState<User | null>(null)
  const [screen, setScreenRaw] = useState<AppScreen>("home")
  const [screenState, setScreenState] = useState<AppState["screenState"]>("ready")
  const [users, setUsers] = useState(usersSeed)
  const [child, setChild] = useState(childSeed)
  const [lessons, setLessons] = useState(lessonsSeed)
  const [diary, setDiary] = useState(diarySeed)
  const [accessLog, setAccessLog] = useState(accessSeed)
  const [notice, setNotice] = useState<AppNotice | null>(() => ({
    id: "n1",
    text: dictionary[readLang()].notice,
  }))

  useEffect(() => {
    applyLang(lang)
  }, [lang])

  const t = useCallback((key: Msg) => dictionary[lang][key], [lang])

  const goLanding = useCallback(() => {
    setView("landing")
    setRole("guest")
    setUser(null)
  }, [])

  const goAuth = useCallback((mode: AuthMode = "login") => {
    setAuthMode(mode)
    setView("auth")
  }, [])

  const boot = useCallback((next: User) => {
    setUser(next)
    setRole(next.role)
    setView("app")
    setScreenRaw(next.role === "admin" ? "admin" : "home")
    setScreenState("loading")
    window.setTimeout(() => setScreenState("ready"), 450)
    setNotice({ id: "n1", text: dictionary[lang].notice })
  }, [lang])

  const enterAs = useCallback(
    (nextRole: Exclude<Role, "guest">) => {
      const found = users.find((item) => item.role === nextRole && item.status !== "blocked")
      if (found) boot(found)
    },
    [boot, users],
  )

  const enterGuest = useCallback(() => {
    setUser(null)
    setRole("guest")
    setView("landing")
  }, [])

  const login = useCallback(
    (email: string, password: string, chosen: Exclude<Role, "guest">) => {
      if (!email.includes("@")) return "email"
      if (password.length < 8) return "password"
      const found =
        users.find((item) => item.email === email) ??
        users.find((item) => item.role === chosen && item.status !== "blocked")
      if (!found || found.status === "blocked") return "email"
      boot(found)
      return null
    },
    [boot, users],
  )

  const register = useCallback(
    (email: string, password: string, chosen: Exclude<Role, "guest">) => {
      if (!email.includes("@")) return "email"
      if (password.length < 8) return "password"
      const created: User = {
        id: `u-${Date.now()}`,
        name: email.split("@")[0],
        email,
        role: chosen,
        status: chosen === "specialist" ? "pending" : "active",
      }
      setUsers((prev) => [...prev, created])
      boot(created)
      return null
    },
    [boot],
  )

  const logout = useCallback(() => {
    setUser(null)
    setRole("guest")
    setView("landing")
    setScreenRaw("home")
  }, [])

  const setScreen = useCallback(
    (next: AppScreen) => {
      const allowed = navFor(role)
      if (!allowed.includes(next)) return
      setScreenRaw(next)
      if (user) {
        const labels: Record<AppScreen, string> = {
          home: "Главная",
          profile: "Профиль ребёнка",
          schedule: "Расписание",
          diary: "Дневник развития",
          access: "Журнал доступа",
          team: "Команда сопровождения",
          admin: "Панель администратора",
        }
        setAccessLog((prev) => [
          {
            id: `a-${Date.now()}`,
            who: user.name,
            at: new Date().toISOString(),
            what: labels[next],
            allowed: true,
          },
          ...prev,
        ])
      }
    },
    [role, user],
  )

  const logAccess = useCallback(
    (what: string) => {
      if (!user) return
      setAccessLog((prev) => [
        {
          id: `a-${Date.now()}`,
          who: user.name,
          at: new Date().toISOString(),
          what,
          allowed: true,
        },
        ...prev,
      ])
    },
    [user],
  )

  const saveChild = useCallback((patch: Partial<ChildProfile>) => {
    setChild((prev) => ({ ...prev, ...patch }))
  }, [])

  const addLesson = useCallback(
    (lesson: Omit<Lesson, "id" | "childId" | "specialistId">) => {
      setLessons((prev) => [
        {
          ...lesson,
          id: `l-${Date.now()}`,
          childId: child.id,
          specialistId: child.specialistIds[0] ?? "u-spec",
        },
        ...prev,
      ])
    },
    [child],
  )

  const addDiary = useCallback(
    (entry: {
      type: DiaryType
      title: string
      text: string
      visibility: Visibility
    }) => {
      if (!user) return
      setDiary((prev) => [
        {
          id: `d-${Date.now()}`,
          childId: child.id,
          authorId: user.id,
          createdAt: dictionary[lang].justNow,
          history: [
            {
              at: dictionary[lang].justNow,
              by: user.name,
              action: dictionary[lang].saveEntry,
            },
          ],
          title: entry.title || dictionary[lang].savedEntry,
          text: entry.text,
          type: entry.type,
          visibility: entry.visibility,
        },
        ...prev,
      ])
    },
    [child.id, lang, user],
  )

  const assignSpecialist = useCallback((id: string) => {
    setChild((prev) =>
      prev.specialistIds.includes(id)
        ? prev
        : { ...prev, specialistIds: [...prev.specialistIds, id] },
    )
  }, [])

  const unassignSpecialist = useCallback((id: string) => {
    setChild((prev) => ({
      ...prev,
      specialistIds: prev.specialistIds.filter((item) => item !== id),
    }))
  }, [])

  const setUserStatus = useCallback((id: string, status: User["status"]) => {
    setUsers((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
  }, [])

  const dismissNotice = useCallback(() => setNotice(null), [])

  const filterAccess = useCallback(
    (from: string, to: string) => {
      const fromTime = Date.parse(from)
      const toTime = Date.parse(to)
      return accessLog.filter((item) => {
        const time = Date.parse(item.at)
        if (Number.isNaN(fromTime) || Number.isNaN(toTime) || Number.isNaN(time)) return true
        return time >= fromTime && time <= toTime + 86400000
      })
    },
    [accessLog],
  )

  const changeLang = useCallback((next: Lang) => {
    setLang(next)
    applyLang(next)
    setNotice((prev) => (prev ? { ...prev, text: dictionary[next].notice } : prev))
  }, [])

  const value = useMemo<AppState>(
    () => ({
      lang,
      view,
      authMode,
      role,
      user,
      screen,
      screenState,
      users,
      child,
      lessons,
      diary,
      accessLog,
      notice,
      t,
      setLang: changeLang,
      goLanding,
      goAuth,
      enterAs,
      enterGuest,
      login,
      register,
      logout,
      setScreen,
      setScreenState,
      logAccess,
      saveChild,
      addLesson,
      addDiary,
      assignSpecialist,
      unassignSpecialist,
      setUserStatus,
      dismissNotice,
      filterAccess,
    }),
    [
      lang,
      view,
      authMode,
      role,
      user,
      screen,
      screenState,
      users,
      child,
      lessons,
      diary,
      accessLog,
      notice,
      t,
      changeLang,
      goLanding,
      goAuth,
      enterAs,
      enterGuest,
      login,
      register,
      logout,
      setScreen,
      logAccess,
      saveChild,
      addLesson,
      addDiary,
      assignSpecialist,
      unassignSpecialist,
      setUserStatus,
      dismissNotice,
      filterAccess,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used inside AppProvider")
  return ctx
}

export { navFor }
