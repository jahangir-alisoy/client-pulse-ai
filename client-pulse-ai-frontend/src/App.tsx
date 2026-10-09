import { Navigate, Route, Routes } from 'react-router'
import { RequireAuth } from './auth/RequireAuth'
import { AppShell } from './components/AppShell'
import { ApiKeysPage } from './features/api-keys/ApiKeysPage'
import { LoginPage } from './features/auth/LoginPage'
import { OverviewPage } from './features/overview/OverviewPage'
import { RequestDetailDrawer } from './features/requests/RequestDetailDrawer'
import { RequestsPage } from './features/requests/RequestsPage'
import { SettingsPage } from './features/settings/SettingsPage'
import { SimulationPage } from './features/simulation/SimulationPage'

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/simulation" element={<SimulationPage />} />
        <Route path="/requests" element={<RequestsPage />}>
          <Route path=":id" element={<RequestDetailDrawer />} />
        </Route>
        <Route path="/api-keys" element={<ApiKeysPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  )
}
