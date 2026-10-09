import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { App } from './App'
import { AuthProvider } from './auth/AuthContext'
import { AnalysisFilterProvider } from './filters/AnalysisFilterContext'
import { ThemeProvider } from './theme/ThemeContext'
import './styles/tokens.css'
import './styles/base.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <AnalysisFilterProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AnalysisFilterProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
