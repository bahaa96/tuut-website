import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import { getLocale } from "@/src/paraglide/runtime";

// Translations
const translations = {
  en: {
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about Tuut",
      questions: [
        {
          question: "What is Tuut?",
          answer:
            "Tuut is your ultimate destination for verified deals and coupons from 500+ top brands. We help smart shoppers save money on their favorite products and services across the UAE, Saudi Arabia, and Egypt.",
        },
        {
          question: "How do I use a coupon code?",
          answer:
            'Simply click on any deal to view the coupon code, copy it to your clipboard, and apply it at checkout on the store\'s website. Some deals are automatically applied when you click "Shop Now".',
        },
        {
          question: "Are all deals verified?",
          answer:
            "Yes! Our team verifies every deal before publishing. We also track deal performance and remove expired or non-working codes to ensure you always get the best experience.",
        },
        {
          question: "Do I need to create an account?",
          answer:
            "You can browse deals without an account, but signing in with your phone number lets you save favorite deals, track products for price drops, and spin our daily wheel to win exclusive coupons!",
        },
        {
          question: "How does the Spin & Win work?",
          answer:
            "Sign in and spin the wheel once every day for a chance to win exclusive coupon codes! Each spin guarantees a prize from our featured deals. Come back daily for more chances to win.",
        },
        {
          question: "What is product tracking?",
          answer:
            "Product tracking lets you monitor specific products and get notified when prices drop or items come back in stock. Simply add a product URL and we'll keep you updated!",
        },
        {
          question: "How often are new deals added?",
          answer:
            "We add new deals daily! Our team works with brands across multiple countries to bring you the latest offers. Check back frequently or enable notifications to never miss a deal.",
        },
        {
          question: "Is Tuut free to use?",
          answer:
            "Absolutely! Tuut is 100% free for all users. We earn a small commission when you make purchases through our links, but this never affects the price you pay.",
        },
      ],
    },
  },
  ar: {
    faq: {
      title: "الأسئلة الشائعة",
      subtitle: "كل ما تحتاج معرفته عن توت",
      questions: [
        {
          question: "ما هو توت؟",
          answer:
            "توت هو وجهتك المثالية للعثور على عروض وكوبونات موثقة من أكثر من 500 علامة تجارية رائدة. نساعد المتسوقين الأذكياء على توفير المال عند شراء منتجاتهم وخدماتهم المفضلة في الإمارات والسعودية ومصر.",
        },
        {
          question: "كيف أستخدم كود الخصم؟",
          answer:
            'ببساطة، انقر على أي صفقة لعرض كود الكوبون، انسخه، وقم بتطبيقه عند الدفع على موقع المتجر. بعض الصفقات يتم تطبيقها تلقائياً عند النقر على "تسوق الآن".',
        },
        {
          question: "هل جميع العروض موثقة؟",
          answer:
            "نعم! فريقنا يتحقق من كل صفقة قبل نشرها. كما نتابع أداء الصفقات ونزيل الأكواد المنتهية أو غير الفعالة لضمان حصولك على أفضل تجربة دائماً.",
        },
        {
          question: "هل أحتاج لإنشاء حساب؟",
          answer:
            "يمكنك تصفح العروض بدون حساب، لكن تسجيل الدخول برقم هاتفك يتيح لك حفظ العروض المفضلة، تتبع المنتجات لانخفاض الأسعار، وتدوير عجلتنا اليومية للفوز بكوبونات حصرية!",
        },
        {
          question: "كيف يعمل دوّر واربح؟",
          answer:
            "سجّل الدخول ودوّر العجلة مرة واحدة كل يوم للحصول على فرصة للفوز بأكواد كوبونات حصرية! كل دورة تضمن لك جائزة من عروضنا المميزة. عُد يومياً لمزيد من فرص الفوز.",
        },
        {
          question: "ما هو تتبع المنتجات؟",
          answer:
            "تتبع المنتجات يتيح لك مراقبة منتجات محددة والحصول على إشعارات عند انخفاض الأسعار أو عودة المنتجات للمخزون. ببساطة أضف رابط المنتج وسنبقيك على اطلاع!",
        },
        {
          question: "كم مرة تُضاف عروض جديدة؟",
          answer:
            "نضيف عروضاً جديدة يومياً! فريقنا يعمل مع علامات تجارية في عدة دول لنقدم لك أحدث العروض. تفقد الموقع بانتظام أو فعّل الإشعارات حتى لا تفوتك أي صفقة.",
        },
        {
          question: "هل توت مجاني؟",
          answer:
            "بالتأكيد! توت مجاني 100% لجميع المستخدمين. نحصل على عمولة صغيرة عند الشراء من خلال روابطنا، لكن هذا لا يؤثر أبداً على السعر الذي تدفعه.",
        },
      ],
    },
  },
};

