import type { Metadata } from "next";
import Script from "next/script";
import "../index.css";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { CountryProvider } from "../contexts/CountryContext";
import { headers } from "next/headers";
import { cache, use } from "react";
import {
  assertIsLocale,
  baseLocale,
  Locale,
  overwriteGetLocale,
  overwriteGetUrlOrigin,
  setLocale,
} from "@/src/paraglide/runtime";

export const metadata: Metadata = {
  title: "Tuut - Mobile App Home Screen",
  description: "Discover amazing products and deals",
};

const ssrLocale = cache(() => ({
  locale: baseLocale,
  origin: "http://localhost",
}));
// overwrite the getLocale function to use the locale from the request
overwriteGetLocale(() => assertIsLocale(ssrLocale().locale));
overwriteGetUrlOrigin(() => ssrLocale().origin);

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const locale = headersList?.get("x-paraglide-locale") as Locale;
  const isRTL = locale === "ar";

  // @ts-expect-error - headers must be sync
  // https://github.com/opral/inlang-paraglide-js/issues/245#issuecomment-2608727658
  ssrLocale().locale = locale;

  // @ts-expect-error - headers must be sync
  ssrLocale().origin = new URL(
    headersList?.get("x-paraglide-request-url") as string
  ).origin;

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <head>
        {/* Font Preloading and Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

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
