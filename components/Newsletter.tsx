"use client";
import { Mail, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";

export function Newsletter() {
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast.error(isRTL ? "الرجاء إدخال بريد إلكتروني صالح" : "Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success(isRTL ? "تم الاشتراك بنجاح! تحقق من بريدك الإلكتروني للحصول على عروض حصرية." : "Successfully subscribed! Check your inbox for exclusive deals.");
      setEmail("");
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-8 md:p-12 border-2 border-[#111827] shadow-[6px_6px_0px_0px_rgba(17,24,39,1)]">
          <div className="max-w-[600px] mx-auto text-center">
            {/* Icon */}
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#5FB57A] border-2 border-[#111827] mb-6">
              <Mail className="h-8 w-8 text-[#111827]" />
            </div>

            {/* Heading */}
            <h2 className="mb-3 text-[#111827]" style={{ fontSize: '36px', fontWeight: 700 }}>
              {t('newsletter.title')}
            </h2>
            <p className="text-[#6B7280] mb-8">
              {t('newsletter.subtitle')}
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-3 mb-6 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder={t('newsletter.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 bg-white border-2 border-[#111827] focus-visible:ring-2 focus-visible:ring-[#5FB57A] rounded-xl"
                  required
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-14 px-8 bg-[#5FB57A] hover:bg-[#4FA569] text-[#111827] border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all"
                style={{ fontWeight: 600 }}
              >
                {isSubmitting ? (
                  t('newsletter.subscribing')
                ) : (
                  <>
                    {t('newsletter.subscribe')}
                    <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                  </>
                )}
              </Button>
            </form>

            {/* Privacy Note */}
            <p className="text-sm text-[#6B7280]">
              {isRTL ? '🔒 نحن نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت.' : '🔒 We respect your privacy. Unsubscribe at any time.'}
            </p>

            {/* Benefits */}
            <div className="grid sm:grid-cols-3 gap-4 mt-8 text-[#111827] text-sm">
              <div className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-[#5FB57A] text-lg">✓</span>
                <span style={{ fontWeight: 500 }}>{t('newsletter.features.exclusive')}</span>
              </div>
              <div className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-[#5FB57A] text-lg">✓</span>
                <span style={{ fontWeight: 500 }}>{t('newsletter.features.weekly')}</span>
              </div>
              <div className={`flex items-center justify-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className="text-[#5FB57A] text-lg">✓</span>
                <span style={{ fontWeight: 500 }}>{t('newsletter.features.personalized')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
