import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load language from localStorage
    const savedLang = localStorage.getItem('tuut-language') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'ar')) {
      setLanguageState(savedLang);
    }
  }, []);

  useEffect(() => {
    // Update document direction and lang attribute
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('tuut-language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translation data
const translations = {
  en: {
    header: {
      deals: 'Deals',
      stores: 'Stores',
      products: 'Products',
      blog: 'Blog',
      searchPlaceholder: 'Search for deals, stores, or products...',
    },
    hero: {
      title: 'Smart Shopping Starts Here',
      subtitle: 'Find verified deals and coupons from 500+ top brands',
      findDeals: 'Find Deals',
      browseCoupons: 'Browse Coupons',
      statsDeals: 'Active Deals',
      statsStores: 'Top Stores',
      statsSavings: 'Avg. Savings',
    },
    featuredDeals: {
      title: 'Featured Deals',
      subtitle: 'Hand-picked deals that save you the most money',
      viewAll: 'View All Deals',
      verified: 'Verified',
      getCode: 'Get Code',
      viewDeal: 'View Deal',
      shopNow: 'Shop Now',
      expiresIn: 'Expires in',
      days: 'days',
      discount: 'DISCOUNT',
      applyCode: 'Apply Code',
      terms: '*Terms & conditions',
      deals: [
        {
          title: 'Flat 40% off*',
          store: 'Fashion Avenue',
          description: 'Save 40% on all fashion items.',
        },
        {
          title: 'Flat $60 off*',
          store: 'Tech Galaxy',
          description: 'Save $60 on all electronics.',
        },
        {
          title: 'Free Coffee*',
          store: 'Brew & Bites',
          description: 'Get free coffee with any order.',
        },
        {
          title: 'Buy 2 Get 1 Free*',
          store: 'Glow Cosmetics',
          description: 'Buy 2 beauty products, get 1 free.',
        },
        {
          title: 'Flat 50% off*',
          store: 'Audio Hub',
          description: 'Save 50% on premium headphones.',
        },
        {
          title: 'Shoes from $29*',
          store: 'Sports Pro',
          description: 'Athletic shoes starting at $29.',
        },
      ],
    },
    categories: {
      title: 'Browse by Category',
      subtitle: 'Find deals in your favorite shopping categories',
      deals: 'deals',
      deal: 'deal',
    },
    testimonials: {
      title: 'What Our Users Say',
      subtitle: 'Join thousands of smart shoppers saving money every day',
      totalSavings: 'Total Savings',
      happyUsers: 'Happy Users',
      averageRating: 'Average Rating',
      downloadApp: 'Download Our App',
      downloadSubtitle: 'Get exclusive mobile-only deals and notifications',
      downloadOn: 'Download on the',
      appStore: 'App Store',
      getItOn: 'GET IT ON',
      googlePlay: 'Google Play',
    },
    newsletter: {
      title: 'Never Miss a Deal',
      subtitle: 'Get the best deals and exclusive coupons delivered to your inbox',
      emailPlaceholder: 'Enter your email',
      subscribe: 'Subscribe',
      subscribing: 'Subscribing...',
      features: {
        exclusive: 'Exclusive deals & early access',
        weekly: 'Weekly roundup of best offers',
        personalized: 'Personalized recommendations',
      },
    },
    footer: {
      tagline: 'Your trusted source for verified deals and coupons from 500+ top brands.',
      popularStores: 'Popular Stores',
      topCategories: 'Top Categories',
      company: 'Company',
      about: 'About Us',
      contact: 'Contact',
      careers: 'Careers',
      press: 'Press',
      support: 'Support',
      help: 'Help Center',
      faq: 'FAQ',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      followUs: 'Follow Us',
      copyright: '© 2024 Tuut. All rights reserved.',
    },
  },
  ar: {
    header: {
      deals: 'العروض',
      stores: 'المتاجر',
      products: 'المنتجات',
      blog: 'المدونة',
      searchPlaceholder: 'ابحث عن العروض أو المتاجر أو المنتجات...',
    },
    hero: {
      title: 'التسوق الذكي يبدأ هنا',
      subtitle: 'اعثر على عروض وكوبونات موثقة من أكثر من 500 علامة تجارية رائدة',
      findDeals: 'ابحث عن العروض',
      browseCoupons: 'تصفح الكوبونات',
      statsDeals: 'العروض النشطة',
      statsStores: 'أفضل المتاجر',
      statsSavings: 'متوسط التوفير',
    },
    featuredDeals: {
      title: 'العروض المميزة',
      subtitle: 'عروض مختارة بعناية توفر لك أكبر قدر من المال',
      viewAll: 'عرض جميع العروض',
      verified: 'موثق',
      getCode: 'احصل على الكود',
      viewDeal: 'عرض التفاصيل',
      shopNow: 'تسوق الآن',
      expiresIn: 'ينتهي خلال',
      days: 'أيام',
      discount: 'خصم',
      applyCode: 'تطبيق الكود',
      terms: '*الشروط والأحكام',
      deals: [
        {
          title: 'خصم 40% مباشر*',
          store: 'أزياء أفينيو',
          description: 'وفر 40% على جميع منتجات الأزياء.',
        },
        {
          title: 'خصم 60 دولار مباشر*',
          store: 'تك جالاكسي',
          description: 'وفر 60 دولار على جميع الأجهزة الإلكترونية.',
        },
        {
          title: 'قهوة مجانية*',
          store: 'بريو آند بايتس',
          description: 'احصل على قهوة مجانية مع أي طلب.',
        },
        {
          title: 'اشتري 2 واحصل على 1 مجاناً*',
          store: 'جلو كوزمتيكس',
          description: 'اشتري منتجين تجميل واحصل على واحد مجاناً.',
        },
        {
          title: 'خصم 50% مباشر*',
          store: 'أوديو هاب',
          description: 'وفر 50% على سماعات الرأس المميزة.',
        },
        {
          title: 'أحذية من 29 دولار*',
          store: 'سبورتس برو',
          description: 'أحذية رياضية تبدأ من 29 دولار.',
        },
      ],
    },
    categories: {
      title: 'تصفح حسب الفئة',
      subtitle: 'اعثر على العروض في فئات التسوق المفضلة لديك',
      deals: 'عروض',
      deal: 'عرض',
    },
    testimonials: {
      title: 'ماذا يقول مستخدمونا',
      subtitle: 'انضم إلى آلاف المتسوقين الأذكياء الذين يوفرون المال كل يوم',
      totalSavings: 'إجمالي التوفير',
      happyUsers: 'مستخدمون سعداء',
      averageRating: 'متوسط التقييم',
      downloadApp: 'حمل التطبيق',
      downloadSubtitle: 'احصل على عروض حصرية للجوال وإشعارات فورية',
      downloadOn: 'حمله من',
      appStore: 'آب ستور',
      getItOn: 'حمله من',
      googlePlay: 'جوجل بلاي',
    },
    newsletter: {
      title: 'لا تفوت أي عرض',
      subtitle: 'احصل على أفضل العروض والكوبونات الحصرية في بريدك الإلكتروني',
      emailPlaceholder: 'أدخل بريدك الإلكتروني',
      subscribe: 'اشترك',
      subscribing: 'جاري الاشتراك...',
      features: {
        exclusive: 'عروض حصرية ووصول مبكر',
        weekly: 'ملخص أسبوعي لأفضل العروض',
        personalized: 'توصيات مخصصة',
      },
    },
    footer: {
      tagline: 'مصدرك الموثوق للعروض والكوبونات الموثقة من أكثر من 500 علامة تجارية رائدة.',
      popularStores: 'المتاجر الشائعة',
      topCategories: 'الفئات الأعلى',
      company: 'الشركة',
      about: 'من نحن',
      contact: 'اتصل بنا',
      careers: 'الوظائف',
      press: 'الصحافة',
      support: 'الدعم',
      help: 'مركز المساعدة',
      faq: 'الأسئلة الشائعة',
      terms: 'شروط الخدمة',
      privacy: 'سياسة الخصوصية',
      followUs: 'تابعنا',
      copyright: '© 2024 Tuut. جميع الحقوق محفوظة.',
    },
  },
};
