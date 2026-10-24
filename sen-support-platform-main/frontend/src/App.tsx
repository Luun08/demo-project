import { AppProvider, useApp } from "./context/AppContext"
import { AuthPage } from "./pages/AuthPage"
import { LandingPage } from "./pages/LandingPage"
import { Workspace } from "./pages/Workspace"

function Root() {
  const { view } = useApp()
  if (view === "auth") return <AuthPage />
  if (view === "app") return <Workspace />
  return <LandingPage />
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  )
}