export function FAQ() {
  const language = getLocale();
  const isRTL = language === "ar";
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="h-10 w-10 text-[#5FB57A]" />
            <h2
              className="text-[#111827]"
              style={{ fontSize: "36px", fontWeight: 700 }}
            >
              {translations[language].faq.title}
            </h2>
          </div>
          <p className="text-[#6B7280] text-lg">
            {translations[language].faq.subtitle}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto space-y-4">
          {translations[language].faq.questions.map((item, index) => (
            <div
              key={index}
              className={`
                bg-white rounded-xl border-2 border-[#111827]
                shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]
                hover:shadow-[6px_6px_0px_0px_rgba(17,24,39,1)]
                transition-all duration-200
                overflow-hidden
              `}
            >
              {/* Question */}
              <button
                onClick={() => toggleQuestion(index)}
                className={`
                  w-full px-6 !py-5 flex items-center justify-between gap-4
                  text-left hover:bg-[#F9FAFB] transition-colors
                  ${isRTL ? "flex-row-reverse text-right" : ""}
                `}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-[#5FB57A]" />
                  </div>
                  <h3
                    className="text-[#111827] flex-1"
                    style={{ fontSize: "18px", fontWeight: 600 }}
                  >
                    {item.question}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  <ChevronDown
                    className={`h-6 w-6 text-[#5FB57A] ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Answer */}
              {openIndex === index && (
                <div className="overflow-hidden">
                  <div
                    className={`
                        px-6 pb-5 pt-2 bg-gradient-to-br from-[#F9FAFB] to-[#F0F7F0]
                        border-t-2 border-[#E5E7EB]
                        ${isRTL ? "pr-14" : "pl-14"}
                      `}
                  >
                    <p
                      className="text-[#6B7280] leading-relaxed"
                      style={{ fontSize: "16px", lineHeight: "1.7" }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div
          className={`
            mt-12 text-center bg-gradient-to-br from-[#E8F3E8] to-[#D1E7D1]
            rounded-2xl border-2 border-[#111827] p-8
            shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]
          `}
        >
          <h3
            className="text-[#111827] mb-3"
            style={{ fontSize: "24px", fontWeight: 700 }}
          >
            {isRTL ? "لا تزال لديك أسئلة؟" : "Still have questions?"}
          </h3>
          <p className="text-[#6B7280] mb-6" style={{ fontSize: "16px" }}>
            {isRTL
              ? "تواصل معنا وسيسعد فريقنا بمساعدتك!"
              : "Contact us and our team will be happy to help you!"}
          </p>
          <a
            href="mailto:support@tuut.com"
            className={`
              inline-flex items-center gap-2 px-6 py-3
              bg-[#5FB57A] text-white border-2 border-[#111827]
              hover:bg-[#4FA56A] rounded-lg
              shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]
              hover:shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]
              transition-all
            `}
            style={{ fontWeight: 600 }}
          >
            {isRTL ? "تواصل معنا" : "Contact Us"}
          </a>
        </div>
      </div>
    </section>
  );
}
