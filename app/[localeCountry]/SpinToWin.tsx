"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { getLocale } from "@/src/paraglide/runtime";
import { useAuth } from "@/contexts/AuthContext";
import { SignInModal } from "@/components/SignInModal";
import { toast } from "sonner";
import { Gift, Sparkles, Trophy, Clock, Copy, X } from "lucide-react";
import { copyToClipboard } from "@/utils/clipboard";

// Translations
const translations = {
  en: {
    spinToWin: {
      title: 'Daily Spin & Win',
      subtitle: 'Spin the wheel once every day and win exclusive coupons!',
      spinButton: 'Spin Now',
      spinning: 'Spinning...',
      signInToSpin: 'Sign In to Spin',
      alreadySpun: 'Come back tomorrow!',
      nextSpin: 'Next spin available in',
      congratulations: 'Congratulations!',
      youWon: "You won",
      copyCode: 'Copy Code',
      viewDeal: 'View Deal',
      closeModal: 'Close',
      hours: 'hours',
      minutes: 'minutes',
      seconds: 'seconds',
    },
  },
  ar: {
    spinToWin: {
      title: 'دوّر واربح يومياً',
      subtitle: 'دوّر العجلة مرة كل يوم واربح كوبونات حصرية!',
      spinButton: 'دوّر الآن',
      spinning: 'جاري التدوير...',
      signInToSpin: 'سجّل الدخول للتدوير',
      alreadySpun: 'عد غداً!',
      nextSpin: 'الدوران التالي متاح في',
      congratulations: 'تهانينا!',
      youWon: "لقد فزت بـ",
      copyCode: 'نسخ الكود',
      viewDeal: 'عرض الصفقة',
      closeModal: 'إغلاق',
      hours: 'ساعات',
      minutes: 'دقائق',
      seconds: 'ثواني',
    },
  },
};

interface Deal {
  id: number;
  title: string;
  title_ar?: string;
  store?: string;
  store_ar?: string;
  description?: string;
  description_ar?: string;
  code?: string;
  discount_percentage?: string;
  discount_amount?: string;
  discount_unit?: string;
  slug?: string;
}

interface SpinToWinProps {
  initialWheelDeals?: Deal[];
}

