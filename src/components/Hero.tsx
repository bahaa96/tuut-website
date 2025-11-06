import { Sparkles, ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../contexts/LanguageContext";

export function Hero() {
  const { t, isRTL } = useLanguage();
  
  // User avatars for social proof
  const userImages = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
  ];

  return (
    <section className="relative bg-background py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 
              className="mb-6 text-[#111827]" 
              style={{ fontSize: '56px', fontWeight: 700, lineHeight: 1.1 }}
            >
              {t('hero.title')}
            </h1>

            {/* Social Proof */}
            <div className="mb-8">
              <p className="text-[#111827] mb-4">
                {isRTL ? 'يستخدمه أكثر من 50,000' : 'Used by over 50,000'}
              </p>
              <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                {/* Avatar Stack */}
                <div className={`flex ${isRTL ? '-space-x-reverse -space-x-3' : '-space-x-3'}`}>
                  {userImages.map((img, i) => (
                    <div 
                      key={i} 
                      className="w-12 h-12 rounded-full border-4 border-background overflow-hidden"
                    >
                      <ImageWithFallback
                        src={img}
                        alt={`User ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {/* Testimonial Bubble */}
                <div className="bg-white rounded-2xl px-6 py-3 border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]">
                  <p className="text-[#111827] text-sm">
                    <span style={{ fontWeight: 600 }}>{isRTL ? 'رائع، لقد وفرت $500!' : 'Wow, I saved $500!'}</span>
                  </p>
                  <p className="text-[#6B7280] text-xs">{isRTL ? 'جوني دو' : 'Johnny Doe'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hand-drawn Doodles */}
          <div className="relative flex justify-center items-center h-[300px]">
            {/* Decorative curved line */}
            <svg 
              className="absolute top-0 right-0 w-48 h-48 text-[#111827]"
              viewBox="0 0 200 200"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <path d="M 20 100 Q 60 20, 120 60" />
              <path d="M 120 60 Q 140 80, 140 120" />
            </svg>

            {/* Sparkle 1 */}
            <svg
              className="absolute top-12 right-24 w-12 h-12 text-[#111827]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3v18M3 12h18" />
              <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
            </svg>

            {/* Sparkle 2 */}
            <Sparkles 
              className="absolute bottom-20 right-32 w-8 h-8 text-[#111827]" 
              strokeWidth={2.5}
            />

            {/* Small star */}
            <svg
              className="absolute top-32 right-12 w-6 h-6 text-[#111827]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-20 border-t-2 border-[#111827] pt-16">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div>
              <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-[#111827] text-white flex items-center justify-center" style={{ fontWeight: 700 }}>
                  1
                </div>
                <h3 className="text-[#111827]" style={{ fontSize: '18px', fontWeight: 600 }}>
                  {isRTL ? 'قم بتنزيل الإضافة لكروم أو فايرفوكس.' : 'Download the Extension for Chrome or Firefox.'}
                </h3>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-[#111827] text-white flex items-center justify-center" style={{ fontWeight: 700 }}>
                  2
                </div>
                <h3 className="text-[#111827]" style={{ fontSize: '18px', fontWeight: 600 }}>
                  {isRTL ? 'قم بزيارة المتاجر المفضلة لديك.' : 'Visit your favorite online retailers.'}
                </h3>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className="w-10 h-10 rounded-full bg-[#111827] text-white flex items-center justify-center" style={{ fontWeight: 700 }}>
                  3
                </div>
                <h3 className="text-[#111827]" style={{ fontSize: '18px', fontWeight: 600 }}>
                  {isRTL ? 'وفّر! قم بتطبيق الكوبونات من شريط الأدوات.' : 'Save! Apply coupons from the toolbar.'}
                </h3>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="mt-12 text-center">
            <Button 
              className="bg-[#5FB57A] hover:bg-[#4FA569] text-[#111827] border-2 border-[#111827] rounded-xl shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all h-12 px-8"
              style={{ fontWeight: 600, fontSize: '16px' }}
            >
              {isRTL ? 'تثبيت الإضافة' : 'Install Extension'}
              <ArrowDown className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
