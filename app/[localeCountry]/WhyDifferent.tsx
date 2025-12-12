"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Users,
  Shield,
  Gift,
  Star,
  Megaphone,
  CheckCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";

export function WhyDifferent() {
  const pathname = usePathname();
  const localeCountry = pathname?.split("/")[1];
  const language = localeCountry?.split("-")[0];
  const isRTL = language === "ar";

  const features = [
    {
      icon: Users,
      title:
        language === "en"
          ? "Powered by shoppers like you"
          : "مدعوم من المتسوقين مثلك",
      description:
        language === "en"
          ? "Our unique system combines a powerful AI engine with our community of millions of real shoppers who verify codes in real-time, ensuring you get more codes that work."
          : "يجمع نظامنا الفريد بين محرك ذكاء اصطناعي قوي ومجتمعنا من ملايين المتسوقين الحقيقيين الذين يتحققون من الأكواد في الوقت الفعلي، مما يضمن لك الحصول على المزيد من الأكواد التي تعمل.",
      gradient: "from-[#E8F3E8] to-[#BCF0CC]",
      iconColor: "#FFFFFF",
      iconBg: "#5FB57A",
    },
    {
      icon: Shield,
      title:
        language === "en"
          ? "Trust and privacy by design"
          : "الثقة والخصوصية بالتصميم",
      description:
        language === "en"
          ? "While other coupon sites track everything you browse, we only collect the minimum data needed to find you coupon codes. Your shopping habits stay private, giving you control over your data without sacrificing savings."
          : "بينما تتبع مواقع القسائم الأخرى كل ما تتصفحه، نحن نجمع فقط الحد الأدنى من البيانات اللازمة للعثور على رموز القسيمة لك. تظل عادات التسوق الخاصة بك خاصة، مما يمنحك التحكم في بياناتك دون التضحية بالمدخرات.",
      gradient: "from-[#BCF0CC] to-[#9DD9B3]",
      iconColor: "#FFFFFF",
      iconBg: "#5FB57A",
    },
    {
      icon: Gift,
      title: language === "en" ? "Rewards when you save" : "مكافآت عند التوفير",
      description:
        language === "en"
          ? "Shop and save at 400,000+ stores—from big brands to local favorites. Stack deals to boost rewards and cash out anytime you want."
          : "تسوق ووفر في أكثر من 400,000 متجر - من العلامات التجارية الكبيرة إلى المفضلات المحلية. كدس الصفقات لتعزيز المكافآت واسحب النقود في أي وقت تريد.",
      gradient: "from-[#9DD9B3] to-[#7EC89A]",
      iconColor: "#FFFFFF",
      iconBg: "#5FB57A",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-10 ${isRTL ? "text-right" : "text-left"}`}
        >
          <h2
            className="mb-4 text-[#111827]"
            style={{ fontSize: "36px", fontWeight: 700 }}
          >
            {language === "en" ? (
              <>
                How we're{" "}
                <span className="italic text-[#5FB57A]">different</span> from
                traditional coupon sites
              </>
            ) : (
              <>
                كيف نحن <span className="italic text-[#5FB57A]">مختلفون</span>{" "}
                عن مواقع القسائم التقليدية
              </>
            )}
          </h2>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className={`p-8 border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all bg-gradient-to-br ${feature.gradient} overflow-hidden relative`}
              >
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/20 border-2 border-[#111827]" />
                <div
                  className={`absolute ${
                    index === 0
                      ? "-bottom-6 -left-6"
                      : index === 1
                      ? "bottom-4 right-4"
                      : "top-1/2 left-4"
                  } w-16 h-16 rounded-full bg-white/10 border-2 border-white/30`}
                />

                <div
                  className={`flex flex-col ${
                    isRTL ? "items-end" : "items-start"
                  } h-full relative z-10`}
                >
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border-2 border-[#111827] shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]"
                    style={{ backgroundColor: feature.iconBg }}
                  >
                    <Icon
                      className="h-10 w-10"
                      style={{ color: feature.iconColor }}
                    />
                  </div>
                  <h3
                    className={`mb-4 text-[#111827] ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                    style={{ fontSize: "22px", fontWeight: 700 }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`text-[#111827] text-sm leading-relaxed ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom Row - Rating & Share Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Rating Card */}
          <Card className="p-8 border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] bg-gradient-to-br from-[#BCF0CC] to-[#7EC89A] overflow-hidden relative">
            <div
              className={`flex flex-col ${isRTL ? "items-end" : "items-start"}`}
            >
              <div className="flex items-baseline gap-2 mb-4">
                <span
                  className="text-[#111827]"
                  style={{ fontSize: "64px", fontWeight: 700 }}
                >
                  4.7
                </span>
                <Star className="h-8 w-8 fill-[#111827] text-[#111827]" />
              </div>
              <h3
                className={`text-[#111827] mb-2 ${
                  isRTL ? "text-right" : "text-left"
                }`}
                style={{ fontSize: "20px", fontWeight: 700 }}
              >
                {language === "en"
                  ? "Average Google Chrome Web Store rating from users"
                  : "متوسط تقييم متجر Google Chrome من المستخدمين"}
              </h3>
              <p
                className={`text-sm text-[#6B7280] ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                {language === "en"
                  ? "Last updated Aug 30, 2025"
                  : "آخر تحديث 30 أغسطس 2025"}
              </p>
            </div>
            {/* Decorative circles */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/20 border-2 border-[#111827]" />
            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-white/20 border-2 border-[#111827]" />
          </Card>

          {/* Share Deal Card */}
          <Card className="p-8 border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] bg-gradient-to-br from-[#5FB57A] to-[#4FA569] overflow-hidden relative">
            <div
              className={`flex ${
                isRTL ? "flex-row-reverse" : "flex-row"
              } items-center gap-6 h-full`}
            >
              <div className="flex-1">
                <h3
                  className={`text-white mb-3 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                  style={{ fontSize: "24px", fontWeight: 700 }}
                >
                  {language === "en"
                    ? "Found a great deal? Don't keep it to yourself!"
                    : "وجدت صفقة رائعة؟ لا تحتفظ بها لنفسك!"}
                </h3>
                <p
                  className={`text-white/90 mb-4 text-sm ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {language === "en"
                    ? "Be the hero other shoppers need."
                    : "كن البطل الذي يحتاجه المتسوقون الآخرون."}
                </p>
                <p
                  className={`text-white/80 mb-6 text-sm ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {language === "en"
                    ? "Every code shared makes shopping better for everyone. Plus, the more you help people save, the more rewards you'll earn."
                    : "كل كود تشاركه يجعل التسوق أفضل للجميع. بالإضافة إلى ذلك، كلما ساعدت الناس على التوفير، زادت المكافآت التي ستكسبها."}
                </p>
                <Button className="bg-[#111827] hover:bg-[#1F2937] text-white border-2 border-white rounded-lg shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-[1px_1px_0px_0px_rgba(255,255,255,1)] transition-all">
                  <CheckCircle
                    className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                  />
                  {language === "en" ? "Share a code" : "شارك كود"}
                </Button>
              </div>
              <div className="hidden md:block">
                <div className="w-32 h-32 relative">
                  <div className="absolute inset-0 rounded-full bg-white/10 border-2 border-white/30" />
                  <div className="absolute inset-2 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
                    <Megaphone className="h-16 w-16 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
