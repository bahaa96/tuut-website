"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { getCountryValue } from "@/utils/countryHelpers";
import { useCountry } from "@/contexts/CountryContext";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ExternalLink,
  TrendingUp,
  Clock,
  Users,
  ArrowLeft,
  Crown,
  ChevronDown,
  Share2,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { setLocale } from "@/src/paraglide/runtime";
import Link from "next/link";

interface SubscriptionType {
  id: number;
  subscription_id: number;
  type_name?: string;
  type_name_ar?: string;
  max_users?: number;
  is_recommended?: boolean;
  display_order?: number;
}

interface TypeDuration {
  id: number;
  subscription_type_id: number;
  duration_months?: number;
  duration_label?: string;
  duration_label_ar?: string;
  is_popular?: boolean;
}

interface Pricing {
  id: number;
  duration_id: number;
  country_slug?: string;
  original_price?: number;
  discounted_price?: number;
  currency?: string;
  savings_percentage?: number;
}

interface PlanDisplay {
  typeId: number;
  typeName: string;
  typeNameAr: string;
  maxUsers?: number;
  isRecommended?: boolean;
  durationId: number;
  durationMonths: number;
  durationLabel?: string;
  durationLabelAr?: string;
  isPopular?: boolean;
  originalPrice?: number;
  discountedPrice?: number;
  currency?: string;
  savingsPercentage?: number;
}

interface Subscription {
  id: number;
  title_en?: string;
  title_ar?: string;
  description_en?: string;
  description_ar?: string;
  logo_url?: string;
  service_url?: string;
  category?: string;
  category_ar?: string;
  popular?: boolean;
}

interface FAQ {
  id: number;
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
}

