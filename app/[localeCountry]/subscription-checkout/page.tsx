"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { setLocale } from "@/src/paraglide/runtime";
import { requestFetchSingleOnlineSubscription, requestFetchSingleOnlineSubscriptionById, requestFetchSingleOnlineSubscriptionDuration, requestFetchSingleOnlineSubscriptionPrice, requestFetchSingleOnlineSubscriptionType, requestCreateSubscriptionOrder } from "@/network/onlineSubscriptions";
import { OnlineSubscriptionTypeDuration } from "@/domain-models/OnlineSubscriptionTypeDuration";
import { OnlineSubscriptionType } from "@/domain-models/OnlineSubscriptionType";
import { OnlineSubscriptionPrice } from "@/domain-models/OnlineSubscriptionPrice";
import { OnlineSubscription } from "@/domain-models/OnlineSubscription";

export default function SubscriptionCheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const localeCountry = params.localeCountry as string;
  const countrySlug = localeCountry?.split("-")[1];
  const locale = localeCountry?.split("-")[0] || "en";
  const isRTL = locale === "ar";
  
  setLocale(locale as "ar" | "en");

  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [subscriptionDuration, setSubscriptionDuration] = useState<OnlineSubscriptionTypeDuration | null>(null);
  const [subscriptionType, setSubscriptionType] = useState<OnlineSubscriptionType | null>(null);
  const [subscriptionPrice, setSubscriptionPrice] = useState<OnlineSubscriptionPrice | null>(null);
  const [subscription, setSubscription] = useState<OnlineSubscription | null>(null);
  const subscriptionDurationId = searchParams.get("subscriptionDurationId") || "";

  useEffect(() => {
    try {
      const fetchSubscriptionDuration = async () => {
        const { data: durationData } = await requestFetchSingleOnlineSubscriptionDuration({
          subscriptionDurationId: subscriptionDurationId,
        });
        setSubscriptionDuration(durationData);
      }
      fetchSubscriptionDuration();
    } catch (error) {
      console.error(`Error fetching subscription duration ${subscriptionDurationId}:`, error);
    }
  }, [subscriptionDurationId]);

  useEffect(() => {
    try {
      const fetchSubscriptionPrice = async () => {
        const { data: priceData } = await requestFetchSingleOnlineSubscriptionPrice({
          durationId: subscriptionDuration?.id || "",
          countrySlug: countrySlug || "",
        });
        setSubscriptionPrice(priceData);
      }
      fetchSubscriptionPrice();
    } catch (error) {
      console.error(`Error fetching subscription price ${subscriptionDuration?.id}:`, error);
    }
  }, [subscriptionDuration?.id])

  useEffect(() => {
    try {
      const fetchSubscriptionType = async () => {
        const { data: typeData } = await requestFetchSingleOnlineSubscriptionType({
          subscriptionTypeId: subscriptionDuration?.type_id || "",
        });
        setSubscriptionType(typeData);
      }
      fetchSubscriptionType();
    } catch (error) {
      console.error(`Error fetching subscription type ${subscriptionDuration?.type_id}:`, error);
    }
  }, [subscriptionDuration?.type_id]);

  useEffect(() => {
    try {
      const fetchSubscription = async () => {
        const { data: subscriptionData } = await requestFetchSingleOnlineSubscriptionById({
          subscriptionId: subscriptionType?.subscription_id || "",
        });
        setSubscription(subscriptionData);
      }
      fetchSubscription();
    } catch (error) {
      console.error(`Error fetching subscription ${subscriptionType?.subscription_id}:`, error);
    }
  }, [subscriptionType?.id]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate WhatsApp number
    if (!whatsappNumber.trim()) {
      toast.error(
        locale === "en"
          ? "Please enter your WhatsApp number"
          : "الرجاء إدخال رقم الواتساب الخاص بك"
      );
      return;
    }

    // Basic phone number validation
    const digitsOnly = whatsappNumber.replace(/\D/g, "");
    if (digitsOnly.length < 8) {
      toast.error(
        locale === "en"
          ? "Please enter a valid WhatsApp number"
          : "الرجاء إدخال رقم واتساب صحيح"
      );
      return;
    }

    // Validate that all required data is present
    if (!subscription?.id || !subscriptionType?.id || !subscriptionDuration?.id || !subscriptionPrice) {
      toast.error(
        locale === "en"
          ? "Missing subscription information. Please try again."
          : "معلومات الاشتراك مفقودة. الرجاء المحاولة مرة أخرى."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the order in the database
      const { data: order } = await requestCreateSubscriptionOrder({
        subscription_id: subscription.id,
        subscription_type_id: subscriptionType.id,
        subscription_duration_id: subscriptionDuration.id,
        customer_whatsapp: whatsappNumber,
        price: subscriptionPrice.price,
        currency: subscriptionPrice.currency,
        country_slug: countrySlug || "",
        notes: `Customer requested via website. Locale: ${locale}, Country: ${countrySlug}`,
      });

      // Show success message
      toast.success(
        locale === "en"
          ? "Order created successfully!"
          : "تم إنشاء الطلب بنجاح!"
      );

      // Redirect to order page with order ID in URL
      router.push(`/${localeCountry}/subscription-order/${order.order_number}`);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error(
        locale === "en"
          ? "Failed to create order. Please try again."
          : "فشل إنشاء الطلب. الرجاء المحاولة مرة أخرى."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9+\-() ]/g, "");
    setWhatsappNumber(value);
  };


  return (
    <div className={`min-h-screen bg-[#E8F3E8] ${isRTL ? "rtl" : "ltr"}`}>
      <div className="container mx-auto max-w-[600px] px-4 py-8 md:py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className={`mb-6 border-2 border-[#111827] rounded-xl hover:bg-white ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
          {locale === "en" ? "Back" : "رجوع"}
        </Button>

        {/* Checkout Card */}
        <div className="bg-white border-2 border-[#111827] rounded-2xl shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#5FB57A] to-[#4FA569] p-6 md:p-8 border-b-2 border-[#111827]">
            <h1 className={`text-2xl md:text-3xl font-bold text-white mb-2 ${isRTL ? 'text-right' : ''}`}>
              {locale === "en" ? "Complete Your Order" : "أكمل طلبك"}
            </h1>
            <p className={`text-white/90 ${isRTL ? 'text-right' : ''}`}>
              {locale === "en"
                ? "We'll contact you via WhatsApp to finalize your subscription"
                : "سنتواصل معك عبر الواتساب لإتمام اشتراكك"}
            </p>
          </div>

          {/* Order Summary */}
            <div className="p-6 md:p-8 bg-[#E8F3E8] border-b-2 border-[#111827]">
              <h2 className={`text-lg font-bold text-[#111827] mb-4 ${isRTL ? 'text-right' : ''}`}>
                {locale === "en" ? "Order Summary" : "ملخص الطلب"}
              </h2>
              <div className={`space-y-2 ${isRTL ? 'text-right' : ''}`}>
                {subscription?.title_en || subscription?.title_ar ? (
                  <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[#6B7280]">
                      {locale === "en" ? "Service:" : "الخدمة:"}
                    </span>
                    <span className="font-semibold text-[#111827]">{isRTL ? `${subscription?.title_ar}` : `${subscription?.title_en}`}</span>
                  </div>
                ) : null}
                {isRTL ? subscriptionType?.name_ar : subscriptionType?.name_en && (
                  <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[#6B7280]">
                      {locale === "en" ? "Plan:" : "الخطة:"}
                    </span>
                    <span className="font-semibold text-[#111827]">{isRTL ? `${subscriptionType?.name_ar}` : `${subscriptionType?.name_en}`}</span>
                  </div>
                )}
                {subscriptionPrice?.price && (
                  <div className={`flex justify-between items-center pt-2 border-t-2 border-[#111827] mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="font-bold text-[#111827]">
                      {locale === "en" ? "Price:" : "السعر:"}
                    </span>
                    <span className="font-bold text-[#5FB57A] text-xl">{subscriptionPrice?.currency || "$"}{subscriptionPrice?.price}</span>
                  </div>
                )}
              </div>
            </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            <div className="mb-6">
              <label 
                htmlFor="whatsapp" 
                className={`block text-[#111827] font-semibold mb-2 ${isRTL ? 'text-right' : ''}`}
              >
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                  <Phone className="h-5 w-5 text-[#5FB57A]" />
                  <span>
                    {locale === "en" 
                      ? "WhatsApp Number" 
                      : "رقم الواتساب"}
                  </span>
                </div>
              </label>
              <input
                id="whatsapp"
                type="tel"
                value={whatsappNumber}
                onChange={handlePhoneChange}
                placeholder={
                  locale === "en"
                    ? "+966 234 567 8900"
                    : "٠٠٩٦٦ ٥٠٠ ١٢٣ ٤٥٦"
                }
                className={`w-full px-4 py-3 border-2 border-[#111827] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5FB57A] focus:border-[#5FB57A] transition-all ${
                  isRTL ? 'text-right' : ''
                }`}
                disabled={isSubmitting}
                autoFocus
              />
              <p className={`text-sm text-[#6B7280] mt-2 ${isRTL ? 'text-right' : ''}`}>
                {locale === "en"
                  ? "Include your country code (e.g., +2, +966, +971)"
                  : "أدخل رقمك مع رمز الدولة (مثال: ٠٠٩٦٦+، ٠٠٩٧١+)"}
              </p>
            </div>

            {/* Privacy Note */}
            <div className="mb-6 p-4 bg-[#E8F3E8] border-2 border-[#5FB57A]/30 rounded-xl">
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <CheckCircle className="h-5 w-5 text-[#5FB57A] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#6B7280]">
                  {locale === "en"
                    ? "Your WhatsApp number will only be used to contact you about this subscription. We respect your privacy and won't share your information with third parties."
                    : "سيتم استخدام رقم الواتساب الخاص بك فقط للتواصل معك بشأن هذا الاشتراك. نحن نحترم خصوصيتك ولن نشارك معلوماتك مع أطراف ثالثة."}
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all py-6 text-lg ${
                isRTL ? 'flex-row-reverse' : ''
              }`}
              style={{ fontWeight: 600 }}
            >
              {isSubmitting
                ? locale === "en"
                  ? "Processing..."
                  : "جاري المعالجة..."
                : locale === "en"
                ? "Order Now"
                : "اطلب الآن"}
            </Button>
          </form>
        </div>

        {/* Help Text */}
        <div className={`mt-6 text-center ${isRTL ? 'text-right' : ''}`}>
          <p className="text-sm text-[#6B7280]">
            {locale === "en"
              ? "Need help? Contact us at support@tuut.com"
              : "تحتاج مساعدة؟ تواصل معنا على support@tuut.com"}
          </p>
        </div>
      </div>
    </div>
  );
}
