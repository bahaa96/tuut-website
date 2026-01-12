"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getConsent,
  saveConsent,
  acceptAll,
  rejectAll,
  clearConsent,
  ConsentPreferences,
  detectPrivacyRegion,
  US_PRIVACY_STATES,
} from "@/lib/consent/storage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Cookie, Shield, Info, Trash2, CheckCircle } from "lucide-react";

export function PrivacySettingsClient() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<ConsentPreferences | null>(null);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [region, setRegion] = useState(detectPrivacyRegion());

  useEffect(() => {
    const consent = getConsent();
    if (consent) {
      setPreferences(consent);
    } else {
      // Show default preferences if no consent stored
      setPreferences({
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false,
        timestamp: Date.now(),
        version: "1.0",
      });
    }

    setRegion(detectPrivacyRegion());
  }, []);

  const togglePreference = (key: keyof ConsentPreferences) => {
    if (key === "necessary" || !preferences) return; // Cannot disable necessary cookies
    if (key === "timestamp" || key === "version") return; // Cannot toggle these

    setPreferences((prev) =>
      prev ? { ...prev, [key]: !prev[key] } : null
    );
  };

  const handleSave = () => {
    if (preferences) {
      saveConsent(preferences);
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 3000);
    }
  };

  const handleAcceptAll = () => {
    acceptAll();
    setPreferences(getConsent());
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  const handleRejectAll = () => {
    rejectAll();
    setPreferences(getConsent());
    setShowSaveNotification(true);
    setTimeout(() => setShowSaveNotification(false), 3000);
  };

  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear all your privacy preferences? You will see the consent banner again on your next visit.")) {
      clearConsent();
      router.push("/");
    }
  };

  if (!preferences) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading privacy settings...</p>
        </div>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Privacy Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your privacy preferences and control how we use your data
          </p>
        </div>

        {/* Save Notification */}
        {showSaveNotification && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
            <Card className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 p-4">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">Preferences saved successfully!</span>
              </div>
            </Card>
          </div>
        )}

        {/* Region Info */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">
                {region.type === "gdpr" && "GDPR Compliance (EU/EEA)"}
                {region.type === "ccpa" && "US State Privacy Regulations"}
                {region.type === "other" && "General Privacy Settings"}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                {region.type === "gdpr" &&
                  "As an EU/EEA resident, you have the right to control how your personal data is processed."}
                {region.type === "ccpa" &&
                  `As a resident of a US state with privacy laws (${US_PRIVACY_STATES.slice(0, 3).join(", ")}, and others), you have the right to opt out of data sharing and sales.`}
                {region.type === "other" &&
                  "We respect your privacy regardless of your location. Manage your preferences below."}
              </p>
            </div>
          </div>
        </Card>

        {/* Current Preferences Info */}
        {preferences.timestamp > 0 && (
          <Card className="p-4 bg-gray-50 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Last updated:</strong> {formatDate(preferences.timestamp)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Privacy policy version: {preferences.version}
            </p>
          </Card>
        )}

        {/* Cookie Categories */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Cookie className="w-5 h-5" />
            Cookie & Data Processing Categories
          </h2>

          {/* Necessary */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    Necessary Cookies
                  </h3>
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                    Always Active
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  These cookies are essential for the website to function properly. They
                  enable basic functions like page navigation, access to secure areas,
                  and remember your consent preferences.
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                  <p>
                    <strong>Purpose:</strong> Site functionality, security, consent storage
                  </p>
                  <p>
                    <strong>Storage:</strong> Session & Local Storage
                  </p>
                  <p>
                    <strong>Duration:</strong> Session to 1 year
                  </p>
                </div>
              </div>
              <Switch checked={true} disabled className="mt-1" />
            </div>
          </Card>

          {/* Analytics */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  These cookies help us understand how visitors interact with our website
                  by collecting and reporting information anonymously. This helps us
                  improve our service and user experience.
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                  <p>
                    <strong>Services:</strong> Google Analytics (GA4)
                  </p>
                  <p>
                    <strong>Data Collected:</strong> Page views, session duration, device
                    info, approximate location
                  </p>
                  <p>
                    <strong>Duration:</strong> Up to 2 years
                  </p>
                  <p>
                    <strong>Third Party:</strong> Google LLC
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={() => togglePreference("analytics")}
                className="mt-1"
              />
            </div>
          </Card>

          {/* Marketing */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  Marketing Cookies
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  These cookies are used to track visitors across websites to display
                  relevant advertisements and measure the effectiveness of marketing
                  campaigns. They may be set by third-party advertising partners.
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                  <p>
                    <strong>Services:</strong> Facebook Pixel, TikTok Pixel
                  </p>
                  <p>
                    <strong>Data Collected:</strong> Browsing behavior, ad interactions,
                    conversions
                  </p>
                  <p>
                    <strong>Duration:</strong> Up to 2 years
                  </p>
                  <p>
                    <strong>Third Parties:</strong> Meta Platforms, TikTok Inc.
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.marketing}
                onCheckedChange={() => togglePreference("marketing")}
                className="mt-1"
              />
            </div>
          </Card>

          {/* Preferences */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  Preference Cookies
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  These cookies allow the website to remember choices you make (such as
                  your language, region, or theme) to provide a more personalized
                  experience.
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                  <p>
                    <strong>Purpose:</strong> Language selection, region preferences,
                    theme settings
                  </p>
                  <p>
                    <strong>Storage:</strong> Local Storage
                  </p>
                  <p>
                    <strong>Duration:</strong> Up to 1 year
                  </p>
                </div>
              </div>
              <Switch
                checked={preferences.preferences}
                onCheckedChange={() => togglePreference("preferences")}
                className="mt-1"
              />
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-6">
          <Button
            onClick={handleSave}
            className="flex-1 min-w-[140px] bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Preferences
          </Button>
          <Button
            onClick={handleAcceptAll}
            variant="outline"
            className="flex-1 min-w-[140px]"
          >
            Accept All
          </Button>
          <Button
            onClick={handleRejectAll}
            variant="outline"
            className="flex-1 min-w-[140px]"
          >
            Reject All
          </Button>
        </div>

        {/* Reset Section */}
        <Card className="p-6 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Reset All Preferences
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Clear all stored privacy preferences. You will be asked to set your
                preferences again on your next visit.
              </p>
              <Button
                onClick={handleClearAll}
                variant="destructive"
                size="sm"
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </Button>
            </div>
          </div>
        </Card>

        {/* Additional Information */}
        <Card className="p-6 bg-gray-50 dark:bg-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Your Privacy Rights
          </h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>Under applicable privacy laws, you may have the following rights:</p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Right to access your personal data</li>
              <li>Right to rectify inaccurate personal data</li>
              <li>Right to erase your personal data (right to be forgotten)</li>
              <li>Right to restrict processing of your personal data</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent at any time</li>
            </ul>
            <p className="pt-2">
              To exercise these rights or for questions about our privacy practices,
              please contact us at{" "}
              <a
                href="mailto:privacy@tuut.com"
                className="text-blue-600 hover:underline"
              >
                privacy@tuut.com
              </a>
            </p>
          </div>
        </Card>

        {/* Links */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
          <a href="/privacy" className="hover:text-blue-600 hover:underline">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="/terms" className="hover:text-blue-600 hover:underline">
            Terms of Service
          </a>
          <span>•</span>
          <a href="/" className="hover:text-blue-600 hover:underline">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
