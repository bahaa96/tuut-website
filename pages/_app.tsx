import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { CountryProvider } from '../contexts/CountryContext';
import '../index.css';
import '../app/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <CountryProvider>
          <Component {...pageProps} />
        </CountryProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}