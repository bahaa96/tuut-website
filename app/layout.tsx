import type { Metadata } from 'next'
import './globals.css'
import { getDefaultLocale, isValidLocale } from '../lib/i18n';
import { AuthProvider } from '../contexts/AuthContext'
import { LanguageProvider } from '../contexts/LanguageContext'
import { CountryProvider } from '../contexts/CountryContext'

export const metadata: Metadata = {
  title: 'Tuut - Mobile App Home Screen',
  description: 'Discover amazing products and deals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang={getDefaultLocale()}>
      <body>
        <AuthProvider>
          <LanguageProvider>
            <CountryProvider>
              {children}
            </CountryProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}