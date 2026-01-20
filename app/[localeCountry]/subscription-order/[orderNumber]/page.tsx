"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle, Home, List, Loader2 } from "lucide-react";
import { setLocale } from "@/src/paraglide/runtime";
import { requestFetchOrderDetails } from "@/network/onlineSubscriptions";
import { OrderDetails } from "@/network/onlineSubscriptions";

export default function SubscriptionOrderPage() {
  const params = useParams();
  const router = useRouter();
  const localeCountry = params.localeCountry as string;
  const orderNumber = params.orderNumber as string;
  const locale = localeCountry?.split("-")[0] || "en";
  const isRTL = locale === "ar";
  
  setLocale(locale as "ar" | "en");

  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderNumber) {
        setError(locale === "en" ? "Order Number not found" : "رقم الطلب غير موجود");
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await requestFetchOrderDetails({ orderNumber });
        setOrderDetails(data);
      } catch (err) {
        console.error("Error fetching order details:", err);
        setError(
          locale === "en"
            ? "Failed to load order details"
            : "فشل تحميل تفاصيل الطلب"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderNumber, locale]);

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-[#E8F3E8] ${isRTL ? "rtl" : "ltr"} flex items-center justify-center p-4`}>
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#5FB57A] mx-auto mb-4" />
          <p className="text-[#6B7280] text-lg">
            {locale === "en" ? "Loading order details..." : "جاري تحميل تفاصيل الطلب..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !orderDetails) {
    return (
      <div className={`min-h-screen bg-[#E8F3E8] ${isRTL ? "rtl" : "ltr"} flex items-center justify-center p-4`}>
        <div className="container mx-auto max-w-[600px]">
          <div className="bg-white border-2 border-[#111827] rounded-2xl shadow-[8px_8px_0px_0px_rgba(17,24,39,1)] p-8 text-center">
            <h1 className="text-2xl font-bold text-[#111827] mb-4">
              {locale === "en" ? "Error" : "خطأ"}
            </h1>
            <p className="text-[#6B7280] mb-6">
              {error || (locale === "en" ? "Order not found" : "الطلب غير موجود")}
            </p>
            <Button
              onClick={() => router.push(`/${localeCountry}`)}
              className="bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl"
            >
              {locale === "en" ? "Back to Home" : "العودة للرئيسية"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { order, subscription, subscriptionType, subscriptionDuration, subscriptionPrice } = orderDetails;
  const serviceName = isRTL ? subscription.title_ar : subscription.title_en;
  const planName = isRTL 
    ? `${subscriptionType.name_ar} - ${subscriptionDuration.name_ar}`
    : `${subscriptionType.name_en} - ${subscriptionDuration.name_en}`;

  return (
    <div className={`min-h-screen bg-[#E8F3E8] ${isRTL ? "rtl" : "ltr"} flex items-center justify-center p-4`}>
      <div className="container mx-auto max-w-[700px]">
        {/* Success Card */}
        <div className="bg-white border-2 border-[#111827] rounded-2xl shadow-[8px_8px_0px_0px_rgba(17,24,39,1)] overflow-hidden">
          {/* Success Icon */}
          <div className="bg-gradient-to-br from-[#5FB57A] to-[#4FA569] p-12 text-center border-b-2 border-[#111827]">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white border-4 border-[#111827] rounded-full mb-6 shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
              <CheckCircle className="h-14 w-14 text-[#5FB57A]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {locale === "en" ? "Order Confirmed!" : "تم تأكيد الطلب!"}
            </h1>
            <p className="text-white/90 text-lg">
              {locale === "en"
                ? "Thank you for your order"
                : "شكراً لك على طلبك"}
            </p>
          </div>

          {/* Order Details */}
          <div className="p-6 md:p-8">
            {/* Order Number */}
            <div className="mb-8 p-6 bg-[#E8F3E8] border-2 border-[#111827] rounded-xl">
              <div className={`text-center ${isRTL ? 'text-right' : ''}`}>
                <p className="text-sm text-[#6B7280] mb-1">
                  {locale === "en" ? "Order Number" : "رقم الطلب"}
                </p>
                <p className="text-2xl font-bold text-[#111827] font-mono">
                  #{order.order_number}
                </p>
              </div>
            </div>

            {/* What's Next Section */}
            <div className="mb-8">
              <h2 className={`text-xl font-bold text-[#111827] mb-4 ${isRTL ? 'text-right' : ''}`}>
                {locale === "en" ? "What happens next?" : "ماذا يحدث بعد ذلك؟"}
              </h2>
              
              <div className="space-y-4">
                {/* Step 1 */}
                <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="flex-shrink-0 w-10 h-10 bg-[#5FB57A] border-2 border-[#111827] rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-semibold text-[#111827] mb-1">
                      {locale === "en" 
                        ? "We'll contact you on WhatsApp" 
                        : "سنتواصل معك عبر الواتساب"}
                    </h3>
                    <p className="text-[#6B7280] text-sm">
                      {locale === "en"
                        ? `Our team will reach out to ${order.customer_whatsapp} within 24 hours`
                        : `سيتواصل فريقنا معك على ${order.customer_whatsapp} خلال 24 ساعة`}
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="flex-shrink-0 w-10 h-10 bg-[#5FB57A] border-2 border-[#111827] rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-semibold text-[#111827] mb-1">
                      {locale === "en" 
                        ? "Subscription details & payment" 
                        : "تفاصيل الاشتراك والدفع"}
                    </h3>
                    <p className="text-[#6B7280] text-sm">
                      {locale === "en"
                        ? "We'll provide you with all subscription details and payment options"
                        : "سنزودك بجميع تفاصيل الاشتراك وخيارات الدفع"}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <div className="flex-shrink-0 w-10 h-10 bg-[#5FB57A] border-2 border-[#111827] rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-semibold text-[#111827] mb-1">
                      {locale === "en" 
                        ? "Account activation" 
                        : "تفعيل الحساب"}
                    </h3>
                    <p className="text-[#6B7280] text-sm">
                      {locale === "en"
                        ? "Once payment is confirmed, we'll activate your subscription immediately"
                        : "بمجرد تأكيد الدفع، سنقوم بتفعيل اشتراكك فوراً"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-8 p-4 bg-gradient-to-br from-[#E8F3E8] to-[#D1E7D1] border-2 border-[#111827] rounded-xl">
              <h3 className={`font-semibold text-[#111827] mb-3 ${isRTL ? 'text-right' : ''}`}>
                {locale === "en" ? "Order Summary" : "ملخص الطلب"}
              </h3>
              <div className={`space-y-2 text-sm ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[#6B7280]">
                    {locale === "en" ? "Service:" : "الخدمة:"}
                  </span>
                  <span className="font-semibold text-[#111827]">{serviceName}</span>
                </div>
                <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[#6B7280]">
                    {locale === "en" ? "Plan:" : "الخطة:"}
                  </span>
                  <span className="font-semibold text-[#111827]">{planName}</span>
                </div>
                <div className={`flex justify-between items-center pt-2 border-t-2 border-[#111827] mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="font-bold text-[#111827]">
                    {locale === "en" ? "Total Price:" : "السعر الإجمالي:"}
                  </span>
                  <span className="font-bold text-[#5FB57A] text-lg">
                    {subscriptionPrice.currency}{subscriptionPrice.price}
                  </span>
                </div>
              </div>
            </div>

            {/* WhatsApp Notice */}
            <div className="mb-8 p-4 bg-gradient-to-br from-[#25D366]/10 to-[#25D366]/5 border-2 border-[#25D366]/30 rounded-xl">
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <MessageCircle className="h-6 w-6 text-[#25D366] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-[#111827] mb-1">
                    {locale === "en" 
                      ? "Keep an eye on WhatsApp!" 
                      : "راقب الواتساب!"}
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    {locale === "en"
                      ? "Make sure WhatsApp notifications are enabled so you don't miss our message. We'll send you all the details you need to get started."
                      : "تأكد من تفعيل إشعارات الواتساب حتى لا تفوتك رسالتنا. سنرسل لك جميع التفاصيل التي تحتاجها للبدء."}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <Button
                onClick={() => router.push(`/${localeCountry}`)}
                className={`flex-1 bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
                style={{ fontWeight: 600 }}
              >
                <Home className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {locale === "en" ? "Back to Home" : "العودة للرئيسية"}
              </Button>
              <Button
                onClick={() => router.push(`/${localeCountry}/subscriptions`)}
                variant="outline"
                className={`flex-1 border-2 border-[#111827] rounded-xl hover:bg-[#E8F3E8] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all ${
                  isRTL ? 'flex-row-reverse' : ''
                }`}
                style={{ fontWeight: 600 }}
              >
                <List className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {locale === "en" ? "Browse Subscriptions" : "تصفح الاشتراكات"}
              </Button>
            </div>
          </div>
        </div>

        {/* Support Link */}
        <div className={`mt-6 text-center ${isRTL ? 'text-right' : ''}`}>
          <p className="text-sm text-[#6B7280]">
            {locale === "en"
              ? "Questions about your order? Email us at "
              : "أسئلة حول طلبك؟ راسلنا على "}
            <a 
              href="mailto:support@tuut.com" 
              className="text-[#5FB57A] hover:underline font-semibold"
            >
              support@tuut.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
