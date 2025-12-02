import { Header } from "../../components/Header";
import Footer from "../../components/FooterSSR";
import { Toaster } from "../../components/ui/sonner";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ localeCountry: string }>;
}) {
  // Await params as required by Next.js 15
  const resolvedParams = await params;

  const language = resolvedParams.localeCountry.split("-")[0];
  const isRTL = language === "ar";

  return (
    <div
      className="min-h-screen flex flex-col"
      data-font={language.startsWith("ar") ? "arabic" : "english"}
    >
      <Header />
      <main className="flex-1">{children}</main>
      <Footer isRTL={isRTL} />
      <Toaster />
    </div>
  );
}
