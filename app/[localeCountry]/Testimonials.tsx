"use client";
import { Star } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { usePathname } from "next/navigation";
import * as m from "@/src/paraglide/messages";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  rating: number;
  text: string;
  savings: string;
}

export function Testimonials() {
  const pathname = usePathname();
  const localeCountry = pathname?.split("/")[1];
  const locale = localeCountry?.split("-")[0];
  const isRTL = locale === "ar";

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Salma Osama",
      role: "Fashion Enthusiast",
      image: "https://i.ibb.co/zvRFXfv/IMG-7700.png",
      rating: 5,
      text: "I've saved over 500 EGP in just 1 month using Tuut! The deals are always verified and the platform is so easy to use.",
      savings: "547 EGP",
    },
    {
      id: 2,
      name: "Ahmed Khaled",
      role: "Tech Buyer",
      image:
        "https://i.ibb.co/xt83FkJP/436120464-961593458911366-457812820982703478-n.jpg",
      rating: 5,
      text: "Amazing platform! I found a 20% off deal on a laptop I'd been eyeing for months. The price tracking feature is a game changer!",
      savings: "820 EGP",
    },
    {
      id: 3,
      name: "Taher Adel",
      role: "Smart Shopper",
      image:
        "https://i.ibb.co/wrBFfq6C/433449650-1550531708852537-5736079899286153721-n.jpg",
      rating: 5,
      text: "The newsletter keeps me updated on the best deals. I love how organized everything is by category. Never shopping without checking Tuut first!",
      savings: "392 EGP",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="mb-2 text-[#111827]"
            style={{ fontSize: "36px", fontWeight: 700 }}
          >
            {m.WHAT_OUR_USERS_SAY()}
          </h2>
          <p className="text-[#6B7280]">
            {m.JOIN_THOUSANDS_OF_SMART_SHOPPERS_SAVING_MONEY_EVERY_DAY()}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-[#5FB57A] text-[#5FB57A]"
                  />
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-[#111827] mb-6"
                style={{ fontSize: "15px", lineHeight: "1.6" }}
              >
                "{testimonial.text}"
              </p>

              {/* User Info */}
              <div className="flex items-center gap-3 pt-4 border-t-2 border-[#E5E7EB]">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-[#111827]">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div style={{ fontWeight: 600 }} className="text-[#111827]">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-[#6B7280]">
                    {testimonial.role}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#6B7280]">{m.SAVED()}</div>
                  <div style={{ fontWeight: 700 }} className="text-[#5FB57A]">
                    {testimonial.savings}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-12 bg-[#5FB57A] rounded-2xl p-8 md:p-10 text-[#111827] border-2 border-[#111827] shadow-[6px_6px_0px_0px_rgba(17,24,39,1)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center">
            <div>
              <div style={{ fontSize: "36px", fontWeight: 700 }}>
                {isRTL ? "+24.5 مليون $" : "$24.5M+"}
              </div>
              <div className="text-[#111827]/80" style={{ fontWeight: 500 }}>
                {m.TOTAL_SAVINGS()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "36px", fontWeight: 700 }}>
                {isRTL ? "+500 ألف" : "500K+"}
              </div>
              <div className="text-[#111827]/80" style={{ fontWeight: 500 }}>
                {m.HAPPY_USERS()}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "36px", fontWeight: 700 }}>4.9/5</div>
              <div className="text-[#111827]/80" style={{ fontWeight: 500 }}>
                {m.AVERAGE_RATING()}
              </div>
            </div>
          </div>

          {/* Download App Section */}
          <div className="border-t-2 border-[#111827]/20 pt-8">
            <div className="text-center mb-6">
              <h3
                className="text-[#111827] mb-2"
                style={{ fontSize: "24px", fontWeight: 600 }}
              >
                {m.DOWNLOAD_OUR_APP()}
              </h3>
              <p className="text-[#111827]/80">
                {m.GET_EXCLUSIVE_MOBILE_ONLY_DEALS_AND_NOTIFICATIONS()}
              </p>
            </div>
            <div
              className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${
                isRTL ? "sm:flex-row-reverse" : ""
              }`}
            >
              {/* App Store Badge */}
              <a
                href="#"
                className={`group flex items-center gap-3 bg-white border-2 border-[#111827] rounded-xl px-6 py-3 transition-all hover:shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <svg
                  className="w-8 h-8 text-[#111827]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className={`${isRTL ? "text-right" : "text-left"}`}>
                  <div className="text-xs text-[#111827]/70">
                    {m.DOWNLOAD_ON_THE()}
                  </div>
                  <div className="text-[#111827]" style={{ fontWeight: 600 }}>
                    {m.APP_STORE()}
                  </div>
                </div>
              </a>

              {/* Google Play Badge */}
              <a
                href="#"
                className={`group flex items-center gap-3 bg-white border-2 border-[#111827] rounded-xl px-6 py-3 transition-all hover:shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <svg
                  className="w-8 h-8 text-[#111827]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className={`${isRTL ? "text-right" : "text-left"}`}>
                  <div className="text-xs text-[#111827]/70">
                    {m.GET_IT_ON()}
                  </div>
                  <div className="text-[#111827]" style={{ fontWeight: 600 }}>
                    {m.GOOGLE_PLAY()}
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
