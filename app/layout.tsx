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
  const locale = getLocale();
  return (
    <html lang={locale}>
      <head>
        {/* Font Preloading and Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&display=swap&family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          as="style"
          onLoad="this.onload=null;this.rel='stylesheet'"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Readex+Pro:wght@300;400;500;600;700&display=swap&family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap"
          />
        </noscript>

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
