import { renderToString } from 'react-dom/server'
import App from './App'
import { LanguageProvider } from './contexts/LanguageContext'
import { CountryProvider } from './contexts/CountryContext'
import { AuthProvider } from './contexts/AuthContext'
import { RouterProvider } from './router'

// Server-side rendering entry point
export function renderApp(path: string = '/'): string {
  try {
    return renderToString(
      <RouterProvider initialPath={path}>
        <LanguageProvider>
          <CountryProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </CountryProvider>
        </LanguageProvider>
      </RouterProvider>
    )
  } catch (error) {
    console.error('Server-side rendering error:', error)
    return `
      <div style="padding: 20px; text-align: center;">
        <h1>Loading...</h1>
        <p>Please wait while we load the content.</p>
      </div>
    `
  }
}

export default renderApp