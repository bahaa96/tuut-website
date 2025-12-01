import type { Metadata } from "next";
import Script from "next/script";
import "../index.css";
import "./globals.css";
import { getLocale } from "../src/paraglide/runtime.js";
import { AuthProvider } from "../contexts/AuthContext";
import { CountryProvider } from "../contexts/CountryContext";

export const metadata: Metadata = {
  title: "Tuut - Mobile App Home Screen",
  description: "Discover amazing products and deals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Extract locale from URL headers if available, fallback to getLocale()
  const getLanguageFromHeaders = () => {
    if (typeof window !== 'undefined') {
      // Client-side: extract from URL path
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0 && pathSegments[0].includes('-')) {
        return pathSegments[0].split('-')[0]; // Extract language from localeCountry
      }
    }
    return getLocale();
  };

  const locale = getLanguageFromHeaders();
  const language = locale.includes('-') ? locale.split('-')[0] : locale;

  return (
    <html lang={locale}>
      <head>
        {/* Font Preloading and Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Readex Pro font for both English and Arabic */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&display=swap"
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-QQQYHWZVFE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-QQQYHWZVFE');
          `}
        </Script>
      </head>
      <body>
        <AuthProvider>
          <CountryProvider>{children}</CountryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
