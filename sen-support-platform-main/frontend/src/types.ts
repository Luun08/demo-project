export type Lang = "kz" | "ru" | "en"
export type Role = "parent" | "specialist" | "admin" | "guest"
export type View = "landing" | "auth" | "app"
export type AuthMode = "login" | "register" | "recover"
export type AppScreen =
  | "home"
  | "profile"
  | "schedule"
  | "diary"
  | "access"
  | "team"
  | "admin"
export type SessionStatus = "planned" | "done" | "canceled"
export type SessionFormat = "online" | "offline"
export type DiaryType = "observation" | "progress" | "recommendation"
export type Visibility = "shared" | "specialists_only"
export type UserStatus = "active" | "pending" | "blocked"
export type ScreenState = "ready" | "loading" | "empty" | "error"

export const locales: Lang[] = ["kz", "ru", "en"]

export function isLang(value: string | null | undefined): value is Lang {
  return value === "kz" || value === "ru" || value === "en"
}

export interface User {
  id: string
  name: string
  email: string
  role: Exclude<Role, "guest">
  status: UserStatus
}

export interface ChildProfile {
  id: string
  displayName: string
  birthDate: string
  consent: boolean
  parentId: string
  specialistIds: string[]
}

export interface Lesson {
  id: string
  childId: string
  title: string
  specialistId: string
  date: string
  time: string
  format: SessionFormat
  status: SessionStatus
}

export interface DiaryHistoryItem {
  at: string
  by: string
  action: string
}

export interface DiaryEntry {
  id: string
  childId: string
  type: DiaryType
  title: string
  text: string
  visibility: Visibility
  authorId: string
  createdAt: string
  history: DiaryHistoryItem[]
}

export interface AccessEvent {
  id: string
  who: string
  at: string
  what: string
  allowed: boolean
}

export interface AppNotice {
  id: string
  text: string
}