export function SpinToWin({ initialWheelDeals = [] }: SpinToWinProps) {
  const language = getLocale();
  const isRTL = language === "ar";
  const { user } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [canSpin, setCanSpin] = useState(false);
  const [timeUntilNextSpin, setTimeUntilNextSpin] = useState<string>('');
  const [wonDeal, setWonDeal] = useState<Deal | null>(null);
  const [showPrizeModal, setShowPrizeModal] = useState(false);

  // Fallback deals when API fails or no deals available
  const fallbackDeals: Deal[] = [
    {
      id: 1,
      title: '50% Off Electronics',
      title_ar: 'خصم 50% على الإلكترونيات',
      store: 'Amazon',
      store_ar: 'أمازون',
      discount_percentage: '50',
      code: 'SAVE50',
      slug: 'amazon-50-off',
    },
    {
      id: 2,
      title: '30% Off Fashion',
      title_ar: 'خصم 30% على الأزياء',
      store: 'Noon',
      store_ar: 'نون',
      discount_percentage: '50',
      code: 'FASHION30',
      slug: 'noon-fashion-30',
    },
    {
      id: 3,
      title: 'Free Shipping',
      title_ar: 'شحن مجاني',
      store: 'Namshi',
      store_ar: 'نمشي',
      discount_percentage: '50',
      code: 'FREESHIP',
      slug: 'namshi-free-ship',
    },
    {
      id: 4,
      title: '25% Off Beauty',
      title_ar: 'خصم 25% على مستحضرات التجميل',
      store: 'Sephora',
      store_ar: 'سيفورا',
      discount_percentage: '50',
      code: 'BEAUTY25',
      slug: 'sephora-beauty-25',
    },
    {
      id: 5,
      title: 'Buy 2 Get 1 Free',
      title_ar: 'اشتري 2 واحصل على 1 مجانا',
      store: 'Centrepoint',
      store_ar: 'سنتربوينت',
      discount_percentage: '50',
      code: 'B2G1FREE',
      slug: 'centrepoint-b2g1',
    },
    {
      id: 6,
      title: '40% Off Home & Kitchen',
      title_ar: 'خصم 40% على المنزل والمطبخ',
      store: 'Ikea',
      store_ar: 'ايكيا',
      discount_percentage: '50',
      code: 'HOME40',
      slug: 'ikea-home-40',
    },
    {
      id: 7,
      title: '20% Off Sports',
      title_ar: 'خصم 20% على الرياضة',
      store: 'Nike',
      store_ar: 'نايك',
      discount_percentage: '50',
      code: 'SPORT20',
      slug: 'nike-sport-20',
    },
    {
      id: 8,
      title: '15% Off Books',
      title_ar: 'خصم 15% على الكتب',
      store: 'Jarir',
      store_ar: 'جرير',
      discount_percentage: '50',
      code: 'BOOKS15',
      slug: 'jarir-books-15',
    },
  ];

  // Map database deals to component format
  const mappedDeals: Deal[] = initialWheelDeals && initialWheelDeals.length > 0
    ? initialWheelDeals.map((deal: any) => ({
        id: deal.id,
        title: deal.title_en || deal.title || 'Special Deal',
        title_ar: deal.title_ar,
        store: deal.store_name || deal.store?.name || deal.store?.store_name || deal.store?.title_en || 'Store',
        store_ar: deal.store?.store_name_ar || deal.store?.name_ar || deal.store?.title_ar,
        description: deal.description_en || deal.description,
        description_ar: deal.description_ar,
        code: deal.code,
        discount_percentage: deal.discount_percentage?.toString() || '50',
        discount_amount: deal.discount_amount?.toString(),
        discount_unit: deal.discount_unit,
        slug: deal.slug_en || deal.slug,
      }))
    : [];

  // Use mapped deals or fallback to default deals - Always ensure we have exactly 8 deals
  const wheelDeals = (mappedDeals.length >= 8) 
    ? mappedDeals.slice(0, 8) 
    : fallbackDeals;

  // Wheel colors matching the design system
  const wheelColors = ['#5FB57A', '#7EC89A', '#9DD9B3', '#BCF0CC', '#D1E7D1', '#5FB57A', '#7EC89A', '#9DD9B3'];

  // Check if user can spin
  useEffect(() => {
    checkSpinAvailability();
    const interval = setInterval(checkSpinAvailability, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const checkSpinAvailability = () => {
    if (!user) {
      setCanSpin(false);
      setTimeUntilNextSpin('');
      return;
    }

    const lastSpinDate = localStorage.getItem(`lastSpin_${user.phone}`);
    if (!lastSpinDate) {
      setCanSpin(true);
      setTimeUntilNextSpin('');
      return;
    }

    const lastSpin = new Date(lastSpinDate);
    const now = new Date();
    const nextSpinTime = new Date(lastSpin);
    nextSpinTime.setHours(24, 0, 0, 0); // Next day at midnight

    if (now >= nextSpinTime) {
      setCanSpin(true);
      setTimeUntilNextSpin('');
    } else {
      setCanSpin(false);
      const diff = nextSpinTime.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeUntilNextSpin(`${hours}${translations[language].spinToWin.hours.slice(0, 1)} ${minutes}${translations[language].spinToWin.minutes.slice(0, 1)} ${seconds}${translations[language].spinToWin.seconds.slice(0, 1)}`);
    }
  };

  const handleSpin = () => {
    if (!user) {
      setShowSignIn(true);
      return;
    }

    if (!canSpin) {
      toast.error(isRTL ? 'لقد قمت بالتدوير اليوم. عد غداً!' : 'You already spun today. Come back tomorrow!');
      return;
    }

    if (wheelDeals.length === 0) {
      toast.error(isRTL ? 'لا توجد عروض متاحة حالياً' : 'No deals available at the moment');
      return;
    }

    setIsSpinning(true);

    // Random selection
    const winningIndex = Math.floor(Math.random() * wheelDeals.length);
    const degreesPerSegment = 360 / wheelDeals.length;
    const winningRotation = 360 * 5 + (winningIndex * degreesPerSegment) + (degreesPerSegment / 2);
    
    setRotation(winningRotation);

    // After spin animation completes
    setTimeout(() => {
      setIsSpinning(false);
      setWonDeal(wheelDeals[winningIndex]);
      setShowPrizeModal(true);
      
      // Save spin timestamp
      localStorage.setItem(`lastSpin_${user.phone}`, new Date().toISOString());
      setCanSpin(false);
      
      toast.success(isRTL ? '🎉 تهانينا! لقد فزت!' : '🎉 Congratulations! You won!');
    }, 4000);
  };

  const copyCode = async (code: string) => {
    const success = await copyToClipboard(code);
    if (success) {
      toast.success(isRTL ? `تم نسخ الكود "${code}"!` : `Code "${code}" copied!`);
    } else {
      toast.error(isRTL ? `فشل نسخ الكود` : `Failed to copy code`);
    }
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-[#E8F3E8] to-[#D1E7D1] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 opacity-10">
        <Sparkles className="h-24 w-24 text-[#5FB57A]" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10">
        <Gift className="h-32 w-32 text-[#5FB57A]" />
      </div>

      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 relative z-10">
        <div
          className={`text-center mb-10 ${isRTL ? "text-right" : "text-left"}`}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-10 w-10 text-[#5FB57A]" />
            <h2
              className="text-[#111827] text-[28px] md:text-[36px]"
              style={{ fontWeight: 700 }}
            >
              {translations[language].spinToWin.title}
            </h2>
            <Trophy className="h-10 w-10 text-[#5FB57A]" />
          </div>
          <p className="text-[#6B7280] text-lg md:text-center">
            {translations[language].spinToWin.subtitle}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Wheel Container */}
          <div className="relative">
            {/* Pointer/Arrow */}
            <div
              className={`absolute top-0 ${
                isRTL
                  ? "right-1/2 -translate-x-1/2"
                  : "left-1/2 -translate-x-1/2"
              } -translate-y-6 z-20`}
            >
              <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-[#EF4444] filter drop-shadow-lg" />
            </div>

            {/* Wheel */}
            <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px]" style={{ minHeight: '320px', minWidth: '320px' }}>
              {/* Outer ring */}
              <div className="absolute inset-0 rounded-full border-8 border-[#111827] shadow-[8px_8px_0px_0px_rgba(17,24,39,1)] bg-white p-4" style={{ minHeight: '100%', minWidth: '100%' }}>
                {/* Spinning wheel */}
                <motion.div
                  className="w-full h-full rounded-full relative overflow-hidden"
                  style={{ 
                    width: '100%',
                    height: '100%',
                    minWidth: '100%',
                    minHeight: '100%',
                    background: `conic-gradient(${wheelColors.map((color, i) => `${color} ${i * (360/8)}deg ${(i+1) * (360/8)}deg`).join(', ')})`,
                  }}
                  animate={{ rotate: rotation }}
                  transition={{ 
                    duration: 4, 
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  {/* Segments */}
                  {wheelDeals.map((deal, index) => {
                    const angle = (360 / wheelDeals.length) * index;
                    const segmentAngle = 360 / wheelDeals.length;
                    
                    return (
                      <div
                        key={deal.id}
                        className="absolute top-1/2 left-1/2"
                        style={{
                          transform: `rotate(${angle + segmentAngle / 2}deg)`,
                          transformOrigin: '0 0',
                          width: '50%',
                        }}
                      >
                        {/* Discount amount/percentage at the outer edge (wider part) */}
                        <div 
                          className="text-white font-bold uppercase tracking-wider"
                          style={{ 
                            position: 'absolute',
                            left: '85%',
                            top: '50%',
                            transform: 'translate(-50%, -50%) rotate(90deg)',
                            fontSize: '18px',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {deal.discount_percentage 
                            ? `${deal.discount_percentage}%` 
                            : deal.discount_amount 
                              ? `${deal.discount_amount}${deal.discount_unit || ''}` 
                              : '50%'}
                        </div>
                        
                        {/* Store name below the discount */}
                        <div 
                          className="text-white font-semibold"
                          style={{ 
                            position: 'absolute',
                            left: '65%',
                            top: '50%',
                            transform: 'translate(-50%, -50%) rotate(90deg)',
                            fontSize: '12px',
                            textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                            whiteSpace: 'nowrap',
                            opacity: 0.95,
                          }}
                        >
                          {isRTL && deal.store_ar ? deal.store_ar : (deal.store || 'Store')}
                        </div>
                      </div>
                    );
                  })}

                  {/* Center circle with Gift icon */}
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border-4 border-[#111827] flex items-center justify-center shadow-lg z-10"
                  >
                    <Gift className="h-8 w-8 md:h-10 md:w-10 text-[#5FB57A]" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Info and Button */}
          <div
            className={`flex flex-col items-center lg:items-start gap-6 max-w-md ${
              isRTL ? "lg:items-end" : ""
            }`}
          >
            {/* Status Badge */}
            {user && !canSpin && (
              <Badge className="bg-[#EF4444] text-white border-0 rounded-xl px-4 py-2 text-lg">
                <Clock className={`h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}`} />
                {translations[language].spinToWin.alreadySpun}
              </Badge>
            )}

            {/* Countdown */}
            {user && !canSpin && timeUntilNextSpin && (
              <div
                className={`bg-white rounded-2xl border-2 border-[#111827] p-6 shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <p className="text-[#6B7280] mb-2">
                  {translations[language].spinToWin.nextSpin}:
                </p>
                <p className="text-2xl font-bold text-[#5FB57A]">
                  {timeUntilNextSpin}
                </p>
              </div>
            )}

            {/* Spin Button */}
            <Button
              onClick={handleSpin}
              disabled={isSpinning || (user && !canSpin)}
              className={`
                w-full lg:w-auto px-8 py-6 text-xl
                bg-[#5FB57A] text-white border-4 border-[#111827]
                hover:bg-[#4FA56A] rounded-2xl
                shadow-[6px_6px_0px_0px_rgba(17,24,39,1)]
                hover:shadow-[8px_8px_0px_0px_rgba(17,24,39,1)]
                transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]
              `}
              style={{ fontWeight: 700 }}
            >
              {!user ? (
                <>
                  <Gift className={`h-6 w-6 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {translations[language].spinToWin.signInToSpin}
                </>
              ) : isSpinning ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Sparkles
                      className={`h-6 w-6 ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                  </motion.div>
                  {translations[language].spinToWin.spinning}
                </>
              ) : (
                <>
                  <Trophy className={`h-6 w-6 ${isRTL ? "ml-2" : "mr-2"}`} />
                  {translations[language].spinToWin.spinButton}
                </>
              )}
            </Button>

            {/* Sign-in prompt */}
            {!user && (
              <p className="text-sm text-[#6B7280] text-center lg:text-left">
                {isRTL
                  ? "سجّل الدخول باستخدام رقم هاتفك للتدوير والفوز!"
                  : "Sign in with your phone number to spin and win!"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Prize Modal */}
      <AnimatePresence>
        {showPrizeModal && wonDeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPrizeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.5, rotate: 10 }}
              transition={{ type: "spring", duration: 0.5 }}
              className={`bg-white rounded-3xl border-4 border-[#111827] p-8 max-w-md w-full shadow-[12px_12px_0px_0px_rgba(17,24,39,1)] relative ${
                isRTL ? "text-right" : "text-left"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setShowPrizeModal(false)}
                className={`absolute top-4 ${
                  isRTL ? "left-4" : "right-4"
                } p-2 hover:bg-gray-100 rounded-full transition-colors`}
              >
                <X className="h-6 w-6 text-[#111827]" />
              </button>

              {/* Confetti effect */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 1,
                      y: 0,
                      x: Math.random() * 100 - 50,
                    }}
                    animate={{
                      opacity: 0,
                      y: -200,
                      rotate: Math.random() * 360,
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      ease: "easeOut",
                    }}
                    className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: wheelColors[i % wheelColors.length],
                    }}
                  />
                ))}
              </div>

              {/* Content */}
              <div className="text-center space-y-6">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: 3,
                  }}
                >
                  <Trophy className="h-24 w-24 text-[#5FB57A] mx-auto" />
                </motion.div>

                <h3 className="text-3xl font-bold text-[#111827]">
                  {translations[language].spinToWin.congratulations}
                </h3>

                <div className="bg-gradient-to-br from-[#E8F3E8] to-[#D1E7D1] rounded-2xl border-2 border-[#111827] p-6 space-y-4">
                  {/* Store Name */}
                  {wonDeal.store && (
                    <div className="flex items-center justify-center gap-2">
                      <div className="px-3 py-1 bg-white rounded-lg border border-[#5FB57A]">
                        <p className="text-sm font-semibold text-[#5FB57A]">
                          {isRTL && wonDeal.store_ar
                            ? wonDeal.store_ar
                            : wonDeal.store}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Deal Title */}
                  <div>
                    <p className="text-[#6B7280] text-sm mb-1">
                      {translations[language].spinToWin.youWon}:
                    </p>
                    <h4 className="text-xl font-bold text-[#111827]">
                      {isRTL && wonDeal.title_ar
                        ? wonDeal.title_ar
                        : wonDeal.title}
                    </h4>
                  </div>

                  {/* Discount Amount - Big and Bold */}
                  {(wonDeal.discount_percentage || wonDeal.discount_amount) && (
                    <div className="bg-white rounded-xl border-2 border-[#5FB57A] p-4">
                      <p className="text-5xl font-black text-[#5FB57A]">
                        {wonDeal.discount_percentage
                          ? `${wonDeal.discount_percentage}%`
                          : wonDeal.discount_amount}
                      </p>
                      <p className="text-xs text-[#6B7280] mt-1 uppercase tracking-wide">
                        {isRTL ? "خصم" : "DISCOUNT"}
                      </p>
                    </div>
                  )}

                  {/* Coupon Code */}
                  {wonDeal.code && (
                    <div className="bg-white rounded-xl border-2 border-[#111827] p-4">
                      <p className="text-xs text-[#6B7280] mb-1 uppercase tracking-wide">
                        {isRTL ? "كود الكوبون" : "COUPON CODE"}
                      </p>
                      <p className="text-2xl md:text-3xl font-bold text-[#111827] tracking-wider">
                        {wonDeal.code}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {wonDeal.code && (
                    <Button
                      onClick={() => copyCode(wonDeal.code!)}
                      className="flex-1 bg-[#5FB57A] text-white border-2 border-[#111827] hover:bg-[#4FA56A] rounded-xl shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] transition-all"
                      style={{ fontWeight: 600 }}
                    >
                      <Copy className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                      {translations[language].spinToWin.copyCode}
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setShowPrizeModal(false);
                      if (wonDeal.slug) {
                        window.location.href = `/deal/${wonDeal.slug}`;
                      }
                    }}
                    variant="outline"
                    className="flex-1 border-2 border-[#111827] text-[#111827] hover:bg-[#F0F7F0] rounded-xl"
                    style={{ fontWeight: 600 }}
                  >
                    {translations[language].spinToWin.viewDeal}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sign-in Modal */}
      <SignInModal open={showSignIn} onOpenChange={setShowSignIn} />
    </section>
  );
}
