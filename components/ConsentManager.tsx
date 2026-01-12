"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Cookie,
  Shield,
  Settings,
  ChevronDown,
  ChevronUp,
  Info,
  MapPin,
} from "lucide-react";
import {
  hasConsent,
  getConsentPreferences,
  saveConsentPreferences,
  acceptAllCookies,
  rejectAllCookies,
  detectRegion,
  detectUSState,
  getDefaultPreferences,
  initializeAnalytics,
  US_PRIVACY_STATES,
  type ConsentPreferences,
  type USState,
} from "@/utils/privacy";
import { getLocale } from "@/src/paraglide/runtime";

// Translations
const translations = {
  en: {
    cookie: {
      title: "We Value Your Privacy",
      titleUS: "Your Privacy Choices",
      description:
        'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By clicking "Accept All", you consent to our use of cookies.',
      descriptionUS:
        "We use cookies and similar technologies. You have the right to opt out of the sale or sharing of your personal information.",
      necessary: "Necessary",
      necessaryDesc:
        "Essential for the website to function properly. Cannot be disabled.",
      analytics: "Analytics",
      analyticsDesc:
        "Help us understand how visitors interact with our website.",
      marketing: "Marketing",
      marketingDesc:
        "Used to track visitors across websites to display relevant ads.",
      personalization: "Personalization",
      personalizationDesc:
        "Allow us to remember your preferences and provide customized content.",
      acceptAll: "Accept All",
      rejectAll: "Reject All",
      savePreferences: "Save Preferences",
      customize: "Customize",
      close: "Close",
      doNotSell: "Do Not Sell My Personal Information",
      doNotSellDesc:
        "Opt out of the sale or sharing of your personal information under CCPA/CPRA.",
      privacyPolicy: "Privacy Policy",
      cookiePolicy: "Cookie Policy",
      learnMore: "Learn More",
      yourChoices: "Your Choices",
      gdprNotice: "We respect your privacy rights under GDPR.",
      ccpaNotice: "California Consumer Privacy Act (CCPA) rights apply.",
    },
  },
  ar: {
    cookie: {
      title: "نحن نقدّر خصوصيتك",
      titleUS: "خيارات الخصوصية",
      description:
        'نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتحليل حركة الموقع وتخصيص المحتوى. بالنقر على "قبول الكل"، فإنك توافق على استخدامنا لملفات تعريف الارتباط.',
      descriptionUS:
        "نستخدم ملفات تعريف الارتباط وتقنيات مماثلة. لديك الحق في رفض بيع أو مشاركة معلوماتك الشخصية.",
      necessary: "ضرورية",
      necessaryDesc: "أساسية لعمل الموقع بشكل صحيح. لا يمكن تعطيلها.",
      analytics: "تحليلات",
      analyticsDesc: "تساعدنا على فهم كيفية تفاعل الزوار مع موقعنا.",
      marketing: "تسويق",
      marketingDesc: "تستخدم لتتبع الزوار عبر المواقع لعرض إعلانات ذات صلة.",
      personalization: "تخصيص",
      personalizationDesc: "تسمح لنا بتذكر تفضيلاتك وتقديم محتوى مخصص.",
      acceptAll: "قبول الكل",
      rejectAll: "رفض الكل",
      savePreferences: "حفظ التفضيلات",
      customize: "تخصيص",
      close: "إغلاق",
      doNotSell: "لا تبيع معلوماتي الشخصية",
      doNotSellDesc: "رفض بيع أو مشاركة معلوماتك الشخصية بموجب CCPA/CPRA.",
      privacyPolicy: "سياسة الخصوصية",
      cookiePolicy: "سياسة ملفات تعريف الارتباط",
      learnMore: "معرفة المزيد",
      yourChoices: "خياراتك",
      gdprNotice: "نحن نحترم حقوق الخصوصية الخاصة بك بموجب GDPR.",
      ccpaNotice: "تنطبق حقوق قانون خصوصية المستهلك في كاليفورنيا (CCPA).",
    },
  },
};