export default function SubscriptionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { country } = useCountry();
  const localeCountry = params.localeCountry as string;
  const subscriptionId = params.id as string;
  const locale = localeCountry?.split("-")[0] || "en";
  const isRTL = locale === "ar";
  
  setLocale(locale as "ar" | "en");

  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<PlanDisplay[]>([]);
  const [otherSubscriptions, setOtherSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState<number | "all">("all");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const supabase = createClient();

  // Mock FAQs
  const mockFaqs: FAQ[] = [
    {
      id: 1,
      question_en: "How do I activate my subscription?",
      question_ar: "كيف أقوم بتفعيل اشتراكي؟",
      answer_en: "After purchasing, you'll receive activation instructions via email within 24 hours. Simply follow the steps provided to activate your subscription.",
      answer_ar: "بعد الشراء، ستتلقى تعليمات التفعيل عبر البريد الإلكتروني خلال 24 ساعة. ما عليك سوى اتباع الخطوات المقدمة لتفعيل اشتراكك.",
    },
    {
      id: 2,
      question_en: "Can I upgrade or downgrade my plan?",
      question_ar: "هل يمكنني ترقية أو تخفيض خطتي؟",
      answer_en: "Yes, you can upgrade or downgrade your plan at any time. The price difference will be prorated based on the remaining subscription period.",
      answer_ar: "نعم، يمكنك ترقية أو تخفيض خطتك في أي وقت. سيتم احتساب فرق السعر بناءً على الفترة المتبقية من الاشتراك.",
    },
    {
      id: 3,
      question_en: "What payment methods do you accept?",
      question_ar: "ما هي طرق الدفع المقبولة؟",
      answer_en: "We accept all major credit cards, PayPal, and local payment methods depending on your country.",
      answer_ar: "نقبل جميع بطاقات الائتمان الرئيسية وPayPal وطرق الدفع المحلية حسب بلدك.",
    },
    {
      id: 4,
      question_en: "Is there a refund policy?",
      question_ar: "هل هناك سياسة استرداد؟",
      answer_en: "Yes, we offer a 14-day money-back guarantee if you're not satisfied with the service. Contact our support team to process your refund.",
      answer_ar: "نعم، نقدم ضمان استرداد الأموال لمدة 14 يومًا إذا لم تكن راضيًا عن الخدمة. اتصل بفريق الدعم لمعالجة استردادك.",
    },
    {
      id: 5,
      question_en: "Can I share my subscription with others?",
      question_ar: "هل يمكنني مشاركة اشتراكي مع الآخرين؟",
      answer_en: "It depends on the plan. Team and Enterprise plans allow multiple users, while Personal plans are for individual use only. Check your plan details for specific user limits.",
      answer_ar: "يعتمد ذلك على الخطة. تسمح خطط الفريق والمؤسسات بعدة مستخدمين، بينما الخطط الشخصية للاستخدام الفردي فقط. تحقق من تفاصيل خطتك لمعرفة حدود المستخدمين.",
    },
  ];

  useEffect(() => {
    if (subscriptionId && country) {
      fetchSubscriptionDetails();
    }
  }, [subscriptionId, country]);

  const fetchSubscriptionDetails = async () => {
    try {
      setLoading(true);

      // Fetch subscription details
      const { data: subData, error: subError } = await supabase
        .from("online_subscriptions")
        .select("*")
        .eq("id", subscriptionId)
        .single();

      if (subError) {
        console.error("Error fetching subscription:", subError);
        setLoading(false);
        return;
      }
      
      setSubscription(subData);

      // Fetch other subscriptions
      const { data: otherSubs } = await supabase
        .from("online_subscriptions")
        .select("*")
        .neq("id", subscriptionId)
        .limit(3);

      setOtherSubscriptions(otherSubs || []);

      // Fetch subscription types
      const { data: typesData, error: typesError } = await supabase
        .from("subscription_types")
        .select("*")
        .eq("subscription_id", subscriptionId)
        .order("display_order", { ascending: true });

      if (typesError || !typesData || typesData.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch durations for all types
      const typeIds = typesData.map(t => t.id);
      const { data: durationsData, error: durationsError } = await supabase
        .from("subscription_type_durations")
        .select("*")
        .in("subscription_type_id", typeIds)
        .order("duration_months", { ascending: true });

      if (durationsError || !durationsData || durationsData.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch pricing for all durations filtered by country
      const durationIds = durationsData.map(d => d.id);
      const countrySlug = getCountryValue(country);
      
      const { data: pricingData, error: pricingError } = await supabase
        .from("subscription_pricing")
        .select("*")
        .in("duration_id", durationIds)
        .eq("country_slug", countrySlug);

      if (pricingError) {
        setLoading(false);
        return;
      }

      // Combine all data into PlanDisplay objects
      const combinedPlans: PlanDisplay[] = [];

      typesData.forEach((type: SubscriptionType) => {
        const typeDurations = durationsData.filter((d: TypeDuration) => d.subscription_type_id === type.id);
        
        typeDurations.forEach((duration: TypeDuration) => {
          const pricing = pricingData?.find((p: Pricing) => p.duration_id === duration.id);
          
          if (pricing) {
            combinedPlans.push({
              typeId: type.id,
              typeName: type.type_name || "",
              typeNameAr: type.type_name_ar || "",
              maxUsers: type.max_users,
              isRecommended: type.is_recommended,
              durationId: duration.id,
              durationMonths: duration.duration_months || 0,
              durationLabel: duration.duration_label,
              durationLabelAr: duration.duration_label_ar,
              isPopular: duration.is_popular,
              originalPrice: pricing.original_price,
              discountedPrice: pricing.discounted_price,
              currency: pricing.currency,
              savingsPercentage: pricing.savings_percentage,
            });
          }
        });
      });

      setPlans(combinedPlans);
    } catch (error) {
      console.error("Error fetching subscription details:", error);
      toast.error(
        locale === "en"
          ? "Failed to load subscription details"
          : "فشل تحميل تفاصيل الاشتراك"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetPlan = (plan: PlanDisplay) => {
    const planName = locale === "ar" ? plan.typeNameAr : plan.typeName;
    const durationLabel = locale === "ar" ? plan.durationLabelAr : plan.durationLabel;
    const fullPlanName = `${planName} - ${durationLabel || `${plan.durationMonths} ${locale === "en" ? "Months" : "شهر"}`}`;
    const planPrice = `${plan.currency || "$"}${plan.discountedPrice}`;
    
    router.push(
      `/${localeCountry}/subscription-checkout?plan=${encodeURIComponent(fullPlanName)}&price=${encodeURIComponent(planPrice)}&service=${encodeURIComponent(title || "")}`
    );
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: title || "",
        text: description || "",
        url: url,
      }).catch(() => {
        navigator.clipboard.writeText(url);
        toast.success(
          locale === "en" 
            ? "Link copied to clipboard!" 
            : "تم نسخ الرابط!"
        );
      });
    } else {
      navigator.clipboard.writeText(url);
      toast.success(
        locale === "en" 
          ? "Link copied to clipboard!" 
          : "تم نسخ الرابط!"
      );
    }
  };

  // Get unique durations
  const durations = Array.from(new Set(plans.map((p) => p.durationMonths).filter(Boolean)));

  // Filter plans by duration
  const filteredPlans = selectedDuration === "all" 
    ? plans 
    : plans.filter(p => p.durationMonths === selectedDuration);

  const title = locale === "ar" ? subscription?.title_ar : subscription?.title_en;
  const description = locale === "ar" ? subscription?.description_ar : subscription?.description_en;
  const category = locale === "ar" ? subscription?.category_ar : subscription?.category;

  if (loading) {
    return (
      <div className={`min-h-screen bg-[#E8F3E8] ${isRTL ? "rtl" : "ltr"}`}>
        <div className="container mx-auto max-w-[1200px] px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="bg-white border-2 border-[#111827] rounded-xl p-8">
            <div className="flex items-start gap-6 mb-8">
              <Skeleton className="h-24 w-24 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-8 w-64 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className={`min-h-screen bg-[#E8F3E8] flex items-center justify-center ${isRTL ? "rtl" : "ltr"}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#111827] mb-4">
            {locale === "en" ? "Subscription not found" : "الاشتراك غير موجود"}
          </h2>
          <Button onClick={() => router.push(`/${localeCountry}/subscriptions`)}>
            {locale === "en" ? "Back to Subscriptions" : "العودة للاشتراكات"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#E8F3E8] ${isRTL ? "rtl" : "ltr"}`}>
      {/* Subscription Header */}
      <section className="relative bg-gradient-to-br from-white via-[#E8F3E8] to-white border-b-2 border-[#111827] overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#5FB57A] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5FB57A] opacity-5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto max-w-[1200px] px-4 py-6 relative z-10">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push(`/${localeCountry}/subscriptions`)}
              className={`border-2 border-[#111827] rounded-xl hover:bg-white ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'ml-2 rotate-180' : 'mr-2'}`} />
              {locale === "en" ? "Back to Subscriptions" : "العودة للاشتراكات"}
            </Button>
          </div>

          <div className={`flex flex-col md:flex-row items-center md:items-start gap-8 pb-10 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
            {/* Logo */}
            <div className="flex-shrink-0">
              {subscription.logo_url ? (
                <div className="relative">
                  <div className="absolute inset-0 bg-[#5FB57A] opacity-20 rounded-2xl blur-xl"></div>
                  <ImageWithFallback
                    src={subscription.logo_url}
                    alt={title || ""}
                    className="relative w-32 h-32 md:w-40 md:h-40 object-contain rounded-2xl border-4 border-[#111827] bg-white p-6 shadow-[6px_6px_0px_0px_rgba(17,24,39,1)]"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-[#E8F3E8] to-white rounded-2xl border-4 border-[#111827] flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(17,24,39,1)]">
                  <Sparkles className="h-16 w-16 md:h-20 md:w-20 text-[#5FB57A]" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className={`flex flex-col items-center md:items-start gap-4 mb-4 ${isRTL ? 'md:items-end' : ''}`}>
                <div className={`flex items-center gap-3 flex-wrap justify-center md:justify-start ${isRTL ? 'md:justify-end md:flex-row-reverse' : ''}`}>
                  <h1 className={`text-4xl md:text-5xl font-bold text-[#111827] ${isRTL ? 'text-center md:text-right' : 'text-center md:text-left'}`}>
                    {title}
                  </h1>
                  {subscription.popular && (
                    <Badge className="bg-[#5FB57A] text-white border-2 border-[#111827] hover:bg-[#4FA569] px-4 py-2 text-base shadow-[3px_3px_0px_0px_rgba(17,24,39,1)]">
                      <TrendingUp className="h-5 w-5 mr-1" />
                      {locale === "en" ? "Popular" : "رائج"}
                    </Badge>
                  )}
                </div>

                {category && (
                  <Badge variant="outline" className="border-2 border-[#111827] text-[#111827] text-base px-4 py-1 bg-white">
                    {category}
                  </Badge>
                )}
              </div>

              {/* Share Button */}
              <div className={`mt-6 flex gap-3 justify-center md:justify-start ${isRTL ? 'md:justify-end md:flex-row-reverse' : ''}`}>
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className={`border-2 border-[#111827] rounded-xl hover:bg-[#E8F3E8] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Share2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  {locale === "en" ? "Share" : "مشاركة"}
                </Button>
                {subscription.service_url && (
                  <Button
                    onClick={() => window.open(subscription.service_url, "_blank")}
                    className={`bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
                    style={{ fontWeight: 600 }}
                  >
                    {locale === "en" ? "Visit Website" : "زيارة الموقع"}
                    <ExternalLink className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto max-w-[1200px] px-4">
          <h2 className={`text-2xl md:text-3xl font-bold text-[#111827] mb-6 ${isRTL ? 'text-right' : ''}`}>
            {locale === "en" ? "Choose Your Plan" : "اختر خطتك"}
          </h2>

          {plans.length === 0 ? (
            <div className="bg-white border-2 border-[#111827] rounded-xl p-12 text-center">
              <Sparkles className="h-16 w-16 text-[#5FB57A] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#111827] mb-2">
                {locale === "en" ? "No Plans Available" : "لا توجد خطط متاحة"}
              </h3>
              <p className="text-[#6B7280] mb-6">
                {locale === "en"
                  ? "Plans for this service are not available in your country yet."
                  : "الخطط لهذه الخدمة غير متاحة في بلدك حالياً."}
              </p>
              {subscription.service_url && (
                <Button
                  onClick={() => window.open(subscription.service_url, "_blank")}
                  className="bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all"
                  style={{ fontWeight: 600 }}
                >
                  {locale === "en" ? "Visit Official Website" : "زيارة الموقع الرسمي"}
                  <ExternalLink className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Duration Filter */}
              {durations.length > 1 && (
                <div className="mb-8">
                  <div className={`flex flex-wrap gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Button
                      variant={selectedDuration === "all" ? "default" : "outline"}
                      onClick={() => setSelectedDuration("all")}
                      className={`border-2 border-[#111827] rounded-xl ${
                        selectedDuration === "all"
                          ? "bg-[#5FB57A] text-white hover:bg-[#4FA569]"
                          : "hover:bg-[#E8F3E8]"
                      }`}
                    >
                      {locale === "en" ? "All Durations" : "كل المدد"}
                    </Button>
                    {durations.sort((a, b) => (a || 0) - (b || 0)).map((duration) => (
                      <Button
                        key={duration}
                        variant={selectedDuration === duration ? "default" : "outline"}
                        onClick={() => setSelectedDuration(duration || "all")}
                        className={`border-2 border-[#111827] rounded-xl ${
                          selectedDuration === duration
                            ? "bg-[#5FB57A] text-white hover:bg-[#4FA569]"
                            : "hover:bg-[#E8F3E8]"
                        }`}
                      >
                        {duration} {locale === "en" ? "Months" : "شهر"}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map((plan) => (
                  <PlanCard
                    key={`${plan.typeId}-${plan.durationId}`}
                    plan={plan}
                    locale={locale}
                    isRTL={isRTL}
                    onGetPlan={handleGetPlan}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Description Section */}
      {description && (
        <section className="py-12 md:py-16 bg-[#E8F3E8]">
          <div className="container mx-auto max-w-[1200px] px-4">
            <div className={`flex items-center gap-3 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-12 bg-[#5FB57A] rounded-2xl flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className={`text-2xl md:text-3xl font-bold text-[#111827] ${isRTL ? 'text-right' : ''}`}>
                {locale === "en" ? "Service Agreement" : "اتفاقية الخدمة"}
              </h2>
            </div>
            
            <div className={`h-1 w-32 bg-[#5FB57A] rounded-full mb-6 ${isRTL ? 'mr-auto' : ''}`}></div>
            
            <p className={`text-lg text-[#111827] leading-relaxed ${isRTL ? 'text-right' : ''}`}>
              {description}
            </p>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto max-w-[1200px] px-4">
          <h2 className={`text-2xl md:text-3xl font-bold text-[#111827] mb-6 ${isRTL ? 'text-right' : ''}`}>
            {locale === "en" ? "Frequently Asked Questions" : "الأسئلة الشائعة"}
          </h2>

          <div className="max-w-3xl mx-auto space-y-4">
            {mockFaqs.map((faq, index) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] transition-all duration-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className={`w-full px-6 py-5 flex items-center justify-between gap-4 text-left hover:bg-[#F9FAFB] transition-colors ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0">
                      <Sparkles className="h-5 w-5 text-[#5FB57A]" />
                    </div>
                    <h3 className="text-[#111827] flex-1" style={{ fontSize: '18px', fontWeight: 600 }}>
                      {locale === "ar" ? faq.question_ar : faq.question_en}
                    </h3>
                  </div>
                  <div
                    className="flex-shrink-0"
                    style={{ 
                      transform: openFaqIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}
                  >
                    <ChevronDown className="h-6 w-6 text-[#5FB57A]" />
                  </div>
                </button>

                {openFaqIndex === index && (
                  <div className="overflow-hidden">
                    <div className={`px-6 pb-5 pt-2 bg-gradient-to-br from-[#F9FAFB] to-[#F0F7F0] border-t-2 border-[#E5E7EB] ${isRTL ? 'pr-14' : 'pl-14'}`}>
                      <p className="text-[#6B7280] leading-relaxed" style={{ fontSize: '16px', lineHeight: '1.7' }}>
                        {locale === "ar" ? faq.answer_ar : faq.answer_en}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-12 bg-gradient-to-br from-[#E8F3E8] to-[#D1E7D1] rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] overflow-hidden">
            <div className={`grid md:grid-cols-2 gap-0 ${isRTL ? 'md:grid-flow-dense' : ''}`}>
              <div className={`relative h-64 md:h-auto ${isRTL ? 'md:col-start-2' : ''}`}>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1653212883731-4d5bc66e0181?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b21lciUyMHN1cHBvcnQlMjBoZWxwJTIwZGVza3xlbnwxfHx8fDE3Njg3NDY5MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Customer Support"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/20 to-transparent"></div>
              </div>

              <div className={`p-8 md:p-12 flex flex-col justify-center ${isRTL ? 'md:col-start-1 text-right' : ''}`}>
                <h3 className="text-[#111827] mb-3" style={{ fontSize: '28px', fontWeight: 700 }}>
                  {locale === "en" 
                    ? "Need help with your subscription?" 
                    : "تحتاج مساعدة في اشتراكك؟"}
                </h3>
                <p className="text-[#6B7280] mb-6 text-lg leading-relaxed">
                  {locale === "en"
                    ? "Our dedicated support team is here to assist you with any questions about plans, pricing, or activation. Get in touch and we'll help you find the perfect solution."
                    : "فريق الدعم المخصص لدينا هنا لمساعدتك في أي أسئلة حول الخطط أو الأسعار أو التفعيل. تواصل معنا وسنساعدك في إيجاد الحل الأمثل."}
                </p>
                <a
                  href="mailto:support@tuut.com"
                  className={`inline-flex items-center gap-2 px-6 py-3 w-fit bg-[#5FB57A] text-white border-2 border-[#111827] hover:bg-[#4FA56A] rounded-lg shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
                  style={{ fontWeight: 600 }}
                >
                  <HelpCircle className="h-5 w-5" />
                  {locale === "en" ? "Contact Support" : "تواصل مع الدعم"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More Subscriptions Section */}
      {otherSubscriptions.length > 0 && (
        <section className="py-8 md:py-12 bg-white border-t-2 border-[#111827]">
          <div className="container mx-auto max-w-[1200px] px-4">
            <h2 className={`text-2xl md:text-3xl font-bold text-[#111827] mb-6 ${isRTL ? 'text-right' : ''}`}>
              {locale === "en" ? "More Subscriptions" : "المزيد من الاشتراكات"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherSubscriptions.map((sub) => {
                const subTitle = locale === "ar" ? sub.title_ar : sub.title_en;
                const subDesc = locale === "ar" ? sub.description_ar : sub.description_en;
                const subCategory = locale === "ar" ? sub.category_ar : sub.category;
                
                return (
                  <div
                    key={sub.id}
                    onClick={() => router.push(`/${localeCountry}/subscription/${sub.id}`)}
                    className="bg-[#E8F3E8] border-2 border-[#111827] rounded-xl p-6 hover:shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] transition-all cursor-pointer group"
                  >
                    <div className={`flex items-start gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {sub.image_url_en ? (
                        <ImageWithFallback
                          src={sub.image_url_en}
                          alt={subTitle || ""}
                          className="w-12 h-12 object-contain rounded-lg border-2 border-[#111827] bg-white p-2"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-white rounded-lg border-2 border-[#111827] flex items-center justify-center">
                          <Sparkles className="h-6 w-6 text-[#5FB57A]" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className={`font-bold text-[#111827] mb-1 ${isRTL ? 'text-right' : ''}`}>
                          {subTitle}
                        </h3>
                        {subCategory && (
                          <p className={`text-sm text-[#6B7280] ${isRTL ? 'text-right' : ''}`}>
                            {subCategory}
                          </p>
                        )}
                      </div>
                    </div>
                    {subDesc && (
                      <p className={`text-sm text-[#6B7280] line-clamp-2 ${isRTL ? 'text-right' : ''}`}>
                        {subDesc}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// Plan Card Component
interface PlanCardProps {
  plan: PlanDisplay;
  locale: string;
  isRTL: boolean;
  onGetPlan: (plan: PlanDisplay) => void;
}

function PlanCard({ plan, locale, isRTL, onGetPlan }: PlanCardProps) {
  const planType = locale === "ar" ? plan.typeNameAr : plan.typeName;
  const durationLabel = locale === "ar" ? plan.durationLabelAr : plan.durationLabel;

  const isRecommended = plan.isRecommended || plan.isPopular;

  return (
    <div
      className={`bg-white border-2 border-[#111827] rounded-xl p-6 hover:shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] transition-all relative ${
        isRecommended ? "ring-4 ring-[#5FB57A] ring-offset-2" : ""
      }`}
    >
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-[#5FB57A] text-white border-2 border-[#111827] hover:bg-[#4FA569] px-4 py-1">
            <Crown className="h-3 w-3 mr-1" />
            {locale === "en" ? "Recommended" : "موصى به"}
          </Badge>
        </div>
      )}

      {planType && (
        <h3 className={`text-xl font-bold text-[#111827] mb-2 mt-2 ${isRTL ? 'text-right' : ''}`}>
          {planType}
        </h3>
      )}

      <div className={`flex items-center gap-2 text-[#6B7280] mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Clock className="h-4 w-4" />
        <span>
          {durationLabel || `${plan.durationMonths} ${locale === "en" ? "Months" : "شهر"}`}
        </span>
      </div>

      <div className={`mb-6 ${isRTL ? 'text-right' : ''}`}>
        <div className={`flex items-baseline gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-3xl font-bold text-[#111827]">
            {plan.currency || "$"}{plan.discountedPrice}
          </span>
          {plan.originalPrice && plan.originalPrice > (plan.discountedPrice || 0) && (
            <span className="text-lg text-[#6B7280] line-through">
              {plan.currency || "$"}{plan.originalPrice}
            </span>
          )}
        </div>
        {plan.savingsPercentage && plan.savingsPercentage > 0 && (
          <p className="text-sm text-[#5FB57A] font-semibold">
            {locale === "en" ? "Save" : "وفر"} {plan.savingsPercentage}%
          </p>
        )}
      </div>

      <Button
        onClick={() => onGetPlan(plan)}
        className={`w-full border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all ${
          isRecommended
            ? "bg-[#5FB57A] hover:bg-[#4FA569] text-white"
            : "bg-white hover:bg-[#E8F3E8] text-[#111827]"
        }`}
        style={{ fontWeight: 600 }}
      >
        {locale === "en" ? "Get This Plan" : "احصل على هذه الخطة"}
        <ExternalLink className={`h-4 w-4 ${isRTL ? "mr-2" : "ml-2"}`} />
      </Button>
    </div>
  );
}
