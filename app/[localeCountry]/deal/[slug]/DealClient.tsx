"use client";

import { useState } from "react";
import { Footer } from "@/components/FooterSSR"
import Link from "next/link"
import { ArrowLeft, Check, Copy, Share2, Heart } from "lucide-react"
import { toast } from "sonner"

interface DealClientPageProps {
  deal: any;
  isRTL: boolean;
  footerData: {
    featuredDeals: any[];
    topStores: any[];
    articles: any[];
    categories: any[];
    bestSellingProducts: any[];
  };
}

export default function DealClientPage({ deal, isRTL, footerData }: DealClientPageProps) {
  const [isSaved, setIsSaved] = useState(false);

  // Get localized content
  const dealTitle = isRTL && deal.title_ar ? deal.title_ar : deal.title_en;
  const dealDescription = isRTL && deal.description_ar ? deal.description_ar : deal.description_en;

  // Interactive functions
  const copyCode = async () => {
    if (deal?.code) {
      try {
        await navigator.clipboard.writeText(deal.code);
        toast.success(isRTL ? "تم نسخ كود الخصم" : "Coupon code copied!");
      } catch (error) {
        toast.error(isRTL ? "فشل نسخ الكود" : "Failed to copy code");
      }
    }
  };

  const shareDeal = async () => {
    if (navigator.share && deal?.code) {
      try {
        await navigator.share({
          title: isRTL ? "مشاركة العرض" : "Share Deal",
          text: `Check out this deal with code: ${deal.code}`,
        });
      } catch (error) {
        await copyCode();
      }
    } else if (deal?.code) {
      await copyCode();
    }
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
    toast.success(
      isSaved
        ? (isRTL ? "تمت إزالة العرض من المحفوظات" : "Deal removed from saved")
        : (isRTL ? "تم حفظ العرض" : "Deal saved successfully")
    );
  };

  return (
    <>
      <main>
        <div className="container mx-auto max-w-6xl px-4 py-8">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link href="/deals" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors">
              <ArrowLeft className={`h-5 w-5 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
              {isRTL ? 'العودة إلى العروض' : 'Back to Deals'}
            </Link>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Deal Information */}
              <div className="p-8">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {dealTitle}
                  </h1>

                  {deal.discount_percentage && (
                    <div className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                      {isRTL ? 'خصم' : 'Save'} {deal.discount_percentage}%
                    </div>
                  )}

                  {deal.discount_amount && (
                    <div className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                      {isRTL ? 'خصم' : 'Save'} ${deal.discount_amount}
                    </div>
                  )}
                </div>

                {dealDescription && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      {isRTL ? 'الوصف' : 'Description'}
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      {dealDescription}
                    </p>
                  </div>
                )}

                {/* Deal Code */}
                {deal.code && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      {isRTL ? 'رمز الخصم' : 'Discount Code'}
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 font-mono text-lg">
                        {deal.code}
                      </div>
                      <button
                        onClick={copyCode}
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Valid Until */}
                {deal.expiry_date && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {isRTL ? 'صالحح حتى' : 'Valid Until'}
                    </h3>
                    <p className="text-gray-600">
                      {new Date(deal.expiry_date).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Store Info */}
                {deal.store_name && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {isRTL ? 'المتجر' : 'Store'}
                    </h3>
                    <p className="text-gray-600">
                      {deal.store_name}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={copyCode}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    {isRTL ? 'احصل على العرض' : 'Get Deal'}
                  </button>
                  <button
                    onClick={toggleSave}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Heart className={`h-5 w-5 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: deal.title,
                          text: `Check out this deal: ${dealTitle}`,
                        });
                      }
                    }}
                    className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Deal Visual */}
              <div className="p-8 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                    <span className="text-4xl">🎁</span>
                  </div>
                  <p className="text-gray-600">
                    {isRTL ? 'عرض مميز' : 'Featured Deal'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {isRTL ? 'انقر فوق للحصول على العرض' : 'Click to get the deal'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {isRTL ? 'معلومات إضافية' : 'Additional Information'}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  <Check className="inline-block h-5 w-5 text-green-600 mr-2" />
                  {isRTL ? 'ضمان أصلي' : 'Authentic Deal'}
                </h3>
                <p className="text-gray-600">
                  {isRTL ? 'هذا عرض أصلي وموثق من المصدر الأصلي' : 'This is an authentic deal verified from the original source'}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  <Check className="inline-block h-5 w-5 text-green-600 mr-2" />
                  {isRTL ? 'متوفر الآن' : 'Available Now'}
                </h3>
                <p className="text-gray-600">
                  {isRTL ? 'هذا العرض متاح حالياً ويمكنك استخدامه على الفور' : 'This deal is available now and can be used immediately'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer
        featuredDeals={footerData.featuredDeals}
        topStores={footerData.topStores}
        articles={footerData.articles}
        categories={footerData.categories}
        bestSellingProducts={footerData.bestSellingProducts}
        translations={{
          footer: {
            about: isRTL ? 'من نحن' : 'About',
            careers: isRTL ? 'وظائف' : 'Careers',
            help: isRTL ? 'مساعدة' : 'Help',
            faq: isRTL ? 'الأسئلة الشائعة' : 'FAQ',
            contact: isRTL ? 'اتصل بنا' : 'Contact',
            company: isRTL ? 'الشركة' : 'Company',
            featuredDeals: isRTL ? 'العروض المميزة' : 'Featured Deals',
            shoppingGuides: isRTL ? 'أدلة التسوق' : 'Shopping Guides',
            topStores: isRTL ? 'أفضل المتاجر' : 'Top Stores',
            viewAll: isRTL ? 'عرض الكل' : 'View All',
            tagline: isRTL ? 'اكتشف أفضل العروض والخصومات في متجرك المفضل' : 'Discover the best deals and discounts at your favorite stores',
            copyright: isRTL ? 'جميع الحقوق محفوظة 2024 Tuut' : '© 2024 Tuut. All rights reserved.',
            followUs: isRTL ? 'تابعنا' : 'Follow Us'
          },
          testimonials: {
            downloadApp: isRTL ? 'قم بتنزيل تطبيقنا' : 'Download Our App',
            downloadOn: isRTL ? 'تحميل من' : 'Download on',
            appStore: isRTL ? 'App Store' : 'App Store',
            getItOn: isRTL ? 'الحصول عليه من' : 'Get it on',
            googlePlay: isRTL ? 'Google Play' : 'Google Play'
          }
        }}
        isRTL={isRTL}
      />
    </>
  );
}