function ConsentManager() {
  const language = getLocale();
  const isRTL = language === "ar";
  const [showBanner, setShowBanner] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [region, setRegion] = useState<"eu" | "us" | "other">("other");
  const [preferences, setPreferences] = useState<ConsentPreferences>(
    getDefaultPreferences("other")
  );

  useEffect(() => {
    // Detect region
    const detectedRegion = detectRegion();
    setRegion(detectedRegion);

    // Check if user has already made a choice
    if (!hasConsent()) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);

      // Set default preferences based on region
      setPreferences(getDefaultPreferences(detectedRegion));
    } else {
      // Load existing preferences
      const existing = getConsentPreferences();
      if (existing) {
        setPreferences(existing);
        initializeAnalytics(existing);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookies(region);
    setShowBanner(false);
    setShowCustomize(false);
  };

  const handleRejectAll = () => {
    rejectAllCookies(region);
    setShowBanner(false);
    setShowCustomize(false);
  };

  const handleSavePreferences = () => {
    saveConsentPreferences({
      ...preferences,
      timestamp: Date.now(),
    });
    initializeAnalytics(preferences);
    setShowBanner(false);
    setShowCustomize(false);
  };

  const togglePreference = (key: keyof ConsentPreferences) => {
    if (key === "necessary") return; // Can't disable necessary cookies

    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isUS = region === "us";
  const isEU = region === "eu";

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`
            fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6
            ${isRTL ? "text-right" : "text-left"}
          `}
        >
          <div className="container mx-auto max-w-[1200px]">
            <div
              className={`
              bg-white rounded-2xl
              shadow-[8px_8px_0px_0px_rgba(17,24,39,1)]
              overflow-hidden
            `}
              style={{
                border: '4px solid #111827',
              }}
            >
              {/* Header */}
              <div
                className={`
                px-6 py-4 flex items-center justify-between
                ${isRTL ? "flex-row-reverse" : ""}
              `}
                style={{
                  background: 'linear-gradient(to right, #5FB57A, #4FA56A)',
                }}
              >
                <div className="flex items-center gap-3">
                  <Cookie className="h-8 w-8 text-white" />
                  <h3
                    className="text-white text-xl md:text-2xl"
                    style={{ fontWeight: 700 }}
                  >
                    {isUS
                      ? translations[language].cookie.titleUS
                      : translations[language].cookie.title}
                  </h3>
                </div>
                <button
                  onClick={handleRejectAll}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Region Notice */}
                {(isEU || isUS) && (
                  <Badge
                    className={`
                    mb-4 bg-[#E8F3E8] text-[#5FB57A] border-2 border-[#5FB57A]
                    ${isRTL ? "mr-auto" : "ml-auto"}
                  `}
                  >
                    <Shield className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"}`} />
                    {isEU
                      ? translations[language].cookie.gdprNotice
                      : translations[language].cookie.ccpaNotice}
                  </Badge>
                )}

                <p className="text-[#6B7280] mb-6 text-base leading-relaxed">
                  {isUS
                    ? translations[language].cookie.descriptionUS
                    : translations[language].cookie.description}
                </p>

                {/* Customize Options */}
                <AnimatePresence>
                  {showCustomize && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mb-6 space-y-3 overflow-hidden"
                    >
                      {/* Necessary Cookies */}
                      <CookieOption
                        title={translations[language].cookie.necessary}
                        description={
                          translations[language].cookie.necessaryDesc
                        }
                        enabled={true}
                        disabled={true}
                        isRTL={isRTL}
                      />

                      {/* Analytics */}
                      <CookieOption
                        title={translations[language].cookie.analytics}
                        description={
                          translations[language].cookie.analyticsDesc
                        }
                        enabled={preferences.analytics}
                        onChange={() => togglePreference("analytics")}
                        isRTL={isRTL}
                      />

                      {/* Marketing */}
                      <CookieOption
                        title={translations[language].cookie.marketing}
                        description={
                          translations[language].cookie.marketingDesc
                        }
                        enabled={preferences.marketing}
                        onChange={() => togglePreference("marketing")}
                        isRTL={isRTL}
                      />

                      {/* Personalization */}
                      <CookieOption
                        title={translations[language].cookie.personalization}
                        description={
                          translations[language].cookie.personalizationDesc
                        }
                        enabled={preferences.personalization}
                        onChange={() => togglePreference("personalization")}
                        isRTL={isRTL}
                      />

                      {/* US-specific: Do Not Sell */}
                      {isUS && (
                        <CookieOption
                          title={translations[language].cookie.doNotSell}
                          description={
                            translations[language].cookie.doNotSellDesc
                          }
                          enabled={!preferences.doNotSell}
                          onChange={() => togglePreference("doNotSell")}
                          isRTL={isRTL}
                          isDoNotSell={true}
                        />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div
                  className={`
                  flex flex-col sm:flex-row gap-3 items-stretch sm:items-center
                  ${isRTL ? "sm:flex-row-reverse" : ""}
                `}
                >
                  <Button
                    onClick={handleAcceptAll}
                    className={`
                      flex-1 bg-[#5FB57A] text-white border-2 border-[#111827]
                      hover:bg-[#4FA56A] rounded-lg
                      shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]
                      hover:shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]
                      transition-all
                    `}
                    style={{ fontWeight: 600 }}
                  >
                    {translations[language].cookie.acceptAll}
                  </Button>

                  {showCustomize ? (
                    <Button
                      onClick={handleSavePreferences}
                      variant="outline"
                      className="flex-1 border-2 border-[#111827] text-[#111827] hover:bg-[#F0F7F0] rounded-lg"
                      style={{ fontWeight: 600 }}
                    >
                      {translations[language].cookie.savePreferences}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setShowCustomize(true)}
                      variant="outline"
                      className="flex-1 border-2 border-[#111827] text-[#111827] hover:bg-[#F0F7F0] rounded-lg"
                      style={{ fontWeight: 600 }}
                    >
                      <Settings
                        className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                      />
                      {translations[language].cookie.customize}
                    </Button>
                  )}

                  <Button
                    onClick={handleRejectAll}
                    variant="ghost"
                    className="flex-1 text-[#6B7280] hover:bg-gray-100 rounded-lg"
                    style={{ fontWeight: 600 }}
                  >
                    {translations[language].cookie.rejectAll}
                  </Button>
                </div>

                {/* Privacy Links */}
                <div
                  className={`
                  mt-4 pt-4 border-t-2 border-gray-200
                  flex flex-wrap gap-4 justify-center text-sm
                `}
                >
                  <a
                    href="/privacy-policy"
                    className="text-[#5FB57A] hover:underline flex items-center gap-1"
                  >
                    <Info className="h-4 w-4" />
                    {translations[language].cookie.privacyPolicy}
                  </a>
                  <span className="text-gray-300">•</span>
                  <a
                    href="/cookie-policy"
                    className="text-[#5FB57A] hover:underline flex items-center gap-1"
                  >
                    <Cookie className="h-4 w-4" />
                    {translations[language].cookie.cookiePolicy}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Cookie Option Component
interface CookieOptionProps {
  title: string;
  description: string;
  enabled: boolean;
  onChange?: () => void;
  disabled?: boolean;
  isRTL: boolean;
  isDoNotSell?: boolean;
}

function CookieOption({
  title,
  description,
  enabled,
  onChange,
  disabled = false,
  isRTL,
  isDoNotSell = false,
}: CookieOptionProps) {
  return (
    <div
      className={`
      bg-gradient-to-br from-[#F9FAFB] to-[#F0F7F0]
      rounded-xl border-2 border-[#E5E7EB] p-4
      ${disabled ? "opacity-60" : ""}
    `}
    >
      <div
        className={`flex items-start justify-between gap-4 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <div className="flex-1">
          <h4
            className="text-[#111827] mb-1"
            style={{ fontSize: "16px", fontWeight: 600 }}
          >
            {title}
          </h4>
          <p className="text-[#6B7280] text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={onChange}
          disabled={disabled}
          className={`
            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
            border-2 border-[#111827] transition-colors duration-200 ease-in-out
            ${enabled ? "bg-[#5FB57A]" : "bg-gray-300"}
            ${disabled ? "cursor-not-allowed opacity-50" : ""}
            ${isDoNotSell && !enabled ? "bg-red-500" : ""}
          `}
          role="switch"
          aria-checked={enabled}
        >
          <span
            className={`
              pointer-events-none inline-block h-4 w-4 transform rounded-full
              bg-white shadow-lg ring-0 transition duration-200 ease-in-out
              translate-y-0.5
              ${enabled ? "translate-x-6" : "translate-x-0.5"}
            `}
          />
        </button>
      </div>
    </div>
  );
}

export default ConsentManager;
