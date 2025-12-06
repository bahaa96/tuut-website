import * as m from "@/src/paraglide/messages";
import { headers } from "next/headers";
import ContentEN from "./content_en.mdx";
import ContentAR from "./content_ar.mdx";
import { Metadata } from "next";

interface PrivacyPageProps {
  params: Promise<{
    localeCountry: string;
  }>;
}

export async function generateMetadata({
  params,
}: PrivacyPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const localeCountry = resolvedParams.localeCountry;

  // Extract language from localeCountry (e.g., "en-EG" -> "en")
  const language = localeCountry.split("-")[0];
  const isArabic = language === "ar";

  const title = isArabic
    ? "سياسة الخصوصية | Tuut"
    : "Privacy Policy | Tuut";

  const description = isArabic
    ? "سياسة الخصوصية الخاصة بـ Tuut. تعرف على كيفية جمعنا واستخدامنا وحمايتينا لمعلوماتك الشخصية. نحن ملتزمون بحماية خصوصيتك وضمان أمان بياناتك."
    : "Tuut's Privacy Policy. Learn how we collect, use, and protect your personal information. We are committed to protecting your privacy and ensuring your data is secure.";

  const keywords = isArabic
    ? "سياسة الخصوصية, خصوصية, حماية البيانات, معلومات شخصية, أمان, خصوصية المستخدم, بيانات المستخدم, Tuut"
    : "privacy policy, privacy, data protection, personal information, security, user privacy, user data, Tuut";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://tuut.shop/${localeCountry}/privacy`,
      siteName: "Tuut",
      images: [
        {
          url: "https://tuut.shop/og-image.jpg",
          width: 1200,
          height: 630,
          alt: isArabic ? "سياسة الخصوصية - Tuut" : "Privacy Policy - Tuut",
        },
      ],
      locale: localeCountry,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://tuut.shop/og-image.jpg"],
    },
    alternates: {
      canonical: `https://tuut.shop/${localeCountry}/privacy`,
      languages: {
        [localeCountry]: `https://tuut.shop/${localeCountry}/privacy`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

const PrivacyPage = async ({ params }: PrivacyPageProps) => {
  const resolvedParams = await params;
  const headersList = await headers();
  const locale = headersList?.get("x-paraglide-locale") as "ar" | "en";
  const isRTL = locale === "ar";

  // Generate JSON-LD structured data for privacy policy
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `https://tuut.shop/${resolvedParams.localeCountry}/privacy`,
    name: locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy",
    description: locale === "ar"
      ? "سياسة الخصوصية الخاصة بـ Tuut. تعرف على كيفية جمعنا واستخدامنا وحمايتينا لمعلوماتك الشخصية."
      : "Tuut's Privacy Policy. Learn how we collect, use, and protect your personal information.",
    url: `https://tuut.shop/${resolvedParams.localeCountry}/privacy`,
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      "@id": `https://tuut.shop/${resolvedParams.localeCountry}/`,
      name: "Tuut",
    },
    dateModified: new Date().toISOString(),
    mainEntity: {
      "@type": "PrivacyPolicy",
      name: locale === "ar" ? "سياسة الخصوصية لـ Tuut" : "Tuut Privacy Policy",
      description: locale === "ar"
        ? "سياسة الخصوصية التي تحدد كيفية جمع واستخدام وحماية معلومات المستخدمين الشخصية في منصة Tuut"
        : "Privacy policy that governs how Tuut collects, uses, and protects users' personal information",
      url: `https://tuut.shop/${resolvedParams.localeCountry}/privacy`,
      dateModified: new Date().toISOString(),
      publisher: {
        "@type": "Organization",
        name: "Tuut",
        url: "https://tuut.shop",
        logo: {
          "@type": "ImageObject",
          url: "https://tuut.shop/logo.png",
        },
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "ar" ? "الرئيسية" : "Home",
          item: `https://tuut.shop/${resolvedParams.localeCountry}/`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy",
          item: `https://tuut.shop/${resolvedParams.localeCountry}/privacy`,
        },
      ],
    },
  };

  // Generate FAQ structured data for common privacy questions
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: locale === "ar"
          ? "ما نوع المعلومات التي تجمعها Tuut؟"
          : "What information does Tuut collect?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "ar"
            ? "نحن نجمع معلومات شخصية تحديد الهوية مثل اسم الكيان التجاري، عنوان البريد الإلكتروني، العنوان البريدي، أرقام الهواتف، معلومات الحساب، وعنوان IP."
            : "We collect personally identifiable information such as business entity name, email address, mailing address, telephone numbers, account information, and IP address.",
        },
      },
      {
        "@type": "Question",
        name: locale === "ar"
          ? "هل تشارك Tuut معلوماتي مع أطراف ثالثة؟"
          : "Does Tuut share my information with third parties?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "ar"
            ? "بشكل عام، لا نبيع أو نؤجر معلوماتك الشخصية لأطراف غير ذات صلة. نشارك المعلومات فقط مع الأطراف الثالثة عندما يكون لدينا أساس قانوني للقيام بذلك."
            : "As a general rule, we do not sell, share, or rent your personally identifiable information to unrelated parties. We only share information with third parties when we have a lawful basis to do so.",
        },
      },
      {
        "@type": "Question",
        name: locale === "ar"
          ? "كيف تحمي Tuut معلوماتي؟"
          : "How does Tuut protect my information?",
        acceptedAnswer: {
          "@type": "Answer",
          text: locale === "ar"
            ? "نحن نسعى لحماية معلومات حاملي الحسابات لدينا. يتم تشفير المعلومات الحساسة أثناء النقل وتخزينها في خوادم آمنة."
            : "We endeavor to safeguard and protect our Account holders' information. Sensitive information is encrypted during transmission and stored on secure servers.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
      <main className="min-h-screen py-16 px-4 sm:px-6 lg:px-8" role="main">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {m.PRIVACY_POLICY()}
            </h1>
          </header>
          <div
            className={`prose prose-lg max-w-none text-gray-700 leading-relaxed ${
              isRTL ? "text-right" : "text-left"
            }`}
            role="article"
            aria-label="Privacy Policy Content"
          >
            {locale === "ar" ? <ContentAR /> : <ContentEN />}
          </div>
        </div>
      </main>
    </>
  );
};

export default PrivacyPage;
