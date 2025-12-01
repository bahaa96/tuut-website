import type { Metadata } from "next";
import Script from "next/script";
import "../index.css";
import "./globals.css";
import { getDefaultLocale, isValidLocale } from "../lib/i18n";
import { AuthProvider } from "../contexts/AuthContext";
import { LanguageProvider } from "../contexts/LanguageContext";
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
  return (
    <html lang={getDefaultLocale()}>
      <head>
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
          <LanguageProvider>
            <CountryProvider>{children}</CountryProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
