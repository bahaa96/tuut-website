import * as m from "@/src/paraglide/messages";
import { headers } from "next/headers";
import ContentEN from "./content_en.mdx";
import ContentAR from "./content_ar.mdx";

const PrivacyPage = async () => {
  const headersList = await headers();
  const locale = headersList?.get("x-paraglide-locale") as "ar" | "en";
  const isRTL = locale === "ar";

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {m.PRIVACY_POLICY()}
        </h1>
        <div
          className={`prose max-w-none text-gray-700 leading-relaxed ${
            isRTL ? "text-right" : "text-left"
          }`}
        >
          {locale === "ar" ? <ContentAR /> : <ContentEN />}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
