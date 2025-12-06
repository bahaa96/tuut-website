import * as m from "@/src/paraglide/messages";
import { headers } from "next/headers";
import ContentEN from "./content_en.mdx";
import ContentAR from "./content_ar.mdx";
import { Metadata } from "next";

interface TermsPageProps {
  params: Promise<{
    localeCountry: string;
  }>;
}

export async function generateMetadata({
  params,
}: TermsPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const localeCountry = resolvedParams.localeCountry;

  // Extract language from localeCountry (e.g., "en-EG" -> "en")
  const language = localeCountry.split("-")[0];
  const isArabic = language === "ar";

  const title = isArabic ? "شروط الاستخدام | Tuut" : "Terms of Use | Tuut";

  const description = isArabic
    ? "شروط الاستخدام الخاصة بمنصة Tuut. اقرأ الشروط والأحكام التي تحكم استخدامك لموقعنا وخدماتنا. استخدامك للموقع يشكل موافقتك على هذه الشروط."
    : "Tuut's Terms of Use. Read the terms and conditions that govern your use of our website and services. Your use of the site constitutes acceptance of these terms.";

  const keywords = isArabic
    ? "شروط الاستخدام, أحكام وقواعد, اتفاقية الاستخدام, شروط الموقع, قوانين المنصة, Tuut, كوبونات, خصومات, عروض"
    : "terms of use, terms and conditions, user agreement, website terms, platform rules, Tuut, coupons, discounts, deals";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://tuut.shop/${localeCountry}/terms`,
      siteName: "Tuut",
      images: [
        {
          url: "https://tuut.shop/og-image.jpg",
          width: 1200,
          height: 630,
          alt: isArabic ? "شروط الاستخدام - Tuut" : "Terms of Use - Tuut",
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
      canonical: `https://tuut.shop/${localeCountry}/terms`,
      languages: {
        [localeCountry]: `https://tuut.shop/${localeCountry}/terms`,
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

const TermsPage = async ({ params }: TermsPageProps) => {
  const resolvedParams = await params;
  const headersList = await headers();
  const locale = headersList?.get("x-paraglide-locale") as "ar" | "en";
  const isRTL = locale === "ar";

  // Generate JSON-LD structured data for terms of use
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `https://tuut.shop/${resolvedParams.localeCountry}/terms`,
    name: locale === "ar" ? "شروط الاستخدام" : "Terms of Use",
    description:
      locale === "ar"
        ? "شروط الاستخدام والشروط والأحكام التي تحكم استخدام منصة Tuut"
        : "Terms of use and conditions that govern the use of the Tuut platform",
    url: `https://tuut.shop/${resolvedParams.localeCountry}/terms`,
    inLanguage: locale,
    isPartOf: {
      "@type": "WebSite",
      "@id": `https://tuut.shop/${resolvedParams.localeCountry}/`,
      name: "Tuut",
    },
    dateModified: new Date().toISOString(),
    mainEntity: {
      "@type": "TermsOfService",
      name:
        locale === "ar"
          ? "شروط استخدام منصة Tuut"
          : "Tuut Platform Terms of Use",
      description:
        locale === "ar"
          ? "الاتفاقية القانونية التي تحدد شروط استخدام منصة Tuut للكوبونات والعروض"
          : "Legal agreement that outlines the terms for using the Tuut platform for coupons and deals",
      url: `https://tuut.shop/${resolvedParams.localeCountry}/terms`,
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
      termsOfService: [
        {
          "@type": "Thing",
          name: locale === "ar" ? "قبول الشروط" : "Accepting Terms",
          description:
            locale === "ar"
              ? "استخدام الموقع يشكل موافقة على الشروط والأحكام"
              : "Use of the site constitutes acceptance of terms and conditions",
        },
        {
          "@type": "Thing",
          name: locale === "ar" ? "استخدام الكوبونات" : "Coupon Usage",
          description:
            locale === "ar"
              ? "شروط استخدام واستبدال الكوبونات والخصومات"
              : "Terms for using and redeeming coupons and discounts",
        },
        {
          "@type": "Thing",
          name:
            locale === "ar"
              ? "المسؤولية والضمانات"
              : "Liability and Warranties",
          description:
            locale === "ar"
              ? "الإقرار بعدم المسؤولية والضمانات المحدودة"
              : "Disclaimers and limited warranties",
        },
      ],
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
          name: locale === "ar" ? "شروط الاستخدام" : "Terms of Use",
          item: `https://tuut.shop/${resolvedParams.localeCountry}/terms`,
        },
      ],
    },
  };

  // Generate FAQ structured data for common terms questions
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name:
          locale === "ar"
            ? "ما هو الحد الأدنى للعمر لاستخدام منصة Tuut؟"
            : "What is the minimum age to use Tuut platform?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            locale === "ar"
              ? "يجب أن تكون 18 عامًا على الأقل لتكون مؤهلاً لاستخدام الموقع."
              : "You must be at least 18 years old to be eligible to use the website.",
        },
      },
      {
        "@type": "Question",
        name:
          locale === "ar"
            ? "هل يمكنني دمج كوبونات متعددة في معاملة واحدة؟"
            : "Can I combine multiple coupons in a single transaction?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            locale === "ar"
              ? "لا يمكن استخدام الكوبونات أكثر من مرة، ولا يمكن دمجها مع خصومات أو عروض أخرى."
              : "No coupons can be exercised more than once. Unless specifically stated otherwise, coupons use may not be combined with other coupons, discounts, offers, and/or other promotions.",
        },
      },
      {
        "@type": "Question",
        name:
          locale === "ar"
            ? "ما هي مدة صلاحية الكوبونات؟"
            : "What is the validity period of coupons?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            locale === "ar"
              ? "جميع الكوبونات محدودة بوقت. إذا لم يتم تحديد وقت لاستبدال الكوبون، فستنتهي صلاحيته بعد ستة أشهر من تاريخ الشراء."
              : "All coupons are limited in time. If the time limit for redeeming the coupons is not specified in the sale page, the coupons will expire after six months from the date of the purchase.",
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
              {m.TERMS_OF_USE()}
            </h1>
          </header>
          <div
            className={`prose prose-lg max-w-none text-gray-700 leading-relaxed ${
              isRTL ? "text-right" : "text-left"
            }`}
            role="article"
            aria-label={m.TERMS_OF_USE_CONTENT()}
          >
            {locale === "ar" ? <ContentAR /> : <ContentEN />}
          </div>
        </div>
      </main>
    </>
  );
};

export default TermsPage;
