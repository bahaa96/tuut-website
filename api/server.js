import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { Hono } from 'hono';
import { renderToString } from 'react-dom/server';
import { stat, readFile } from 'fs/promises';
import { extname } from 'path';
import * as React from 'react';
import { createContext, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { Search, ChevronRight, ChevronLeft, Heart, Copy, Shirt, Footprints, Watch, Glasses, Laptop, Smartphone, Tablet, Headphones, Camera, Gamepad2, Monitor, Utensils, Coffee, Pizza, Wine, IceCream2, Plane, Hotel, Palmtree, Luggage, Map as Map$1, Sparkles, Brush, Gem, Dumbbell, Bike, Waves, Trophy, Home, Sofa, Flower, Hammer, Lamp, Pill, Baby, Leaf, Apple, BookOpen, GraduationCap, Palette, Music, Film, Car, Wrench, PawPrint, Dog, Cat, Package, Gift, Tags, ShoppingBag, TrendingUp, CheckCircle, XCircle, Shield, Zap, Award, ArrowRight, Store, Tag, Users, Star, Megaphone, Mail, ChevronDownIcon, CheckIcon, ChevronUpIcon, XIcon, ArrowLeft, SlidersHorizontal, X, Filter, ChevronDown, Grid, List, User, Calendar, Clock, Phone, Loader2, Globe, Languages, LogOut, PiggyBank, Menu, Chrome, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { toast } from 'sonner';
import { createClient as createClient$1 } from '@supabase/supabase-js';
import * as SelectPrimitive from '@radix-ui/react-select';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as LabelPrimitive from '@radix-ui/react-label';

const LanguageContext = createContext(void 0);
function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState("en");
  useEffect(() => {
    const savedLang = localStorage.getItem("tuut-language");
    if (savedLang && (savedLang === "en" || savedLang === "ar")) {
      setLanguageState(savedLang);
    }
  }, []);
  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
    document.documentElement.setAttribute("dir", language === "ar" ? "rtl" : "ltr");
  }, [language]);
  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem("tuut-language", lang);
  };
  const t = (key) => {
    const keys = key.split(".");
    let value = translations$1[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };
  const isRTL = language === "ar";
  return /* @__PURE__ */ jsx(LanguageContext.Provider, { value: { language, setLanguage, t, isRTL }, children });
}
function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
const translations$1 = {
  en: {
    header: {
      deals: "Deals",
      stores: "Stores",
      products: "Products",
      blog: "Shopping Guides",
      searchPlaceholder: "Search for deals, stores, or products..."
    },
    hero: {
      title: "Smart Shopping Starts Here",
      subtitle: "Find verified deals and coupons from 500+ top brands",
      findDeals: "Find Deals",
      browseCoupons: "Browse Coupons",
      statsDeals: "Active Deals",
      statsStores: "Top Stores",
      statsSavings: "Avg. Savings"
    },
    featuredDeals: {
      title: "Featured Deals",
      subtitle: "Hand-picked deals that save you the most money",
      viewAll: "View All Deals",
      verified: "Verified",
      getCode: "Get Code",
      viewDeal: "View Deal",
      shopNow: "Shop Now",
      expiresIn: "Expires in",
      days: "days",
      discount: "DISCOUNT",
      applyCode: "Copy Code",
      terms: "*Terms & conditions",
      deals: [
        {
          title: "Flat 40% off*",
          store: "Fashion Avenue",
          description: "Save 40% on all fashion items."
        },
        {
          title: "Flat $60 off*",
          store: "Tech Galaxy",
          description: "Save $60 on all electronics."
        },
        {
          title: "Free Coffee*",
          store: "Brew & Bites",
          description: "Get free coffee with any order."
        },
        {
          title: "Buy 2 Get 1 Free*",
          store: "Glow Cosmetics",
          description: "Buy 2 beauty products, get 1 free."
        },
        {
          title: "Flat 50% off*",
          store: "Audio Hub",
          description: "Save 50% on premium headphones."
        },
        {
          title: "Shoes from $29*",
          store: "Sports Pro",
          description: "Athletic shoes starting at $29."
        }
      ]
    },
    categories: {
      title: "Browse by Category",
      subtitle: "Find deals in your favorite shopping categories",
      deals: "deals",
      deal: "deal"
    },
    testimonials: {
      title: "What Our Users Say",
      subtitle: "Join thousands of smart shoppers saving money every day",
      totalSavings: "Total Savings",
      happyUsers: "Happy Users",
      averageRating: "Average Rating",
      downloadApp: "Download Our App",
      downloadSubtitle: "Get exclusive mobile-only deals and notifications",
      downloadOn: "Download on the",
      appStore: "App Store",
      getItOn: "GET IT ON",
      googlePlay: "Google Play"
    },
    newsletter: {
      title: "Never Miss a Deal",
      subtitle: "Get the best deals and exclusive coupons delivered to your inbox",
      emailPlaceholder: "Enter your email",
      subscribe: "Subscribe",
      subscribing: "Subscribing...",
      features: {
        exclusive: "Exclusive deals & early access",
        weekly: "Weekly roundup of best offers",
        personalized: "Personalized recommendations"
      }
    },
    footer: {
      tagline: "Your trusted source for verified deals and coupons from 500+ top brands.",
      popularStores: "Popular Stores",
      topCategories: "Top Categories",
      company: "Company",
      about: "About Us",
      contact: "Contact",
      careers: "Careers",
      press: "Press",
      support: "Support",
      help: "Help Center",
      faq: "FAQ",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      followUs: "Follow Us",
      copyright: "© 2024 Tuut. All rights reserved.",
      featuredDeals: "Featured Deals",
      viewAll: "View All",
      shoppingGuides: "Shopping Guides",
      topStores: "Top Stores"
    }
  },
  ar: {
    header: {
      deals: "العروض",
      stores: "المتاجر",
      products: "المنتجات",
      blog: "أدلة التسوق",
      searchPlaceholder: "ابحث عن العروض أو المتاجر أو المنتجات..."
    },
    hero: {
      title: "التسوق الذكي يبدأ هنا",
      subtitle: "اعثر على عروض وكوبونات موثقة من أكثر من 500 علامة تجارية رائدة",
      findDeals: "ابحث عن العروض",
      browseCoupons: "تصفح الكوبونات",
      statsDeals: "العروض النشطة",
      statsStores: "أفضل المتاجر",
      statsSavings: "متوسط التوفير"
    },
    featuredDeals: {
      title: "العروض المميزة",
      subtitle: "عروض مختارة بعناية توفر لك أكبر قدر من المال",
      viewAll: "عرض جميع العروض",
      verified: "موثق",
      getCode: "احصل على الكود",
      viewDeal: "عرض التفاصيل",
      shopNow: "تسوق الآن",
      expiresIn: "ينتهي خلال",
      days: "أيام",
      discount: "خصم",
      applyCode: "نسخ الكود",
      terms: "*الشروط والأحكام",
      deals: [
        {
          title: "خصم 40% مباشر*",
          store: "أزياء أفينيو",
          description: "وفر 40% على جميع منتجات الأزياء."
        },
        {
          title: "خصم 60 دولار مباشر*",
          store: "تك جالاكسي",
          description: "وفر 60 دولار على جميع الأجهزة الإلكترونية."
        },
        {
          title: "قهوة مجانية*",
          store: "بريو آند بايتس",
          description: "احصل على قهوة مجانية مع أي طلب."
        },
        {
          title: "اشتري 2 واحصل على 1 مجاناً*",
          store: "جلو كوزمتيكس",
          description: "اشتري منتجين تجميل واحصل على واحد مجاناً."
        },
        {
          title: "خصم 50% مباشر*",
          store: "أوديو هاب",
          description: "وفر 50% على سماعات الرأس المميزة."
        },
        {
          title: "أحذية من 29 دولار*",
          store: "سبورتس برو",
          description: "أحذية رياضية تبدأ من 29 دولار."
        }
      ]
    },
    categories: {
      title: "تصفح حسب الفئة",
      subtitle: "اعثر على العروض في فئات التسوق المفضلة لديك",
      deals: "عروض",
      deal: "عرض"
    },
    testimonials: {
      title: "ماذا يقول مستخدمونا",
      subtitle: "انضم إلى آلاف المتسوقين الأذكياء الذين يوفرون المال كل يوم",
      totalSavings: "إجمالي التوفير",
      happyUsers: "مستخدمون سعداء",
      averageRating: "متوسط التقييم",
      downloadApp: "حمل التطبيق",
      downloadSubtitle: "احصل على عروض حصرية للجوال وإشعارات فورية",
      downloadOn: "حمله من",
      appStore: "آب ستور",
      getItOn: "حمله من",
      googlePlay: "جوجل بلاي"
    },
    newsletter: {
      title: "لا تفوت أي عرض",
      subtitle: "احصل على أفضل العروض والكوبونات الحصرية في بريدك الإلكتروني",
      emailPlaceholder: "أدخل بريدك الإلكتروني",
      subscribe: "اشترك",
      subscribing: "جاري الاشتراك...",
      features: {
        exclusive: "عروض حصرية ووصول مبكر",
        weekly: "ملخص أسبوعي لأفضل العروض",
        personalized: "توصيات مخصصة"
      }
    },
    footer: {
      tagline: "مصدرك الموثوق للعروض والكوبونات الموثقة من أكثر من 500 علامة تجارية رائدة.",
      popularStores: "المتاجر الشائعة",
      topCategories: "الفئات الأعلى",
      company: "الشركة",
      about: "من نحن",
      contact: "اتصل بنا",
      careers: "الوظائف",
      press: "الصحافة",
      support: "الدعم",
      help: "مركز المساعدة",
      faq: "الأسئلة الشائعة",
      terms: "شروط الخدمة",
      privacy: "سياسة الخصوصية",
      followUs: "تابعنا",
      copyright: "© 2024 Tuut. جميع الحقوق محفوظة.",
      featuredDeals: "عروض مميزة",
      viewAll: "عرض الكل ←",
      shoppingGuides: "أدلة التسوق",
      topStores: "أفضل المتاجر"
    }
  }
};

const CountryContext = createContext(void 0);
function CountryProvider({ children }) {
  const [country, setCountryState] = useState(null);
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    fetchCountries();
  }, []);
  const fetchCountries = async () => {
    try {
      setIsLoading(true);
      const { fetchCountries: fetchCountriesAPI } = await Promise.resolve().then(() => api);
      const result = await fetchCountriesAPI();
      if (result.error) {
        console.error("Error fetching countries:", result.error);
        return;
      }
      const data = result.countries;
      if (data && data.length > 0) {
        console.log("Fetched countries from database:", data);
        setCountries(data);
        const savedCountryValue = localStorage.getItem("tuut-country");
        if (savedCountryValue) {
          const savedCountry = data.find((c) => c.value === savedCountryValue);
          if (savedCountry) {
            setCountryState(savedCountry);
          } else {
            setCountryState(data[0]);
          }
        } else {
          setCountryState(data[0]);
        }
      }
    } catch (error) {
      console.error("Error in fetchCountries:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const setCountry = (newCountry) => {
    setCountryState(newCountry);
    localStorage.setItem("tuut-country", newCountry.value);
  };
  return /* @__PURE__ */ jsx(CountryContext.Provider, { value: { country, countries, setCountry, isLoading }, children });
}
function useCountry() {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
}

const projectId = "oluyzqunbbqaxalodhdg";
const publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sdXl6cXVuYmJxYXhhbG9kaGRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTMwOTcsImV4cCI6MjA2MTAyOTA5N30.1SGmTzrAB4FLgPfOIP2DLP_ieNVqSQVtiBtjJ5eRJOM";

const info = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  projectId,
  publicAnonKey
}, Symbol.toStringTag, { value: 'Module' }));

const USE_MOCK_AUTH = true;
const AuthContext = createContext(void 0);
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    checkUser();
  }, []);
  async function checkUser() {
    try {
      const token = localStorage.getItem("session_token");
      const userData = localStorage.getItem("user");
      if (!token || !userData) {
        setUser(null);
        setLoading(false);
        return;
      }
      if (USE_MOCK_AUTH) {
        console.log("🔧 MOCK MODE: Using localStorage session");
        setUser(JSON.parse(userData));
        setLoading(false);
        return;
      }
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/auth/user`,
        {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem("session_token");
        localStorage.removeItem("user");
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking user session:", error);
      localStorage.removeItem("session_token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }
  async function signIn(phone) {
    try {
      let formattedPhone = phone.trim();
      if (!formattedPhone.startsWith("+")) {
        formattedPhone = "+" + formattedPhone;
      }
      if (USE_MOCK_AUTH) {
        console.log("🔧 MOCK MODE: Creating fake session for phone:", formattedPhone);
        const mockUser = {
          id: `mock-user-${Date.now()}`,
          phone: formattedPhone
        };
        const mockToken = `mock-token-${Date.now()}`;
        localStorage.setItem("session_token", mockToken);
        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);
        console.log("✅ MOCK MODE: User signed in successfully:", mockUser);
        return { success: true };
      }
      console.log("🌐 Calling /auth/signin API with phone:", formattedPhone);
      const url = `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/auth/signin`;
      console.log("🔗 URL:", url);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone: formattedPhone })
      });
      console.log("📡 Response status:", response.status);
      const data = await response.json();
      console.log("📦 Response data:", data);
      if (!response.ok) {
        console.error("❌ Error response:", data);
        return { success: false, error: data.error || "Failed to sign in" };
      }
      if (data.access_token && data.user) {
        console.log("💾 Saving session token and user data to localStorage");
        localStorage.setItem("session_token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        console.log("✅ User signed in successfully:", data.user);
      }
      return { success: true };
    } catch (error) {
      console.error("❌ Exception in signIn:", error);
      return { success: false, error: error.message || "Failed to sign in" };
    }
  }
  async function signOut() {
    try {
      const token = localStorage.getItem("session_token");
      if (token) {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/auth/signout`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );
      }
      localStorage.removeItem("session_token");
      localStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      localStorage.removeItem("session_token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }
  return /* @__PURE__ */ jsx(
    AuthContext.Provider,
    {
      value: {
        user,
        loading,
        signIn,
        signOut,
        isAuthenticated: !!user
      },
      children
    }
  );
}
function useAuth() {
  const context = useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

const SSRDataContext = createContext({
  data: {}
});
function SSRDataProvider({ children, data }) {
  return /* @__PURE__ */ jsx(SSRDataContext.Provider, { value: { data }, children });
}
function useSSRData() {
  const context = useContext(SSRDataContext);
  if (!context) {
    throw new Error("useSSRData must be used within an SSRDataProvider");
  }
  return context;
}
function setGlobalSSRData(data) {
}

const RouterContext = createContext(void 0);
function RouterProvider({
  children,
  initialPath
}) {
  const [currentPath, setCurrentPath] = useState(
    typeof window !== "undefined" ? window.location.pathname : initialPath || "/"
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleNavigation = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handleNavigation);
    return () => {
      window.removeEventListener("popstate", handleNavigation);
    };
  }, []);
  useEffect(() => {
  }, [currentPath]);
  const navigate = (path) => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", path);
    }
    setCurrentPath(path);
  };
  return /* @__PURE__ */ jsx(RouterContext.Provider, { value: { currentPath, navigate }, children });
}
function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within RouterProvider");
  }
  return context;
}
function Link({
  to,
  children,
  className
}) {
  const { navigate } = useRouter();
  const handleClick = (e) => {
    e.preventDefault();
    navigate(to);
  };
  return /* @__PURE__ */ jsx("a", { href: to, onClick: handleClick, className, children });
}

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ref,
      ...props
    }
  );
});
Button.displayName = "Button";

function Hero() {
  const { t, isRTL } = useLanguage();
  const { navigate } = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  return /* @__PURE__ */ jsx("section", { className: "relative bg-background pt-8 pb-4 md:pt-12 md:pb-6 overflow-hidden flex items-center", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-[800px] px-4 md:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsx(
      "h1",
      {
        className: "text-[#111827] mb-2",
        style: { fontSize: "48px", fontWeight: 700, lineHeight: 1.2 },
        children: isRTL ? "وفر أكثر مع Tuut" : "Save more with Tuut"
      }
    ),
    /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] mb-4", style: { fontSize: "18px" }, children: isRTL ? "اكتشف أفضل العروض والكوبونات من أكثر من 500 متجر" : "Discover the best deals and coupons from 500+ top brands" }),
    /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto", children: /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "relative flex gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsx(Search, { className: `absolute top-1/2 -translate-y-1/2 h-6 w-6 text-[#6B7280] ${isRTL ? "right-6" : "left-6"}` }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            placeholder: isRTL ? "ابحث عن المتاجر أو العروض أو الفئات..." : "Search for stores, deals, or categories...",
            className: `h-16 ${isRTL ? "pr-16 text-right" : "pl-16"} text-lg border-2 border-[#111827] rounded-2xl shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] focus-visible:outline-none transition-all`
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          className: "h-16 px-8 bg-[#5FB57A] hover:bg-[#4FA468] text-white rounded-xl border-2 border-[#111827] shadow-[6px_6px_0px_0px_rgba(17,24,39,1)] hover:shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all",
          children: isRTL ? "بحث" : "Search"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: `mt-3 flex flex-wrap items-center justify-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`, children: [
      /* @__PURE__ */ jsx("span", { className: "text-[#6B7280] text-sm", children: isRTL ? "شائع:" : "Popular:" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/search?q=" + encodeURIComponent(isRTL ? "أمازون" : "Amazon")),
          className: "text-[#111827] text-sm bg-white px-4 py-2 rounded-lg border-2 border-[#111827] hover:bg-[#E8F3E8] transition-colors",
          children: isRTL ? "أمازون" : "Amazon"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/search?q=" + encodeURIComponent(isRTL ? "نون" : "Noon")),
          className: "text-[#111827] text-sm bg-white px-4 py-2 rounded-lg border-2 border-[#111827] hover:bg-[#E8F3E8] transition-colors",
          children: isRTL ? "نون" : "Noon"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/search?q=" + encodeURIComponent(isRTL ? "إلكترونيات" : "Electronics")),
          className: "text-[#111827] text-sm bg-white px-4 py-2 rounded-lg border-2 border-[#111827] hover:bg-[#E8F3E8] transition-colors",
          children: isRTL ? "إلكترونيات" : "Electronics"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => navigate("/search?q=" + encodeURIComponent(isRTL ? "أزياء" : "Fashion")),
          className: "text-[#111827] text-sm bg-white px-4 py-2 rounded-lg border-2 border-[#111827] hover:bg-[#E8F3E8] transition-colors",
          children: isRTL ? "أزياء" : "Fashion"
        }
      )
    ] })
  ] }) }) });
}

function getCountryName(country, language = "en") {
  if (!country) return language === "en" ? "Country" : "دولة";
  return country.label[language] || (language === "en" ? "Country" : "دولة");
}
function getCountryValue(country) {
  if (!country) return "";
  return country.value || "";
}
function getCountryImage(country) {
  if (!country) return "";
  return country.image_url || "";
}
function getCountryId(country) {
  if (!country) return "";
  return country.id || "";
}

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25`;
async function fetchFeaturedDeals(options = {}) {
  const params = new URLSearchParams();
  if (options.country) params.append("country", options.country);
  const url = `${BASE_URL}/featured-deals${params.toString() ? "?" + params.toString() : ""}`;
  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${publicAnonKey}`
    }
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
async function fetchCountries() {
  const url = `${BASE_URL}/countries`;
  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${publicAnonKey}`
    }
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

const api = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  fetchCountries,
  fetchFeaturedDeals
}, Symbol.toStringTag, { value: 'Module' }));

async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.log("Clipboard API failed, trying fallback method");
    }
  }
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    textArea.setAttribute("readonly", "");
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999);
    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Failed to copy text:", err);
    return false;
  }
}

const translations = {
  en: {
    featuredDeals: {
      deals: [
        { title: "Flat 40% off*", store: "Fashion Avenue", description: "Save 40% on all fashion items." },
        { title: "Flat $60 off*", store: "Tech Galaxy", description: "Save $60 on all electronics." },
        { title: "Free Coffee*", store: "Brew & Bites", description: "Get free coffee with any order." },
        { title: "Buy 2 Get 1 Free*", store: "Glow Cosmetics", description: "Buy 2 beauty products, get 1 free." },
        { title: "Flat 50% off*", store: "Audio Hub", description: "Save 50% on premium headphones." },
        { title: "Shoes from $29*", store: "Sports Pro", description: "Athletic shoes starting at $29." }
      ]
    }
  },
  ar: {
    featuredDeals: {
      deals: [
        { title: "خصم 40% مباشر*", store: "أزياء أفينيو", description: "وفر 40% على جميع منتجات الأزياء." },
        { title: "خصم 60 دولار مباشر*", store: "تك جالاكسي", description: "وفر 60 دولار على جميع الأجهزة الإلكترونية." },
        { title: "قهوة مجانية*", store: "بريو آند بايتس", description: "احصل على قهوة مجانية مع أي طلب." },
        { title: "اشتري 2 واحصل على 1 مجاناً*", store: "جلو كوزمتيكس", description: "اشتري منتجين تجميل واحصل على واحد مجاناً." },
        { title: "خصم 50% مباشر*", store: "أوديو هاب", description: "وفر 50% على سماعات الرأس المميزة." },
        { title: "أحذية من 29 دولار*", store: "سبورتس برو", description: "أحذية رياضية تبدأ من 29 دولار." }
      ]
    }
  }
};
function FeaturedDeals() {
  const { t, isRTL, language } = useLanguage();
  const { country } = useCountry();
  const [savedDeals, setSavedDeals] = useState(/* @__PURE__ */ new Set());
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  useEffect(() => {
    const fetchDealsData = async () => {
      try {
        setLoading(true);
        const countryValue = getCountryValue(country);
        console.log("Fetching featured deals for country:", countryValue);
        const result = await fetchFeaturedDeals({
          country: countryValue || void 0
        });
        console.log("Featured deals API result:", result);
        console.log("First deal structure:", result.deals?.[0]);
        if (result.error) {
          console.error("Error fetching featured deals:", result.error);
          setError(result.error);
          const translatedDeals = translations[language].featuredDeals.deals;
          setDeals([
            {
              id: 1,
              title: translatedDeals[0].title,
              store: translatedDeals[0].store,
              discount: "40%",
              description: translatedDeals[0].description,
              code: "FASHION40",
              type: "coupon",
              color: "#7EC89A"
            },
            {
              id: 2,
              title: translatedDeals[1].title,
              store: translatedDeals[1].store,
              discount: "60%",
              description: translatedDeals[1].description,
              code: "TECH60",
              type: "coupon",
              color: "#5FB57A"
            },
            {
              id: 3,
              title: translatedDeals[2].title,
              store: translatedDeals[2].store,
              discount: "FREE",
              description: translatedDeals[2].description,
              code: "FREEBREW",
              type: "coupon",
              color: "#9DD9B3"
            },
            {
              id: 4,
              title: translatedDeals[3].title,
              store: translatedDeals[3].store,
              discount: "33%",
              description: translatedDeals[3].description,
              code: "BEAUTY3",
              type: "coupon",
              color: "#BCF0CC"
            },
            {
              id: 5,
              title: translatedDeals[4].title,
              store: translatedDeals[4].store,
              discount: "50%",
              description: translatedDeals[4].description,
              code: "AUDIO50",
              type: "coupon",
              color: "#7EC89A"
            },
            {
              id: 6,
              title: translatedDeals[5].title,
              store: translatedDeals[5].store,
              discount: "70%",
              description: translatedDeals[5].description,
              code: "SPORTS29",
              type: "coupon",
              color: "#5FB57A"
            }
          ]);
        } else if (result.deals && result.deals.length > 0) {
          const transformedDeals = result.deals.map((item, index) => {
            console.log(`Processing deal ${index}:`, item);
            const deal = item.deals;
            const store = deal?.stores;
            if (!deal) {
              console.warn(`Skipping deal ${index} - no deal data`);
              return null;
            }
            if (!deal.title_en && !deal.title_ar) {
              console.warn(`Skipping deal ${index} - no title`);
              return null;
            }
            return {
              id: item.id || index,
              title_en: deal?.title_en || deal?.title_ar || "Special Deal",
              title_ar: deal?.title_ar || deal?.title_en || "عرض خاص",
              store: store?.name || store?.name_ar || "Store",
              store_ar: store?.name_ar || store?.name || "متجر",
              discount: deal?.discount_percentage || deal?.discount_amount || "0%",
              description: deal?.description || deal?.description_ar || "",
              description_ar: deal?.description_ar || deal?.description || "",
              code: deal?.code || "",
              type: deal?.code ? "coupon" : "sale",
              color: ["#7EC89A", "#5FB57A", "#9DD9B3", "#BCF0CC"][index % 4],
              slug: deal?.slug || `deal-${item.id || index}`
            };
          }).filter(Boolean);
          console.log("Transformed deals:", transformedDeals);
          console.log(`Valid deals: ${transformedDeals.length} out of ${result.deals.length}`);
          if (transformedDeals.length > 0) {
            setDeals(transformedDeals);
            setError(null);
          } else {
            console.log("No valid deals after transformation, using fallback");
            const translatedDeals = translations[language].featuredDeals.deals;
            setDeals([
              {
                id: 1,
                title: translatedDeals[0].title,
                store: translatedDeals[0].store,
                discount: "40%",
                description: translatedDeals[0].description,
                code: "FASHION40",
                type: "coupon",
                color: "#7EC89A"
              },
              {
                id: 2,
                title: translatedDeals[1].title,
                store: translatedDeals[1].store,
                discount: "60%",
                description: translatedDeals[1].description,
                code: "TECH60",
                type: "coupon",
                color: "#5FB57A"
              },
              {
                id: 3,
                title: translatedDeals[2].title,
                store: translatedDeals[2].store,
                discount: "FREE",
                description: translatedDeals[2].description,
                code: "FREEBREW",
                type: "coupon",
                color: "#9DD9B3"
              },
              {
                id: 4,
                title: translatedDeals[3].title,
                store: translatedDeals[3].store,
                discount: "33%",
                description: translatedDeals[3].description,
                code: "BEAUTY3",
                type: "coupon",
                color: "#BCF0CC"
              },
              {
                id: 5,
                title: translatedDeals[4].title,
                store: translatedDeals[4].store,
                discount: "50%",
                description: translatedDeals[4].description,
                code: "AUDIO50",
                type: "coupon",
                color: "#7EC89A"
              },
              {
                id: 6,
                title: translatedDeals[5].title,
                store: translatedDeals[5].store,
                discount: "70%",
                description: translatedDeals[5].description,
                code: "SPORTS29",
                type: "coupon",
                color: "#5FB57A"
              }
            ]);
          }
        } else {
          console.log("No deals returned from API, using fallback deals");
          const translatedDeals = translations[language].featuredDeals.deals;
          setDeals([
            {
              id: 1,
              title: translatedDeals[0].title,
              store: translatedDeals[0].store,
              discount: "40%",
              description: translatedDeals[0].description,
              code: "FASHION40",
              type: "coupon",
              color: "#7EC89A"
            },
            {
              id: 2,
              title: translatedDeals[1].title,
              store: translatedDeals[1].store,
              discount: "60%",
              description: translatedDeals[1].description,
              code: "TECH60",
              type: "coupon",
              color: "#5FB57A"
            },
            {
              id: 3,
              title: translatedDeals[2].title,
              store: translatedDeals[2].store,
              discount: "FREE",
              description: translatedDeals[2].description,
              code: "FREEBREW",
              type: "coupon",
              color: "#9DD9B3"
            },
            {
              id: 4,
              title: translatedDeals[3].title,
              store: translatedDeals[3].store,
              discount: "33%",
              description: translatedDeals[3].description,
              code: "BEAUTY3",
              type: "coupon",
              color: "#BCF0CC"
            },
            {
              id: 5,
              title: translatedDeals[4].title,
              store: translatedDeals[4].store,
              discount: "50%",
              description: translatedDeals[4].description,
              code: "AUDIO50",
              type: "coupon",
              color: "#7EC89A"
            },
            {
              id: 6,
              title: translatedDeals[5].title,
              store: translatedDeals[5].store,
              discount: "70%",
              description: translatedDeals[5].description,
              code: "SPORTS29",
              type: "coupon",
              color: "#5FB57A"
            }
          ]);
          setError(null);
        }
      } catch (err) {
        console.error("Error in fetchDeals:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        const translatedDeals = translations[language].featuredDeals.deals;
        setDeals([
          {
            id: 1,
            title: translatedDeals[0].title,
            store: translatedDeals[0].store,
            discount: "40%",
            description: translatedDeals[0].description,
            code: "FASHION40",
            type: "coupon",
            color: "#7EC89A"
          },
          {
            id: 2,
            title: translatedDeals[1].title,
            store: translatedDeals[1].store,
            discount: "60%",
            description: translatedDeals[1].description,
            code: "TECH60",
            type: "coupon",
            color: "#5FB57A"
          },
          {
            id: 3,
            title: translatedDeals[2].title,
            store: translatedDeals[2].store,
            discount: "FREE",
            description: translatedDeals[2].description,
            code: "FREEBREW",
            type: "coupon",
            color: "#9DD9B3"
          },
          {
            id: 4,
            title: translatedDeals[3].title,
            store: translatedDeals[3].store,
            discount: "33%",
            description: translatedDeals[3].description,
            code: "BEAUTY3",
            type: "coupon",
            color: "#BCF0CC"
          },
          {
            id: 5,
            title: translatedDeals[4].title,
            store: translatedDeals[4].store,
            discount: "50%",
            description: translatedDeals[4].description,
            code: "AUDIO50",
            type: "coupon",
            color: "#7EC89A"
          },
          {
            id: 6,
            title: translatedDeals[5].title,
            store: translatedDeals[5].store,
            discount: "70%",
            description: translatedDeals[5].description,
            code: "SPORTS29",
            type: "coupon",
            color: "#5FB57A"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchDealsData();
  }, [language, country]);
  useEffect(() => {
    checkScrollButtons();
  }, [scrollPosition, deals]);
  const checkScrollButtons = () => {
    const container = document.getElementById("deals-scroll-container");
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };
  const scroll = (direction) => {
    const container = document.getElementById("deals-scroll-container");
    if (container) {
      const scrollAmount = 600;
      const newPosition = direction === "left" ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount;
      container.scrollTo({
        left: newPosition,
        behavior: "smooth"
      });
      setTimeout(() => {
        setScrollPosition(container.scrollLeft);
      }, 300);
    }
  };
  const toggleSave = (dealId) => {
    setSavedDeals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dealId)) {
        newSet.delete(dealId);
        toast.success(isRTL ? "تم إزالة العرض من المفضلة" : "Deal removed from favorites");
      } else {
        newSet.add(dealId);
        toast.success(isRTL ? "تم حفظ العرض في المفضلة!" : "Deal saved to favorites!");
      }
      return newSet;
    });
  };
  const copyCode = async (code, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const success = await copyToClipboard(code);
    if (success) {
      toast.success(isRTL ? `تم نسخ الكود "${code}"!` : `Code "${code}" copied!`);
    } else {
      toast.error(isRTL ? `فشل نسخ الكود` : `Failed to copy code`);
    }
  };
  return /* @__PURE__ */ jsxs("section", { id: "featured-deals", className: "py-12 md:py-16 bg-background", children: [
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between mb-10 ${isRTL ? "flex-row-reverse" : ""}`, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-2 text-[#111827]", style: { fontSize: "36px", fontWeight: 700 }, children: t("featuredDeals.title") }),
          /* @__PURE__ */ jsx("p", { className: "text-[#6B7280]", children: t("featuredDeals.subtitle") })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/deals", children: /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            className: "hidden md:flex border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white rounded-xl",
            children: t("featuredDeals.viewAll")
          }
        ) })
      ] }),
      loading ? /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6", children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "h-64 bg-gray-100 rounded-2xl border-2 border-[#111827] animate-pulse"
        },
        i
      )) }) : deals.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center py-12", children: /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] mb-4", children: isRTL ? "لا توجد عروض متا��ة حالياً" : "No deals available at the moment" }) }) : /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        canScrollLeft && /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => scroll(isRTL ? "right" : "left"),
            className: `absolute ${isRTL ? "right-0" : "left-0"} top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all p-0 hidden md:flex items-center justify-center`,
            style: isRTL ? { marginRight: "-24px" } : { marginLeft: "-24px" },
            children: isRTL ? /* @__PURE__ */ jsx(ChevronRight, { className: "h-6 w-6 text-[#111827]" }) : /* @__PURE__ */ jsx(ChevronLeft, { className: "h-6 w-6 text-[#111827]" })
          }
        ),
        canScrollRight && /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => scroll(isRTL ? "left" : "right"),
            className: `absolute ${isRTL ? "left-0" : "right-0"} top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all p-0 hidden md:flex items-center justify-center`,
            style: isRTL ? { marginLeft: "-24px" } : { marginRight: "-24px" },
            children: isRTL ? /* @__PURE__ */ jsx(ChevronLeft, { className: "h-6 w-6 text-[#111827]" }) : /* @__PURE__ */ jsx(ChevronRight, { className: "h-6 w-6 text-[#111827]" })
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            id: "deals-scroll-container",
            className: "overflow-x-auto scrollbar-hide",
            onScroll: (e) => {
              setScrollPosition(e.currentTarget.scrollLeft);
              checkScrollButtons();
            },
            style: {
              scrollbarWidth: "none",
              msOverflowStyle: "none"
            },
            dir: isRTL ? "rtl" : "ltr",
            children: /* @__PURE__ */ jsx("div", { className: "grid grid-rows-2 grid-flow-col gap-6 pb-2", children: deals.map((deal) => /* @__PURE__ */ jsxs(
              Link,
              {
                to: `/deal/${deal.slug || deal.id}`,
                className: "group relative bg-white rounded-2xl overflow-hidden border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all w-[320px] md:w-[360px] block",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: `absolute ${isRTL ? "right-0" : "left-0"} top-0 bottom-0 w-[100px] flex items-center justify-center`, style: { backgroundColor: deal.color }, children: [
                    /* @__PURE__ */ jsx("div", { className: `absolute ${isRTL ? "left-0" : "right-0"} top-0 bottom-0 w-2 flex flex-col justify-around`, children: [...Array(12)].map((_, i) => /* @__PURE__ */ jsx("div", { className: `w-3 h-3 bg-white rounded-full ${isRTL ? "-ml-1.5" : "-mr-1.5"}` }, i)) }),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "text-[#111827] tracking-[0.3em]",
                        style: {
                          writingMode: "vertical-rl",
                          textOrientation: "mixed",
                          fontSize: "18px",
                          fontWeight: 700,
                          transform: "rotate(180deg)"
                        },
                        children: t("featuredDeals.discount")
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: `${isRTL ? "mr-[100px]" : "ml-[100px]"} p-6 relative`, children: [
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSave(deal.id);
                        },
                        className: `absolute top-4 ${isRTL ? "left-4" : "right-4"} p-2 rounded-full hover:bg-[#F0F7F0] transition-colors z-10`,
                        children: /* @__PURE__ */ jsx(
                          Heart,
                          {
                            className: `h-5 w-5 transition-colors ${savedDeals.has(deal.id) ? "fill-[#EF4444] text-[#EF4444]" : "text-[#9CA3AF]"}`
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: `${isRTL ? "pl-8" : "pr-8"}`, children: [
                      /* @__PURE__ */ jsx("h3", { className: "mb-3 text-[#111827]", style: { fontSize: "20px", fontWeight: 600 }, children: isRTL && deal.title_ar ? deal.title_ar : deal.title_en }),
                      deal.code && /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: "text-[#111827] tracking-wide mb-3",
                          style: { fontSize: "24px", fontWeight: 700 },
                          children: deal.code
                        }
                      ) }),
                      /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] text-sm mb-2", children: isRTL && deal.description_ar ? deal.description_ar : deal.description_en }),
                      /* @__PURE__ */ jsx(
                        "a",
                        {
                          href: "#",
                          className: "text-sm text-[#5FB57A] hover:underline inline-block mb-6",
                          children: t("featuredDeals.terms")
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxs(
                      Button,
                      {
                        onClick: (e) => deal.code && copyCode(deal.code, e),
                        className: "w-full bg-white text-[#111827] border-2 border-[#111827] hover:bg-[#F0F7F0] rounded-xl",
                        style: { fontWeight: 600 },
                        children: [
                          /* @__PURE__ */ jsx(Copy, { className: `h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}` }),
                          t("featuredDeals.applyCode")
                        ]
                      }
                    )
                  ] })
                ]
              },
              deal.id
            )) })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      ` })
  ] });
}

let supabaseClient = null;
function createClient() {
  if (supabaseClient) {
    return supabaseClient;
  }
  const supabaseUrl = `https://${projectId}.supabase.co`;
  supabaseClient = createClient$1(supabaseUrl, publicAnonKey);
  return supabaseClient;
}

const client = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  createClient
}, Symbol.toStringTag, { value: 'Module' }));

function getCategoryIcon(categoryName) {
  const name = categoryName.toLowerCase();
  if (name.includes("fashion") || name.includes("clothing") || name.includes("apparel")) {
    return Shirt;
  }
  if (name.includes("shoe") || name.includes("footwear")) {
    return Footprints;
  }
  if (name.includes("accessories") || name.includes("watch") || name.includes("jewelry")) {
    return Watch;
  }
  if (name.includes("glasses") || name.includes("eyewear") || name.includes("sunglass")) {
    return Glasses;
  }
  if (name.includes("electron") || name.includes("tech") || name.includes("computer") || name.includes("laptop")) {
    return Laptop;
  }
  if (name.includes("phone") || name.includes("mobile") || name.includes("smartphone")) {
    return Smartphone;
  }
  if (name.includes("tablet") || name.includes("ipad")) {
    return Tablet;
  }
  if (name.includes("headphone") || name.includes("audio") || name.includes("speaker")) {
    return Headphones;
  }
  if (name.includes("camera") || name.includes("photo")) {
    return Camera;
  }
  if (name.includes("gaming") || name.includes("game") || name.includes("console")) {
    return Gamepad2;
  }
  if (name.includes("monitor") || name.includes("display") || name.includes("screen")) {
    return Monitor;
  }
  if (name.includes("food") || name.includes("dining") || name.includes("restaurant") || name.includes("meal")) {
    return Utensils;
  }
  if (name.includes("coffee") || name.includes("cafe") || name.includes("drink") || name.includes("beverage")) {
    return Coffee;
  }
  if (name.includes("pizza")) {
    return Pizza;
  }
  if (name.includes("wine") || name.includes("alcohol") || name.includes("bar")) {
    return Wine;
  }
  if (name.includes("ice cream") || name.includes("dessert") || name.includes("sweet")) {
    return IceCream2;
  }
  if (name.includes("travel") || name.includes("flight") || name.includes("airline")) {
    return Plane;
  }
  if (name.includes("hotel") || name.includes("accommodation") || name.includes("resort")) {
    return Hotel;
  }
  if (name.includes("vacation") || name.includes("beach") || name.includes("tropical")) {
    return Palmtree;
  }
  if (name.includes("luggage") || name.includes("baggage") || name.includes("suitcase")) {
    return Luggage;
  }
  if (name.includes("tour") || name.includes("map") || name.includes("navigation")) {
    return Map$1;
  }
  if (name.includes("beauty") || name.includes("makeup") || name.includes("cosmetic")) {
    return Sparkles;
  }
  if (name.includes("hair") || name.includes("salon")) {
    return Brush;
  }
  if (name.includes("jewelry") || name.includes("jewellery") || name.includes("gem")) {
    return Gem;
  }
  if (name.includes("sport") || name.includes("fitness") || name.includes("gym") || name.includes("exercise")) {
    return Dumbbell;
  }
  if (name.includes("bike") || name.includes("cycling") || name.includes("bicycle")) {
    return Bike;
  }
  if (name.includes("swim") || name.includes("pool") || name.includes("water sport")) {
    return Waves;
  }
  if (name.includes("trophy") || name.includes("award") || name.includes("competition")) {
    return Trophy;
  }
  if (name.includes("home") || name.includes("house") || name.includes("household")) {
    return Home;
  }
  if (name.includes("furniture") || name.includes("sofa") || name.includes("couch")) {
    return Sofa;
  }
  if (name.includes("garden") || name.includes("outdoor") || name.includes("plant")) {
    return Flower;
  }
  if (name.includes("tool") || name.includes("hardware") || name.includes("diy")) {
    return Hammer;
  }
  if (name.includes("decor") || name.includes("decoration") || name.includes("lamp")) {
    return Lamp;
  }
  if (name.includes("health") || name.includes("wellness") || name.includes("medical")) {
    return Heart;
  }
  if (name.includes("pharmacy") || name.includes("medicine") || name.includes("drug")) {
    return Pill;
  }
  if (name.includes("baby") || name.includes("infant") || name.includes("child care")) {
    return Baby;
  }
  if (name.includes("organic") || name.includes("natural") || name.includes("eco")) {
    return Leaf;
  }
  if (name.includes("nutrition") || name.includes("vitamin") || name.includes("supplement")) {
    return Apple;
  }
  if (name.includes("book") || name.includes("reading") || name.includes("literature")) {
    return BookOpen;
  }
  if (name.includes("education") || name.includes("school") || name.includes("college") || name.includes("university")) {
    return GraduationCap;
  }
  if (name.includes("art") || name.includes("craft") || name.includes("creative")) {
    return Palette;
  }
  if (name.includes("music") || name.includes("audio")) {
    return Music;
  }
  if (name.includes("movie") || name.includes("film") || name.includes("entertainment")) {
    return Film;
  }
  if (name.includes("car") || name.includes("auto") || name.includes("vehicle")) {
    return Car;
  }
  if (name.includes("repair") || name.includes("mechanic") || name.includes("maintenance")) {
    return Wrench;
  }
  if (name.includes("pet") || name.includes("animal")) {
    return PawPrint;
  }
  if (name.includes("dog") || name.includes("puppy") || name.includes("canine")) {
    return Dog;
  }
  if (name.includes("cat") || name.includes("kitten") || name.includes("feline")) {
    return Cat;
  }
  if (name.includes("toy") || name.includes("kid") || name.includes("children") || name.includes("baby")) {
    return Package;
  }
  if (name.includes("gift") || name.includes("present")) {
    return Gift;
  }
  if (name.includes("deal") || name.includes("coupon") || name.includes("discount")) {
    return Tags;
  }
  return ShoppingBag;
}
function CategoryGrid() {
  const { t, isRTL } = useLanguage();
  const { navigate } = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  useEffect(() => {
    async function fetchCategories() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from("categories").select("*").order("id", { ascending: true });
        if (error) {
          console.error("Error fetching categories from Supabase:", error);
          console.log("Using default categories as fallback");
        } else if (data && data.length > 0) {
          console.log("Successfully fetched categories from Supabase:", data);
          setCategories(data);
        } else {
          console.log("No categories found in database, using defaults");
        }
      } catch (error) {
        console.error("Unexpected error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);
  useEffect(() => {
    checkScrollButtons();
  }, [scrollPosition, categories]);
  const checkScrollButtons = () => {
    const container = document.getElementById("category-scroll-container");
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };
  const scroll = (direction) => {
    const container = document.getElementById("category-scroll-container");
    if (container) {
      const scrollAmount = 400;
      const newPosition = direction === "left" ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount;
      container.scrollTo({
        left: newPosition,
        behavior: "smooth"
      });
      setTimeout(() => {
        setScrollPosition(container.scrollLeft);
      }, 300);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsx("section", { className: "py-12 md:py-16 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-2 text-[#111827]", style: { fontSize: "36px", fontWeight: 700 }, children: t("categories.title") }),
        /* @__PURE__ */ jsx("p", { className: "text-[#6B7280]", children: t("categories.subtitle") })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl p-6 border-2 border-[#E5E7EB] h-32 animate-pulse" }, i)) })
    ] }) });
  }
  return /* @__PURE__ */ jsxs("section", { className: "py-12 md:py-16 bg-white", children: [
    /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-2 text-[#111827]", style: { fontSize: "36px", fontWeight: 700 }, children: t("categories.title") }),
        /* @__PURE__ */ jsx("p", { className: "text-[#6B7280]", children: t("categories.subtitle") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        canScrollLeft && /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => scroll("left"),
            className: "absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all p-0 hidden md:flex items-center justify-center",
            style: { marginLeft: "-24px" },
            children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-6 w-6 text-[#111827]" })
          }
        ),
        canScrollRight && /* @__PURE__ */ jsx(
          Button,
          {
            onClick: () => scroll("right"),
            className: "absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all p-0 hidden md:flex items-center justify-center",
            style: { marginRight: "-24px" },
            children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-6 w-6 text-[#111827]" })
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            id: "category-scroll-container",
            className: "overflow-x-auto scrollbar-hide",
            onScroll: (e) => {
              setScrollPosition(e.currentTarget.scrollLeft);
              checkScrollButtons();
            },
            style: {
              scrollbarWidth: "none",
              msOverflowStyle: "none"
            },
            children: /* @__PURE__ */ jsx("div", { className: "grid grid-rows-2 grid-flow-col gap-4 md:gap-6 pb-2", children: categories.map((category, index) => {
              const categoryName = category.name || category.label || category.title || "Uncategorized";
              const Icon = getCategoryIcon(categoryName);
              const displayColor = category.color || category.bg_color || ["#7EC89A", "#5FB57A", "#9DD9B3", "#BCF0CC"][index % 4];
              let displayCount = isRTL ? "0 عروض" : "0 deals";
              let count = 0;
              if (category.active_deals_count !== void 0) {
                count = category.active_deals_count;
              } else if (category.deal_count !== void 0) {
                count = category.deal_count;
              } else if (category.count !== void 0) {
                count = category.count;
              } else if (category.deals_count) {
                displayCount = category.deals_count;
                count = -1;
              }
              if (count >= 0) {
                if (isRTL) {
                  displayCount = `${count} ${count === 1 ? "عرض" : "عروض"}`;
                } else {
                  displayCount = `${count} ${count === 1 ? "deal" : "deals"}`;
                }
              }
              const categoryUrl = `/category/${category.slug || category.id}`;
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => navigate(categoryUrl),
                  className: "group bg-white rounded-xl p-6 border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all text-center w-[160px] md:w-[180px] cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        className: "inline-flex h-16 w-16 items-center justify-center rounded-full mb-4 transition-transform group-hover:scale-110",
                        style: { backgroundColor: displayColor },
                        children: /* @__PURE__ */ jsx(Icon, { className: "h-8 w-8 text-[#111827]" })
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { style: { fontSize: "18px", fontWeight: 600 }, className: "text-[#111827] mb-1", children: categoryName }),
                    /* @__PURE__ */ jsx("div", { className: "text-sm text-[#6B7280]", children: displayCount })
                  ]
                },
                category.id
              );
            }) })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("style", { children: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      ` })
  ] });
}

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "span";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "badge",
      className: cn(badgeVariants({ variant }), className),
      ...props
    }
  );
}

function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
        className
      ),
      ...props
    }
  );
}

function CommunityActivity() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const topContributors = [
    {
      username: "Vicoo821",
      badge: language === "en" ? "DEAL DETECTIVE" : "محقق العروض",
      badgeColor: "bg-[#5FB57A]",
      icon: "detective",
      stat: "1,129",
      statLabel: language === "en" ? "Contributed" : "ساهم"
    },
    {
      username: "Vicoo821",
      badge: language === "en" ? "SAVINGS HERO" : "بطل التوفير",
      badgeColor: "bg-[#5FB57A]",
      icon: "hero",
      stat: "$492",
      statLabel: language === "en" ? "Helped members save" : "ساعد الأعضاء في توفير"
    },
    {
      username: "GoJOSatoru",
      badge: language === "en" ? "TEST WIZ" : "ساحر الاختبار",
      badgeColor: "bg-[#5FB57A]",
      icon: "wizard",
      stat: "1,037",
      statLabel: language === "en" ? "Verified codes" : "أكواد تم التحقق منها"
    }
  ];
  const popularStores = [
    { name: "Etsy", avgSavings: language === "en" ? "$32 avg. savings" : "متوسط توفير $32" },
    { name: "Mercari", avgSavings: language === "en" ? "$17 avg. savings" : "متوسط توفير $17" },
    { name: "Vistaprint", avgSavings: language === "en" ? "$51 avg. savings" : "متوسط توفير $51" },
    { name: "Jiffy Lube", avgSavings: language === "en" ? "$30 avg. savings" : "متوسط توفير $30" }
  ];
  const hotCodes = [
    {
      discount: language === "en" ? "Up to 10% off" : "حتى 10% خصم",
      code: "PINSKY",
      verified: true,
      description: language === "en" ? "10% Off (Storewide) at Lumin" : "خصم 10% (على كل المتجر) في Lumin",
      usageCount: language === "en" ? "Used 1,061 times" : "استخدم 1,061 مرة",
      store: "Lumin"
    },
    {
      discount: language === "en" ? "Up to 20% off" : "حتى 20% خصم",
      code: "CIRQ20",
      verified: true,
      description: language === "en" ? "20% Off Storewide at Paranormal Cirque" : "خصم 20% على كل المتجر في Paranormal Cirque",
      usageCount: language === "en" ? "Used 13,874 times" : "استخدم 13,874 مرة",
      store: "Paranormal Cirque"
    },
    {
      discount: language === "en" ? "Up to 15% off" : "حتى 15% خصم",
      code: "CRAFT15",
      verified: true,
      description: language === "en" ? "15% Off Storewide at Crunchyroll" : "خصم 15% على كل المتجر في Crunchyroll",
      usageCount: language === "en" ? "Used 10,074 times" : "استخدم 10,074 مرة",
      store: "Crunchyroll"
    },
    {
      discount: language === "en" ? "Up to $25 off" : "حتى $25 خصم",
      code: "W60",
      verified: true,
      description: language === "en" ? "$25 Off Storewide at 4imprint" : "خصم $25 على كل المتجر في 4imprint",
      usageCount: language === "en" ? "Used 7,511 times" : "استخدم 7,511 مرة",
      store: "4imprint"
    }
  ];
  const todaysActivity = [
    {
      username: "RonJrJohnson",
      action: language === "en" ? "verified code" : "تحقق من الكود",
      code: "EMAIL",
      store: "Castano Group",
      time: language === "en" ? "45s ago" : "منذ 45 ثانية",
      status: "verified"
    },
    {
      username: "RonJrJohnson",
      action: language === "en" ? "verified code" : "تحقق من الكود",
      code: "IGNITE10FF",
      store: "ProVape",
      time: language === "en" ? "56s ago" : "منذ 56 ثانية",
      status: "verified"
    },
    {
      username: "Kony24",
      action: language === "en" ? "invalidated code" : "أبطل الكود",
      code: "Prime",
      store: "Village Hat Shop",
      time: language === "en" ? "58s ago" : "منذ 58 ثانية",
      status: "invalidated"
    },
    {
      username: "dragonjeffer",
      action: language === "en" ? "invalidated code" : "أبطل الكود",
      code: "HBDCKQVQFR4",
      store: "Camp",
      time: language === "en" ? "1min ago" : "منذ دقيقة",
      status: "invalidated"
    },
    {
      username: "WonderPhoenix8283",
      action: language === "en" ? "invalidated code" : "أبطل الكود",
      code: "CARDFINALULTRA",
      store: "Rabble Game",
      time: language === "en" ? "1min ago" : "منذ دقيقة",
      status: "invalidated"
    }
  ];
  const getBadgeIcon = (icon) => {
    switch (icon) {
      case "detective":
        return /* @__PURE__ */ jsx(Shield, { className: "h-8 w-8 text-white" });
      case "hero":
        return /* @__PURE__ */ jsx(Award, { className: "h-8 w-8 text-white" });
      case "wizard":
        return /* @__PURE__ */ jsx(Zap, { className: "h-8 w-8 text-white" });
      default:
        return /* @__PURE__ */ jsx(Shield, { className: "h-8 w-8 text-white" });
    }
  };
  return /* @__PURE__ */ jsx("section", { className: "py-12 md:py-16 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsx("div", { className: `flex items-center justify-between mb-10 ${isRTL ? "flex-row-reverse" : ""}`, children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-2 text-[#111827]", style: { fontSize: "36px", fontWeight: 700 }, children: language === "en" ? "Community Activity" : "نشاط المجتمع" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#6B7280]", children: language === "en" ? "See what our community members are saving right now" : "شاهد ما يوفره أعضاء مجتمعنا الآن" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs(Card, { className: "p-6 bg-[#E8F3E8] border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)]", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl mb-4 text-[#111827]", style: { fontWeight: 700 }, children: language === "en" ? "Find verified coupon codes" : "اعثر على أكواد قسائم موثقة" }),
          /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] text-sm mb-6", children: language === "en" ? "Search from over 400,000 stores" : "ابحث من أكثر من 400,000 متجر" }),
          /* @__PURE__ */ jsxs("div", { className: `flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 relative", children: [
              /* @__PURE__ */ jsx(Search, { className: `absolute top-1/2 -translate-y-1/2 ${isRTL ? "right-4" : "left-4"} h-5 w-5 text-[#6B7280]` }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "text",
                  placeholder: language === "en" ? "Where are you shopping today?" : "أين تتسوق اليوم؟",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  className: `border-2 border-[#111827] h-12 ${isRTL ? "pr-12" : "pl-12"} rounded-lg bg-white`
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                className: "bg-[#5FB57A] hover:bg-[#4FA569] text-white h-12 px-6 rounded-lg border-2 border-[#111827] shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all",
                children: language === "en" ? "Find" : "بحث"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "p-6 border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)]", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl mb-4 text-[#111827]", style: { fontWeight: 700 }, children: language === "en" ? "Popular right now" : "رائج الآن" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-3", children: popularStores.map((store, index) => /* @__PURE__ */ jsxs(
            "button",
            {
              className: "bg-[#E8F3E8] hover:bg-[#D1E7D1] transition-colors rounded-xl p-4 text-left border-2 border-transparent hover:border-[#5FB57A]",
              children: [
                /* @__PURE__ */ jsx("div", { className: "text-[#111827] mb-1", style: { fontWeight: 600 }, children: store.name }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-[#6B7280]", children: store.avgSavings })
              ]
            },
            index
          )) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "p-6 border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)]", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl mb-4 text-[#111827]", style: { fontWeight: 700 }, children: language === "en" ? "Today's hottest codes" : "أكثر الأكواد رواجًا اليوم" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: hotCodes.map((code, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-[#F9FAFB] border-2 border-[#E5E7EB] rounded-xl p-4 hover:border-[#5FB57A] transition-colors",
              children: [
                /* @__PURE__ */ jsxs("div", { className: `flex items-start gap-3 mb-3 ${isRTL ? "flex-row-reverse" : ""}`, children: [
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-lg bg-[#E8F3E8] border-2 border-[#5FB57A] flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsx(TrendingUp, { className: "h-5 w-5 text-[#5FB57A]" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-[#111827] mb-1", style: { fontWeight: 600 }, children: code.discount }),
                    /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`, children: [
                      /* @__PURE__ */ jsx("span", { className: "text-[#5FB57A] text-sm", style: { fontWeight: 700 }, children: code.code }),
                      code.verified && /* @__PURE__ */ jsx(CheckCircle, { className: "h-4 w-4 text-[#5FB57A]" })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-[#6B7280] mb-2 line-clamp-2", children: code.description }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-[#9CA3AF]", children: code.usageCount })
              ]
            },
            index
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs(Card, { className: "p-6 border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)]", children: [
        /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`, children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl text-[#111827]", style: { fontWeight: 700 }, children: language === "en" ? "Live activity" : "نشاط مباشر" }),
          /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`, children: [
            /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-[#6B7280]", style: { fontWeight: 600 }, children: language === "en" ? "LIVE" : "مباشر" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm mb-4 text-[#6B7280]", style: { fontWeight: 600 }, children: language === "en" ? "This week's top contributors" : "أفضل المساهمين هذا الأسبوع" }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-3 gap-3", children: topContributors.map((contributor, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              className: "bg-[#E8F3E8] border-2 border-[#5FB57A] rounded-xl p-4 text-center",
              children: [
                /* @__PURE__ */ jsx("div", { className: "relative inline-block mb-2", children: /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-full bg-[#5FB57A] flex items-center justify-center mb-2", children: getBadgeIcon(contributor.icon) }) }),
                /* @__PURE__ */ jsx(Badge, { className: `${contributor.badgeColor} text-white text-[10px] mb-2 border-0 rounded px-2`, children: contributor.badge }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-[#111827] mb-1", style: { fontWeight: 600 }, children: contributor.username }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-[#6B7280] mb-1", children: contributor.statLabel }),
                /* @__PURE__ */ jsx("div", { className: "text-sm text-[#5FB57A]", style: { fontWeight: 700 }, children: contributor.stat })
              ]
            },
            index
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h4", { className: "text-sm mb-4 text-[#6B7280]", style: { fontWeight: 600 }, children: language === "en" ? "Today's activity" : "نشاط اليوم" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-[320px] overflow-y-auto", children: todaysActivity.map((activity, index) => /* @__PURE__ */ jsx(
            "div",
            {
              className: "bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 hover:bg-[#E8F3E8] transition-colors",
              children: /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`, children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 mb-1 ${isRTL ? "flex-row-reverse" : ""}`, children: [
                    /* @__PURE__ */ jsx("span", { className: "text-sm text-[#111827]", style: { fontWeight: 600 }, children: activity.username }),
                    /* @__PURE__ */ jsx("span", { className: "text-xs text-[#9CA3AF]", children: activity.time })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-sm text-[#6B7280]", children: [
                    activity.action,
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-[#5FB57A]", style: { fontWeight: 600 }, children: activity.code }),
                    " ",
                    "at ",
                    activity.store
                  ] })
                ] }),
                activity.status === "verified" ? /* @__PURE__ */ jsx(CheckCircle, { className: "h-5 w-5 text-green-500 flex-shrink-0 ml-2" }) : /* @__PURE__ */ jsx(XCircle, { className: "h-5 w-5 text-red-500 flex-shrink-0 ml-2" })
              ] })
            },
            index
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-3 mt-6 pt-6 border-t-2 border-[#E5E7EB]", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl text-[#5FB57A] mb-1", style: { fontWeight: 700 }, children: "$1,825" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-[#6B7280]", children: language === "en" ? "Saved today" : "وفر اليوم" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl text-[#5FB57A] mb-1", style: { fontWeight: 700 }, children: "131K" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-[#6B7280]", children: language === "en" ? "Verified" : "تم التحقق" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl text-[#5FB57A] mb-1", style: { fontWeight: 700 }, children: "13.4K" }),
            /* @__PURE__ */ jsx("div", { className: "text-xs text-[#6B7280]", children: language === "en" ? "Active codes" : "أكواد نشطة" })
          ] })
        ] })
      ] }) })
    ] })
  ] }) });
}

const ERROR_IMG_SRC = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";
function ImageWithFallback(props) {
  const [didError, setDidError] = useState(false);
  const handleError = () => {
    setDidError(true);
  };
  const { src, alt, style, className, ...rest } = props;
  return didError ? /* @__PURE__ */ jsx(
    "div",
    {
      className: `inline-block bg-gray-100 text-center align-middle ${className ?? ""}`,
      style,
      children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-full h-full", children: /* @__PURE__ */ jsx("img", { src: ERROR_IMG_SRC, alt: "Error loading image", ...rest, "data-original-url": src }) })
    }
  ) : /* @__PURE__ */ jsx("img", { src, alt, className, style, ...rest, onError: handleError });
}

function PopularStores() {
  const { t, isRTL, language } = useLanguage();
  const { country } = useCountry();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchStores();
  }, [country, language]);
  const fetchStores = async () => {
    try {
      setLoading(true);
      const countryValue = getCountryValue(country);
      const { projectId, publicAnonKey } = await Promise.resolve().then(() => info);
      const url = countryValue ? `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/stores?country=${countryValue}&limit=8` : `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/stores?limit=8`;
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.stores && result.stores.length > 0) {
        setStores(result.stores);
      }
    } catch (err) {
      console.error("Error fetching stores:", err);
    } finally {
      setLoading(false);
    }
  };
  function getStoreName(store) {
    if (language === "ar") {
      return store.name_ar || store.store_name_ar || store.name || store.store_name || store.title || "Store";
    }
    return store.name || store.store_name || store.title || "Store";
  }
  function getStoreLogo(store) {
    return store.profile_picture_url || store.logo || store.logo_url || store.image_url || "";
  }
  function getStoreSlug(store) {
    const name = store.name || store.store_name || store.title || "";
    return store.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  function getDealsCount(store) {
    return store.total_offers || store.active_deals_count || store.deals_count || 0;
  }
  return /* @__PURE__ */ jsx("section", { className: "py-12 md:py-16 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-between mb-10 ${isRTL ? "flex-row-reverse" : ""}`, children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "mb-2 text-[#111827]", style: { fontSize: "36px", fontWeight: 700 }, children: language === "en" ? "Popular Stores" : "المتاجر الشائعة" }),
        /* @__PURE__ */ jsx("p", { className: "text-[#6B7280]", children: language === "en" ? "Shop from your favorite brands and save more" : "تسوق من علاماتك التجارية المفضلة ووفر أكثر" })
      ] }),
      /* @__PURE__ */ jsx(Link, { to: "/stores", children: /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          className: `hidden md:flex border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white rounded-xl ${isRTL ? "flex-row-reverse" : ""}`,
          children: [
            language === "en" ? "View All Stores" : "عرض جميع المتاجر",
            /* @__PURE__ */ jsx(ArrowRight, { className: `h-4 w-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}` })
          ]
        }
      ) })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6", children: [...Array(8)].map((_, i) => /* @__PURE__ */ jsx(
      "div",
      {
        className: "h-40 bg-gray-100 rounded-xl border-2 border-[#E5E7EB] animate-pulse"
      },
      i
    )) }) : stores.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsx(Store, { className: "h-12 w-12 text-[#9CA3AF] mx-auto mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#6B7280]", children: language === "en" ? "No stores available" : "لا توجد متاجر متاحة" })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6", children: stores.map((store) => {
        const name = getStoreName(store);
        const logo = getStoreLogo(store);
        const slug = getStoreSlug(store);
        const dealsCount = getDealsCount(store);
        return /* @__PURE__ */ jsx(Link, { to: `/store/${slug}`, children: /* @__PURE__ */ jsxs("div", { className: "group bg-white rounded-xl border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all p-6 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "h-16 w-16 mx-auto mb-4 rounded-lg border-2 border-[#E5E7EB] bg-white overflow-hidden flex items-center justify-center", children: logo ? /* @__PURE__ */ jsx(
            ImageWithFallback,
            {
              src: logo,
              alt: name,
              className: "w-full h-full object-cover"
            }
          ) : /* @__PURE__ */ jsx(Store, { className: "h-8 w-8 text-[#9CA3AF]" }) }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: "16px", fontWeight: 600 }, className: "text-[#111827] mb-2 line-clamp-1", children: name }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-[#5FB57A] flex items-center justify-center gap-1", children: [
            /* @__PURE__ */ jsx(Tag, { className: "h-3 w-3" }),
            dealsCount,
            " ",
            language === "en" ? "deals" : "عروض"
          ] })
        ] }) }, store.id);
      }) }),
      /* @__PURE__ */ jsx("div", { className: "mt-8 flex justify-center md:hidden", children: /* @__PURE__ */ jsx(Link, { to: "/stores", children: /* @__PURE__ */ jsxs(
        Button,
        {
          variant: "outline",
          className: `border-2 border-[#111827] text-[#111827] hover:bg-[#111827] hover:text-white rounded-xl ${isRTL ? "flex-row-reverse" : ""}`,
          children: [
            language === "en" ? "View All Stores" : "عرض جميع المتاجر",
            /* @__PURE__ */ jsx(ArrowRight, { className: `h-4 w-4 ${isRTL ? "mr-2 rotate-180" : "ml-2"}` })
          ]
        }
      ) }) })
    ] })
  ] }) });
}

function WhyDifferent() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  const features = [
    {
      icon: Users,
      title: language === "en" ? "Powered by shoppers like you" : "مدعوم من المتسوقين مثلك",
      description: language === "en" ? "Our unique system combines a powerful AI engine with our community of millions of real shoppers who verify codes in real-time, ensuring you get more codes that work." : "يجمع نظامنا الفريد بين محرك ذكاء اصطناعي قوي ومجتمعنا من ملايين المتسوقين الحقيقيين الذين يتحققون من الأكواد في الوقت الفعلي، مما يضمن لك الحصول على المزيد من الأكواد التي تعمل.",
      gradient: "from-[#E8F3E8] to-[#BCF0CC]",
      iconColor: "#FFFFFF",
      iconBg: "#5FB57A"
    },
    {
      icon: Shield,
      title: language === "en" ? "Trust and privacy by design" : "الثقة والخصوصية بالتصميم",
      description: language === "en" ? "While other coupon sites track everything you browse, we only collect the minimum data needed to find you coupon codes. Your shopping habits stay private, giving you control over your data without sacrificing savings." : "بينما تتبع مواقع القسائم الأخرى كل ما تتصفحه، نحن نجمع فقط الحد الأدنى من البيانات اللازمة للعثور على رموز القسيمة لك. تظل عادات التسوق الخاصة بك خاصة، مما يمنحك التحكم في بياناتك دون التضحية بالمدخرات.",
      gradient: "from-[#BCF0CC] to-[#9DD9B3]",
      iconColor: "#FFFFFF",
      iconBg: "#5FB57A"
    },
    {
      icon: Gift,
      title: language === "en" ? "Rewards when you save" : "مكافآت عند التوفير",
      description: language === "en" ? "Shop and save at 400,000+ stores—from big brands to local favorites. Stack deals to boost rewards and cash out anytime you want." : "تسوق ووفر في أكثر من 400,000 متجر - من العلامات التجارية الكبيرة إلى المفضلات المحلية. كدس الصفقات لتعزيز المكافآت واسحب النقود في أي وقت تريد.",
      gradient: "from-[#9DD9B3] to-[#7EC89A]",
      iconColor: "#FFFFFF",
      iconBg: "#5FB57A"
    }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-12 md:py-16 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsx("div", { className: `text-center mb-10 ${isRTL ? "text-right" : "text-left"}`, children: /* @__PURE__ */ jsx("h2", { className: "mb-4 text-[#111827]", style: { fontSize: "36px", fontWeight: 700 }, children: language === "en" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      "How we're ",
      /* @__PURE__ */ jsx("span", { className: "italic text-[#5FB57A]", children: "different" }),
      " from traditional coupon sites"
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      "كيف نحن ",
      /* @__PURE__ */ jsx("span", { className: "italic text-[#5FB57A]", children: "مختلفون" }),
      " عن مواقع القسائم التقليدية"
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6", children: features.map((feature, index) => {
      const Icon = feature.icon;
      return /* @__PURE__ */ jsxs(
        Card,
        {
          className: `p-8 border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all bg-gradient-to-br ${feature.gradient} overflow-hidden relative`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/20 border-2 border-[#111827]" }),
            /* @__PURE__ */ jsx("div", { className: `absolute ${index === 0 ? "-bottom-6 -left-6" : index === 1 ? "bottom-4 right-4" : "top-1/2 left-4"} w-16 h-16 rounded-full bg-white/10 border-2 border-white/30` }),
            /* @__PURE__ */ jsxs("div", { className: `flex flex-col ${isRTL ? "items-end" : "items-start"} h-full relative z-10`, children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border-2 border-[#111827] shadow-[2px_2px_0px_0px_rgba(17,24,39,1)]",
                  style: { backgroundColor: feature.iconBg },
                  children: /* @__PURE__ */ jsx(Icon, { className: "h-10 w-10", style: { color: feature.iconColor } })
                }
              ),
              /* @__PURE__ */ jsx(
                "h3",
                {
                  className: `mb-4 text-[#111827] ${isRTL ? "text-right" : "text-left"}`,
                  style: { fontSize: "22px", fontWeight: 700 },
                  children: feature.title
                }
              ),
              /* @__PURE__ */ jsx(
                "p",
                {
                  className: `text-[#111827] text-sm leading-relaxed ${isRTL ? "text-right" : "text-left"}`,
                  children: feature.description
                }
              )
            ] })
          ]
        },
        index
      );
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-8 border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] bg-gradient-to-br from-[#BCF0CC] to-[#7EC89A] overflow-hidden relative", children: [
        /* @__PURE__ */ jsxs("div", { className: `flex flex-col ${isRTL ? "items-end" : "items-start"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2 mb-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[#111827]", style: { fontSize: "64px", fontWeight: 700 }, children: "4.7" }),
            /* @__PURE__ */ jsx(Star, { className: "h-8 w-8 fill-[#111827] text-[#111827]" })
          ] }),
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: `text-[#111827] mb-2 ${isRTL ? "text-right" : "text-left"}`,
              style: { fontSize: "20px", fontWeight: 700 },
              children: language === "en" ? "Average Google Chrome Web Store rating from users" : "متوسط تقييم متجر Google Chrome من المستخدمين"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: `text-sm text-[#6B7280] ${isRTL ? "text-right" : "text-left"}`, children: language === "en" ? "Last updated Aug 30, 2025" : "آخر تحديث 30 أغسطس 2025" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-white/20 border-2 border-[#111827]" }),
        /* @__PURE__ */ jsx("div", { className: "absolute -top-4 -left-4 w-16 h-16 rounded-full bg-white/20 border-2 border-[#111827]" })
      ] }),
      /* @__PURE__ */ jsx(Card, { className: "p-8 border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] bg-gradient-to-br from-[#5FB57A] to-[#4FA569] overflow-hidden relative", children: /* @__PURE__ */ jsxs("div", { className: `flex ${isRTL ? "flex-row-reverse" : "flex-row"} items-center gap-6 h-full`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsx(
            "h3",
            {
              className: `text-white mb-3 ${isRTL ? "text-right" : "text-left"}`,
              style: { fontSize: "24px", fontWeight: 700 },
              children: language === "en" ? "Found a great deal? Don't keep it to yourself!" : "وجدت صفقة رائعة؟ لا تحتفظ بها لنفسك!"
            }
          ),
          /* @__PURE__ */ jsx("p", { className: `text-white/90 mb-4 text-sm ${isRTL ? "text-right" : "text-left"}`, children: language === "en" ? "Be the hero other shoppers need." : "كن البطل الذي يحتاجه المتسوقون الآخرون." }),
          /* @__PURE__ */ jsx("p", { className: `text-white/80 mb-6 text-sm ${isRTL ? "text-right" : "text-left"}`, children: language === "en" ? "Every code shared makes shopping better for everyone. Plus, the more you help people save, the more rewards you'll earn." : "كل كود تشاركه يجعل التسوق أفضل للجميع. بالإضافة إلى ذلك، كلما ساعدت الناس على التوفير، زادت المكافآت التي ستكسبها." }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              className: "bg-[#111827] hover:bg-[#1F2937] text-white border-2 border-white rounded-lg shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-[1px_1px_0px_0px_rgba(255,255,255,1)] transition-all",
              children: [
                /* @__PURE__ */ jsx(CheckCircle, { className: `h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}` }),
                language === "en" ? "Share a code" : "شارك كود"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hidden md:block", children: /* @__PURE__ */ jsxs("div", { className: "w-32 h-32 relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 rounded-full bg-white/10 border-2 border-white/30" }),
          /* @__PURE__ */ jsx("div", { className: "absolute inset-2 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center", children: /* @__PURE__ */ jsx(Megaphone, { className: "h-16 w-16 text-white" }) })
        ] }) })
      ] }) })
    ] })
  ] }) });
}

function Testimonials() {
  const { t, isRTL } = useLanguage();
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Fashion Enthusiast",
      image: "https://images.unsplash.com/photo-1745434159123-4908d0b9df94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHNtaWxpbmd8ZW58MXx8fHwxNzYyMjg5MjQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 5,
      text: "I've saved over $500 in just 3 months using Tuut! The deals are always verified and the platform is so easy to use.",
      savings: "$547"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Tech Buyer",
      image: "https://images.unsplash.com/photo-1712599982295-1ecff6059a57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMGhhcHB5fGVufDF8fHx8MTc2MjM1NzI0MXww&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 5,
      text: "Amazing platform! I found a 60% off deal on a laptop I'd been eyeing for months. The price tracking feature is a game changer!",
      savings: "$820"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Smart Shopper",
      image: "https://images.unsplash.com/photo-1753161023962-665967602405?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYyMzE2NTI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 5,
      text: "The newsletter keeps me updated on the best deals. I love how organized everything is by category. Never shopping without checking Tuut first!",
      savings: "$392"
    }
  ];
  return /* @__PURE__ */ jsx("section", { className: "py-12 md:py-16 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-2 text-[#111827]", style: { fontSize: "36px", fontWeight: 700 }, children: t("testimonials.title") }),
      /* @__PURE__ */ jsx("p", { className: "text-[#6B7280]", children: t("testimonials.subtitle") })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-6", children: testimonials.map((testimonial) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "bg-white rounded-2xl p-6 border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all",
        children: [
          /* @__PURE__ */ jsx("div", { className: "flex gap-1 mb-4", children: [...Array(testimonial.rating)].map((_, i) => /* @__PURE__ */ jsx(Star, { className: "h-5 w-5 fill-[#5FB57A] text-[#5FB57A]" }, i)) }),
          /* @__PURE__ */ jsxs("p", { className: "text-[#111827] mb-6", style: { fontSize: "15px", lineHeight: "1.6" }, children: [
            '"',
            testimonial.text,
            '"'
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 pt-4 border-t-2 border-[#E5E7EB]", children: [
            /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full overflow-hidden border-2 border-[#111827]", children: /* @__PURE__ */ jsx(
              ImageWithFallback,
              {
                src: testimonial.image,
                alt: testimonial.name,
                className: "h-full w-full object-cover"
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("div", { style: { fontWeight: 600 }, className: "text-[#111827]", children: testimonial.name }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-[#6B7280]", children: testimonial.role })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx("div", { className: "text-xs text-[#6B7280]", children: "Saved" }),
              /* @__PURE__ */ jsx("div", { style: { fontWeight: 700 }, className: "text-[#5FB57A]", children: testimonial.savings })
            ] })
          ] })
        ]
      },
      testimonial.id
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-12 bg-[#5FB57A] rounded-2xl p-8 md:p-10 text-[#111827] border-2 border-[#111827] shadow-[6px_6px_0px_0px_rgba(17,24,39,1)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: "36px", fontWeight: 700 }, children: isRTL ? "+24.5 مليون $" : "$24.5M+" }),
          /* @__PURE__ */ jsx("div", { className: "text-[#111827]/80", style: { fontWeight: 500 }, children: t("testimonials.totalSavings") })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: "36px", fontWeight: 700 }, children: isRTL ? "+500 ألف" : "500K+" }),
          /* @__PURE__ */ jsx("div", { className: "text-[#111827]/80", style: { fontWeight: 500 }, children: t("testimonials.happyUsers") })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { style: { fontSize: "36px", fontWeight: 700 }, children: "4.9/5" }),
          /* @__PURE__ */ jsx("div", { className: "text-[#111827]/80", style: { fontWeight: 500 }, children: t("testimonials.averageRating") })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "border-t-2 border-[#111827]/20 pt-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-[#111827] mb-2", style: { fontSize: "24px", fontWeight: 600 }, children: t("testimonials.downloadApp") }),
          /* @__PURE__ */ jsx("p", { className: "text-[#111827]/80", children: t("testimonials.downloadSubtitle") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `flex flex-col sm:flex-row items-center justify-center gap-4 ${isRTL ? "sm:flex-row-reverse" : ""}`, children: [
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "#",
              className: `group flex items-center gap-3 bg-white border-2 border-[#111827] rounded-xl px-6 py-3 transition-all hover:shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] ${isRTL ? "flex-row-reverse" : ""}`,
              children: [
                /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-[#111827]", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" }) }),
                /* @__PURE__ */ jsxs("div", { className: `${isRTL ? "text-right" : "text-left"}`, children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-[#111827]/70", children: t("testimonials.downloadOn") }),
                  /* @__PURE__ */ jsx("div", { className: "text-[#111827]", style: { fontWeight: 600 }, children: t("testimonials.appStore") })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "#",
              className: `group flex items-center gap-3 bg-white border-2 border-[#111827] rounded-xl px-6 py-3 transition-all hover:shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] ${isRTL ? "flex-row-reverse" : ""}`,
              children: [
                /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-[#111827]", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" }) }),
                /* @__PURE__ */ jsxs("div", { className: `${isRTL ? "text-right" : "text-left"}`, children: [
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-[#111827]/70", children: t("testimonials.getItOn") }),
                  /* @__PURE__ */ jsx("div", { className: "text-[#111827]", style: { fontWeight: 600 }, children: t("testimonials.googlePlay") })
                ] })
              ]
            }
          )
        ] })
      ] })
    ] })
  ] }) });
}

function Newsletter() {
  const { t, isRTL } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error(isRTL ? "الرجاء إدخال بريد إلكتروني صالح" : "Please enter a valid email address");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success(isRTL ? "تم الاشتراك بنجاح! تحقق من بريدك الإلكتروني للحصول على عروض حصرية." : "Successfully subscribed! Check your inbox for exclusive deals.");
      setEmail("");
      setIsSubmitting(false);
    }, 1e3);
  };
  return /* @__PURE__ */ jsx("section", { className: "py-12 md:py-16 bg-background", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-2xl p-8 md:p-12 border-2 border-[#111827] shadow-[6px_6px_0px_0px_rgba(17,24,39,1)]", children: /* @__PURE__ */ jsxs("div", { className: "max-w-[600px] mx-auto text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#5FB57A] border-2 border-[#111827] mb-6", children: /* @__PURE__ */ jsx(Mail, { className: "h-8 w-8 text-[#111827]" }) }),
    /* @__PURE__ */ jsx("h2", { className: "mb-3 text-[#111827]", style: { fontSize: "36px", fontWeight: 700 }, children: t("newsletter.title") }),
    /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] mb-8", children: t("newsletter.subtitle") }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: `flex flex-col sm:flex-row gap-3 mb-6 ${isRTL ? "sm:flex-row-reverse" : ""}`, children: [
      /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(
        Input,
        {
          type: "email",
          placeholder: t("newsletter.emailPlaceholder"),
          value: email,
          onChange: (e) => setEmail(e.target.value),
          className: "h-14 bg-white border-2 border-[#111827] focus-visible:ring-2 focus-visible:ring-[#5FB57A] rounded-xl",
          required: true,
          dir: isRTL ? "rtl" : "ltr"
        }
      ) }),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          disabled: isSubmitting,
          className: "h-14 px-8 bg-[#5FB57A] hover:bg-[#4FA569] text-[#111827] border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all",
          style: { fontWeight: 600 },
          children: isSubmitting ? t("newsletter.subscribing") : /* @__PURE__ */ jsxs(Fragment, { children: [
            t("newsletter.subscribe"),
            /* @__PURE__ */ jsx(ArrowRight, { className: `h-5 w-5 ${isRTL ? "mr-2" : "ml-2"}` })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-[#6B7280]", children: isRTL ? "🔒 نحن نحترم خصوصيتك. يمكنك إلغاء الاشتراك في أي وقت." : "🔒 We respect your privacy. Unsubscribe at any time." }),
    /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-3 gap-4 mt-8 text-[#111827] text-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`, children: [
        /* @__PURE__ */ jsx("span", { className: "text-[#5FB57A] text-lg", children: "✓" }),
        /* @__PURE__ */ jsx("span", { style: { fontWeight: 500 }, children: t("newsletter.features.exclusive") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`, children: [
        /* @__PURE__ */ jsx("span", { className: "text-[#5FB57A] text-lg", children: "✓" }),
        /* @__PURE__ */ jsx("span", { style: { fontWeight: 500 }, children: t("newsletter.features.weekly") })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`, children: [
        /* @__PURE__ */ jsx("span", { className: "text-[#5FB57A] text-lg", children: "✓" }),
        /* @__PURE__ */ jsx("span", { style: { fontWeight: 500 }, children: t("newsletter.features.personalized") })
      ] })
    ] })
  ] }) }) }) });
}

function HomePage() {
  useEffect(() => {
    if (window.location.hash === "#featured-deals") {
      setTimeout(() => {
        const featuredDealsSection = document.getElementById("featured-deals");
        if (featuredDealsSection) {
          featuredDealsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Hero, {}),
    /* @__PURE__ */ jsx(FeaturedDeals, {}),
    /* @__PURE__ */ jsx(CategoryGrid, {}),
    /* @__PURE__ */ jsx(CommunityActivity, {}),
    /* @__PURE__ */ jsx(PopularStores, {}),
    /* @__PURE__ */ jsx(WhyDifferent, {}),
    /* @__PURE__ */ jsx(Testimonials, {}),
    /* @__PURE__ */ jsx(Newsletter, {})
  ] });
}

function Select({
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Root, { "data-slot": "select", ...props });
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Trigger,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-full items-center justify-between gap-2 rounded-md border bg-input-background px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    SelectPrimitive.Content,
    {
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props,
      children: [
        /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Item,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronUpIcon, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4" })
    }
  );
}

function Sheet({ ...props }) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Root, { "data-slot": "sheet", ...props });
}
function SheetTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Trigger, { "data-slot": "sheet-trigger", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxs(
      SheetPrimitive.Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none", children: [
            /* @__PURE__ */ jsx(XIcon, { className: "size-4" }),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function SheetHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-1.5 p-4", className),
      ...props
    }
  );
}
function SheetTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Title,
    {
      "data-slot": "sheet-title",
      className: cn("text-foreground font-semibold", className),
      ...props
    }
  );
}

function DealCard({ deal, isRTL, isSaved, onToggleSave }) {
  const { navigate } = useRouter();
  const title = isRTL && deal.title_ar ? deal.title_ar : deal.title_en;
  const description = isRTL && deal.description_ar ? deal.description_ar : deal.description_en;
  const copyCouponCode = async (code) => {
    const success = await copyToClipboard(code);
    if (success) {
      toast.success(isRTL ? "تم نسخ كود الخصم" : "Coupon code copied!");
    } else {
      toast.error(isRTL ? "فشل نسخ الكود" : "Failed to copy code");
    }
  };
  const handleCardClick = () => {
    navigate(`/deal/${deal.slug || deal.id}`);
  };
  const colors = ["#7EC89A", "#5FB57A", "#9DD9B3", "#BCF0CC"];
  const color = colors[deal.id % colors.length];
  return /* @__PURE__ */ jsxs(
    "div",
    {
      onClick: handleCardClick,
      className: "group relative bg-white rounded-2xl overflow-hidden border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all cursor-pointer",
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `absolute ${isRTL ? "right-0" : "left-0"} top-0 bottom-0 w-[100px] flex items-center justify-center`,
            style: { backgroundColor: color },
            children: [
              /* @__PURE__ */ jsx("div", { className: `absolute ${isRTL ? "left-0" : "right-0"} top-0 bottom-0 w-2 flex flex-col justify-around`, children: [...Array(12)].map((_, i) => /* @__PURE__ */ jsx("div", { className: `w-3 h-3 bg-white rounded-full ${isRTL ? "-ml-1.5" : "-mr-1.5"}` }, i)) }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "text-[#111827] tracking-[0.3em]",
                  style: {
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                    fontSize: "18px",
                    fontWeight: 700,
                    transform: "rotate(180deg)"
                  },
                  children: deal.discount_percentage ? `${deal.discount_percentage}%` : isRTL ? "خصم" : "DEAL"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: `${isRTL ? "mr-[100px]" : "ml-[100px]"} p-6 relative`, children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: (e) => {
                e.stopPropagation();
                onToggleSave(deal.id);
              },
              className: `absolute top-4 ${isRTL ? "left-4" : "right-4"} p-2 rounded-full hover:bg-[#F0F7F0] transition-colors z-10`,
              children: /* @__PURE__ */ jsx(
                Heart,
                {
                  className: `h-5 w-5 transition-colors ${isSaved ? "fill-[#EF4444] text-[#EF4444]" : "text-[#9CA3AF]"}`
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: `${isRTL ? "pl-8" : "pr-8"}`, children: [
            deal.store_logo && /* @__PURE__ */ jsx("div", { className: "mb-3", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: deal.store_logo,
                alt: deal.store_name,
                className: "h-8 object-contain"
              }
            ) }),
            /* @__PURE__ */ jsx(
              "h3",
              {
                className: "mb-3 text-[#111827]",
                style: { fontSize: "20px", fontWeight: 600 },
                dir: isRTL ? "rtl" : "ltr",
                children: title
              }
            ),
            deal.code && /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(
              "div",
              {
                className: "text-[#111827] tracking-wide mb-3",
                style: { fontSize: "24px", fontWeight: 700 },
                children: deal.code
              }
            ) }),
            description && /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] text-sm mb-2", dir: isRTL ? "rtl" : "ltr", children: description }),
            (deal.store_name || deal.category_name) && /* @__PURE__ */ jsxs("div", { className: "text-sm inline-block mb-6", children: [
              deal.store_name && deal.store_slug && /* @__PURE__ */ jsx(
                "span",
                {
                  onClick: (e) => {
                    e.stopPropagation();
                    navigate(`/store/${deal.store_slug}`);
                  },
                  className: "text-[#5FB57A] hover:underline cursor-pointer",
                  children: deal.store_name
                }
              ),
              deal.store_name && !deal.store_slug && /* @__PURE__ */ jsx("span", { className: "text-[#5FB57A]", children: deal.store_name }),
              deal.category_name && deal.store_name && /* @__PURE__ */ jsx("span", { className: "text-[#6B7280]", children: " • " }),
              deal.category_name && /* @__PURE__ */ jsx("span", { className: "text-[#5FB57A]", children: deal.category_name })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: (e) => {
                e.stopPropagation();
                if (deal.code) {
                  copyCouponCode(deal.code);
                }
              },
              className: "w-full bg-white text-[#111827] border-2 border-[#111827] hover:bg-[#F0F7F0] rounded-xl",
              style: { fontWeight: 600 },
              children: [
                /* @__PURE__ */ jsx(Copy, { className: `h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}` }),
                deal.code ? isRTL ? "نسخ الكود" : "Copy Code" : isRTL ? "عرض التفاصيل" : "View Details"
              ]
            }
          )
        ] })
      ]
    }
  );
}

function generateSlug(storeName) {
  return storeName.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}
function isUUID(str) {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(str);
}
function DealsPage() {
  const { t, isRTL, language } = useLanguage();
  const { data: ssrData } = useSSRData();
  const hasSSRData = ssrData && ssrData.deals;
  const [deals, setDeals] = useState(hasSSRData ? ssrData.deals || [] : []);
  const [filteredDeals, setFilteredDeals] = useState(hasSSRData ? ssrData.deals || [] : []);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(!hasSSRData);
  const [savedDeals, setSavedDeals] = useState(/* @__PURE__ */ new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedDiscount, setSelectedDiscount] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!hasSSRData) {
      fetchDeals();
    }
    fetchCategories();
    fetchStores();
  }, [language]);
  useEffect(() => {
    applyFilters();
  }, [deals, searchQuery, selectedCategory, selectedStore, selectedDiscount, sortBy]);
  const fetchDeals = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data: dealsData, error: dealsError } = await supabase.from("deals").select("*").order("created_at", { ascending: false });
      if (dealsError) {
        console.error("Error fetching deals:", dealsError);
        setDeals([]);
        return;
      }
      if (!dealsData || dealsData.length === 0) {
        console.log("No deals found in database");
        setDeals([]);
        return;
      }
      console.log("Successfully fetched deals:", dealsData.length);
      const { data: storesData } = await supabase.from("stores").select("*");
      const storesMap = /* @__PURE__ */ new Map();
      if (storesData) {
        storesData.forEach((store) => {
          storesMap.set(store.id, store);
        });
      }
      const formattedDeals = dealsData.map((deal) => {
        const store = storesMap.get(deal.store_id);
        const storeName = store?.store_name || store?.name || store?.title;
        let storeSlug;
        if (store?.slug && !isUUID(store.slug)) {
          storeSlug = store.slug;
        } else if (storeName) {
          storeSlug = generateSlug(storeName);
        } else {
          storeSlug = void 0;
        }
        return {
          id: deal.id,
          slug: deal.slug,
          title_en: deal.title_en,
          title_ar: deal.title_ar,
          description_en: deal.description_en,
          description_ar: deal.description_ar,
          discount_percentage: deal.discount_percentage,
          discount_amount: deal.discount_amount,
          original_price: deal.original_price,
          discounted_price: deal.discounted_price,
          code: deal.code,
          store_id: deal.store_id,
          store_slug: storeSlug,
          store_name: storeName,
          store_logo: store?.logo_url,
          category_name: deal.category_name,
          expires_at: deal.expires_at,
          is_verified: deal.is_verified,
          featured: deal.featured
        };
      });
      setDeals(formattedDeals);
    } catch (error) {
      console.error("Unexpected error fetching deals:", error);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const supabase = createClient();
      const { data: categoriesData, error: categoriesError } = await supabase.from("categories").select("*");
      if (!categoriesError && categoriesData && categoriesData.length > 0) {
        console.log("Fetched categories from categories table:", categoriesData.length);
        console.log("Category columns:", Object.keys(categoriesData[0]));
        const formattedCategories = categoriesData.map((cat) => ({
          id: cat.id,
          name: cat.category_name || cat.name || cat.title || "Unknown Category"
        })).sort((a, b) => a.name.localeCompare(b.name));
        setCategories(formattedCategories);
      } else {
        console.log("Extracting categories from deals data");
        const { data: dealsData } = await supabase.from("deals").select("category_name");
        if (dealsData) {
          const uniqueCategories = Array.from(
            new Set(dealsData.map((d) => d.category_name).filter(Boolean))
          ).map((name, index) => ({ id: index + 1, name })).sort((a, b) => a.name.localeCompare(b.name));
          setCategories(uniqueCategories);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };
  const fetchStores = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("stores").select("*");
      if (!error && data && data.length > 0) {
        console.log("Fetched stores:", data.length);
        console.log("Store columns:", Object.keys(data[0]));
        const formattedStores = data.map((store) => ({
          id: store.id,
          name: store.store_name || store.name || store.title || "Unknown Store"
        })).sort((a, b) => a.name.localeCompare(b.name));
        setStores(formattedStores);
      } else {
        console.warn("Stores table error:", error?.message);
        setStores([]);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
      setStores([]);
    }
  };
  const applyFilters = () => {
    let filtered = [...deals];
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((deal) => {
        const title = isRTL && deal.title_ar ? deal.title_ar : deal.title_en;
        const description = isRTL && deal.description_ar ? deal.description_ar : deal.description_en;
        return title?.toLowerCase().includes(query) || description?.toLowerCase().includes(query) || deal.store_name?.toLowerCase().includes(query) || deal.category_name?.toLowerCase().includes(query);
      });
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter((deal) => deal.category_name === selectedCategory);
    }
    if (selectedStore !== "all") {
      filtered = filtered.filter((deal) => deal.store_name === selectedStore);
    }
    if (selectedDiscount !== "all") {
      const discountValue = parseInt(selectedDiscount);
      filtered = filtered.filter((deal) => {
        const discount = deal.discount_percentage || 0;
        return discount >= discountValue;
      });
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "discount-high":
          return (b.discount_percentage || 0) - (a.discount_percentage || 0);
        case "discount-low":
          return (a.discount_percentage || 0) - (b.discount_percentage || 0);
        case "price-high":
          return (b.discounted_price || 0) - (a.discounted_price || 0);
        case "price-low":
          return (a.discounted_price || 0) - (b.discounted_price || 0);
        case "newest":
        default:
          return 0;
      }
    });
    setFilteredDeals(filtered);
  };
  const toggleSave = (dealId) => {
    setSavedDeals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dealId)) {
        newSet.delete(dealId);
        toast.success(isRTL ? "تمت إزالة العرض من المحفوظات" : "Deal removed from saved");
      } else {
        newSet.add(dealId);
        toast.success(isRTL ? "تم حفظ العرض" : "Deal saved successfully");
      }
      return newSet;
    });
  };
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedStore("all");
    setSelectedDiscount("all");
    setSortBy("newest");
  };
  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedStore !== "all" || selectedDiscount !== "all";
  const FilterSection = () => /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block mb-2 text-[#111827]", style: { fontSize: "14px", fontWeight: 600 }, children: isRTL ? "البحث" : "Search" }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: `absolute ${isRTL ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]` }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            placeholder: isRTL ? "ابحث عن عروض..." : "Search for deals...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: `${isRTL ? "pr-10" : "pl-10"} border-2 border-[#111827] rounded-lg h-12`,
            dir: isRTL ? "rtl" : "ltr"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block mb-2 text-[#111827]", style: { fontSize: "14px", fontWeight: 600 }, children: isRTL ? "الفئة" : "Category" }),
      /* @__PURE__ */ jsxs(Select, { value: selectedCategory, onValueChange: setSelectedCategory, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "border-2 border-[#111827] rounded-lg h-12", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: isRTL ? "جميع الفئات" : "All Categories" }),
          categories.map((cat) => /* @__PURE__ */ jsx(SelectItem, { value: cat.name, children: cat.name }, cat.id))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block mb-2 text-[#111827]", style: { fontSize: "14px", fontWeight: 600 }, children: isRTL ? "المتجر" : "Store" }),
      /* @__PURE__ */ jsxs(Select, { value: selectedStore, onValueChange: setSelectedStore, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "border-2 border-[#111827] rounded-lg h-12", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: isRTL ? "جميع المتاجر" : "All Stores" }),
          stores.map((store) => /* @__PURE__ */ jsx(SelectItem, { value: store.name, children: store.name }, store.id))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block mb-2 text-[#111827]", style: { fontSize: "14px", fontWeight: 600 }, children: isRTL ? "نسبة الخصم" : "Discount" }),
      /* @__PURE__ */ jsxs(Select, { value: selectedDiscount, onValueChange: setSelectedDiscount, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "border-2 border-[#111827] rounded-lg h-12", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "all", children: isRTL ? "أي خصم" : "Any Discount" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "10", children: isRTL ? "10% فأكثر" : "10% or more" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "25", children: isRTL ? "25% فأكثر" : "25% or more" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "50", children: isRTL ? "50% فأكثر" : "50% or more" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "75", children: isRTL ? "75% فأكثر" : "75% or more" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("label", { className: "block mb-2 text-[#111827]", style: { fontSize: "14px", fontWeight: 600 }, children: isRTL ? "ترتيب حسب" : "Sort By" }),
      /* @__PURE__ */ jsxs(Select, { value: sortBy, onValueChange: setSortBy, children: [
        /* @__PURE__ */ jsx(SelectTrigger, { className: "border-2 border-[#111827] rounded-lg h-12", children: /* @__PURE__ */ jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsx(SelectItem, { value: "newest", children: isRTL ? "الأحدث" : "Newest" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "discount-high", children: isRTL ? "أعلى خصم" : "Highest Discount" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "discount-low", children: isRTL ? "أقل خصم" : "Lowest Discount" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "price-high", children: isRTL ? "أعلى سعر" : "Highest Price" }),
          /* @__PURE__ */ jsx(SelectItem, { value: "price-low", children: isRTL ? "أقل سعر" : "Lowest Price" })
        ] })
      ] })
    ] }),
    hasActiveFilters && /* @__PURE__ */ jsxs(
      Button,
      {
        onClick: clearFilters,
        variant: "outline",
        className: "w-full border-2 border-[#111827] rounded-lg h-12",
        children: [
          /* @__PURE__ */ jsx(X, { className: `h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}` }),
          isRTL ? "إزالة الفلاتر" : "Clear Filters"
        ]
      }
    )
  ] });
  return /* @__PURE__ */ jsx("section", { className: "py-12 md:py-16 bg-[#E8F3E8] min-h-screen", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { className: `mb-8 ${isRTL ? "text-right" : "text-left"}`, children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "inline-flex items-center text-[#5FB57A] hover:text-[#4FA669] mb-4 transition-colors", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: `h-5 w-5 ${isRTL ? "ml-2 rotate-180" : "mr-2"}` }),
        isRTL ? "العودة إلى الصفحة الرئيسية" : "Back to Home"
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-[#111827] mb-4", style: { fontSize: "36px", fontWeight: 700 }, children: isRTL ? "جميع العروض" : "All Deals" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#6B7280]", children: isRTL ? `اكتشف ${filteredDeals.length} عرض متاح` : `Discover ${filteredDeals.length} available deals` })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-4 gap-8", children: [
      /* @__PURE__ */ jsx("aside", { className: "hidden lg:block", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-6 sticky top-24", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-[#111827]", style: { fontSize: "20px", fontWeight: 700 }, children: isRTL ? "الفلاتر" : "Filters" }),
          /* @__PURE__ */ jsx(SlidersHorizontal, { className: "h-5 w-5 text-[#5FB57A]" })
        ] }),
        /* @__PURE__ */ jsx(FilterSection, {})
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "lg:hidden mb-6", children: /* @__PURE__ */ jsxs(Sheet, { children: [
        /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(Button, { className: "w-full bg-white border-2 border-[#111827] text-[#111827] rounded-lg h-12 shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)]", children: [
          /* @__PURE__ */ jsx(SlidersHorizontal, { className: `h-5 w-5 ${isRTL ? "ml-2" : "mr-2"}` }),
          isRTL ? "الفلاتر" : "Filters",
          hasActiveFilters && /* @__PURE__ */ jsx(Badge, { className: "bg-[#5FB57A] text-white ml-2 mr-2", children: isRTL ? "نشط" : "Active" })
        ] }) }),
        /* @__PURE__ */ jsxs(SheetContent, { side: isRTL ? "right" : "left", className: "w-[300px] sm:w-[400px]", children: [
          /* @__PURE__ */ jsx(SheetHeader, { children: /* @__PURE__ */ jsx(SheetTitle, { children: isRTL ? "الفلاتر" : "Filters" }) }),
          /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(FilterSection, {}) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-3", children: loading ? /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6", children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsx(
        "div",
        {
          className: "h-64 bg-white rounded-2xl border-2 border-[#111827] animate-pulse"
        },
        i
      )) }) : filteredDeals.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "text-center py-12 bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)]", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] mb-4", style: { fontSize: "18px" }, children: isRTL ? "لم يتم العثور على عروض" : "No deals found" }),
        hasActiveFilters && /* @__PURE__ */ jsx(
          Button,
          {
            onClick: clearFilters,
            className: "bg-[#5FB57A] hover:bg-[#4FA669] text-white border-2 border-[#111827] rounded-lg",
            children: isRTL ? "إزالة الفلاتر" : "Clear Filters"
          }
        )
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6", children: filteredDeals.map((deal) => /* @__PURE__ */ jsx(
        DealCard,
        {
          deal,
          isRTL,
          isSaved: savedDeals.has(deal.id),
          onToggleSave: toggleSave
        },
        deal.id
      )) }) })
    ] })
  ] }) });
}

function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}

function DropdownMenu({
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Root, { "data-slot": "dropdown-menu", ...props });
}
function DropdownMenuTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Trigger,
    {
      "data-slot": "dropdown-menu-trigger",
      ...props
    }
  );
}
function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}) {
  return /* @__PURE__ */ jsx(DropdownMenuPrimitive.Portal, { children: /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Content,
    {
      "data-slot": "dropdown-menu-content",
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Item,
    {
      "data-slot": "dropdown-menu-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}
function DropdownMenuSeparator({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DropdownMenuPrimitive.Separator,
    {
      "data-slot": "dropdown-menu-separator",
      className: cn("bg-border -mx-1 my-1 h-px", className),
      ...props
    }
  );
}

function StoresPage() {
  const { t, isRTL, language } = useLanguage();
  const { country } = useCountry();
  const { data: ssrData } = useSSRData();
  const hasSSRData = ssrData && ssrData.stores;
  const [stores, setStores] = useState(hasSSRData ? ssrData.stores || [] : []);
  const [displayedStores, setDisplayedStores] = useState(hasSSRData ? (ssrData.stores || []).slice(0, 20) : []);
  const [loading, setLoading] = useState(!hasSSRData);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(hasSSRData ? (ssrData.stores || []).length > 20 : true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [page, setPage] = useState(1);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const ITEMS_PER_PAGE = 20;
  useEffect(() => {
    if (!hasSSRData) {
      fetchStores();
    }
  }, [country, language, hasSSRData]);
  const fetchStores = async () => {
    try {
      setLoading(true);
      const countryValue = getCountryValue(country);
      const { projectId, publicAnonKey } = await Promise.resolve().then(() => info);
      const url = countryValue ? `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/stores?country=${countryValue}` : `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/stores`;
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.stores && result.stores.length > 0) {
        setStores(result.stores);
        setDisplayedStores(result.stores.slice(0, ITEMS_PER_PAGE));
        setHasMore(result.stores.length > ITEMS_PER_PAGE);
      } else {
        setStores([]);
        setDisplayedStores([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching stores:", err);
      setStores([]);
      setDisplayedStores([]);
    } finally {
      setLoading(false);
      setPage(1);
    }
  };
  const getFilteredAndSortedStores = useCallback(() => {
    let filtered = [...stores];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((store) => {
        const name = getStoreName(store, language).toLowerCase();
        const description = getStoreDescription(store, language).toLowerCase();
        return name.includes(query) || description.includes(query);
      });
    }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return getStoreName(a, language).localeCompare(getStoreName(b, language));
        case "deals":
          const aDeals = a.active_deals_count || a.deals_count || 0;
          const bDeals = b.active_deals_count || b.deals_count || 0;
          return bDeals - aDeals;
        case "featured":
        default:
          const aFeatured = a.featured || a.is_featured ? 1 : 0;
          const bFeatured = b.featured || b.is_featured ? 1 : 0;
          return bFeatured - aFeatured;
      }
    });
    return filtered;
  }, [stores, searchQuery, sortBy, language]);
  useEffect(() => {
    const filtered = getFilteredAndSortedStores();
    setDisplayedStores(filtered.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setHasMore(filtered.length > ITEMS_PER_PAGE);
  }, [searchQuery, sortBy, getFilteredAndSortedStores]);
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const filtered = getFilteredAndSortedStores();
    const nextPage = page + 1;
    const start = 0;
    const end = nextPage * ITEMS_PER_PAGE;
    setTimeout(() => {
      setDisplayedStores(filtered.slice(start, end));
      setPage(nextPage);
      setHasMore(filtered.length > end);
      setLoadingMore(false);
    }, 500);
  }, [page, hasMore, loadingMore, getFilteredAndSortedStores]);
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loadMore]);
  function getStoreName(store, lang) {
    if (lang === "ar") {
      return store.name_ar || store.store_name_ar || store.title_ar || store.name || store.store_name || store.title || "Store";
    }
    return store.name || store.store_name || store.title || "Store";
  }
  function getStoreDescription(store, lang) {
    if (lang === "ar") {
      return store.description_ar || store.description || "";
    }
    return store.description || "";
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-8 md:py-12", children: [
    /* @__PURE__ */ jsxs("div", { className: `mb-8 ${isRTL ? "text-right" : "text-left"}`, children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-3 text-[#111827]", style: { fontSize: "48px", fontWeight: 700 }, children: language === "en" ? "All Stores" : "جميع المتاجر" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] text-lg", children: language === "en" ? `Discover ${stores.length} stores with exclusive deals and coupons` : `اكتشف ${stores.length} متجر مع عروض وكوبونات حصرية` })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `mb-8 bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-4 md:p-6`, children: [
      /* @__PURE__ */ jsxs("div", { className: `flex flex-col md:flex-row gap-4 ${isRTL ? "md:flex-row-reverse" : ""}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 relative", children: [
          /* @__PURE__ */ jsx(Search, { className: `absolute top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280] ${isRTL ? "right-3" : "left-3"}` }),
          /* @__PURE__ */ jsx(
            Input,
            {
              type: "text",
              placeholder: language === "en" ? "Search stores..." : "ابحث عن المتاجر...",
              value: searchQuery,
              onChange: (e) => setSearchQuery(e.target.value),
              className: `${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} h-12 border-2 border-[#111827] rounded-xl`
            }
          ),
          searchQuery && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setSearchQuery(""),
              className: `absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-3" : "right-3"}`,
              children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5 text-[#6B7280] hover:text-[#111827]" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              className: `h-12 border-2 border-[#111827] rounded-xl px-6 ${isRTL ? "flex-row-reverse" : ""}`,
              children: [
                /* @__PURE__ */ jsx(Filter, { className: `h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}` }),
                language === "en" ? "Sort by" : "ترتيب حسب",
                /* @__PURE__ */ jsx(ChevronDown, { className: `h-4 w-4 ${isRTL ? "mr-2" : "ml-2"}` })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { className: `${isRTL ? "text-right" : "text-left"}`, children: [
            /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => setSortBy("featured"), children: language === "en" ? "Featured" : "مميز" }),
            /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => setSortBy("name"), children: language === "en" ? "Name (A-Z)" : "الاسم (أ-ي)" }),
            /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => setSortBy("deals"), children: language === "en" ? "Most Deals" : "الأكثر عروضاً" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: viewMode === "grid" ? "default" : "outline",
              onClick: () => setViewMode("grid"),
              className: `h-12 w-12 p-0 border-2 border-[#111827] rounded-xl ${viewMode === "grid" ? "bg-[#5FB57A] hover:bg-[#4fa66b]" : ""}`,
              children: /* @__PURE__ */ jsx(Grid, { className: "h-5 w-5" })
            }
          ),
          /* @__PURE__ */ jsx(
            Button,
            {
              variant: viewMode === "list" ? "default" : "outline",
              onClick: () => setViewMode("list"),
              className: `h-12 w-12 p-0 border-2 border-[#111827] rounded-xl ${viewMode === "list" ? "bg-[#5FB57A] hover:bg-[#4fa66b]" : ""}`,
              children: /* @__PURE__ */ jsx(List, { className: "h-5 w-5" })
            }
          )
        ] })
      ] }),
      searchQuery && /* @__PURE__ */ jsxs("div", { className: `mt-4 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`, children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-[#6B7280]", children: language === "en" ? "Searching for:" : "البحث عن:" }),
        /* @__PURE__ */ jsxs(
          Badge,
          {
            variant: "secondary",
            className: "bg-[#E8F3E8] text-[#111827] border border-[#5FB57A]",
            children: [
              searchQuery,
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setSearchQuery(""),
                  className: `${isRTL ? "mr-2" : "ml-2"} hover:text-[#EF4444]`,
                  children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
                }
              )
            ]
          }
        )
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: `grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`, children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-64 rounded-2xl" }, i)) }) : displayedStores.length === 0 ? (
      /* Empty State */
      /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
        /* @__PURE__ */ jsx(Store, { className: "h-16 w-16 text-[#9CA3AF] mx-auto mb-4" }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl text-[#111827] mb-2", style: { fontWeight: 600 }, children: language === "en" ? "No stores found" : "لم يتم العثور على متاجر" }),
        /* @__PURE__ */ jsx("p", { className: "text-[#6B7280]", children: language === "en" ? "Try adjusting your search or filters" : "حاول تعديل البحث أو الفلاتر" })
      ] })
    ) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: `grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`, children: displayedStores.map((store) => /* @__PURE__ */ jsx(
        StoreCard,
        {
          store,
          viewMode,
          language,
          isRTL
        },
        store.id
      )) }),
      hasMore && /* @__PURE__ */ jsx("div", { ref: loadMoreRef, className: "mt-8 flex justify-center", children: loadingMore && /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center gap-4", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(Skeleton, { className: "h-64 w-64 rounded-2xl" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-64 w-64 rounded-2xl hidden md:block" }),
        /* @__PURE__ */ jsx(Skeleton, { className: "h-64 w-64 rounded-2xl hidden lg:block" })
      ] }) }) })
    ] })
  ] }) });
}
function StoreCard({
  store,
  viewMode,
  language,
  isRTL
}) {
  const name = language === "ar" && store.name_ar ? store.name_ar : store.name || store.store_name || store.title || "Store";
  const description = language === "ar" && store.description_ar ? store.description_ar : store.description || "";
  const logo = store.profile_picture_url || store.logo || store.logo_url || store.image_url || "";
  const profileImage = store.profile_image || store.profile_image_url || store.banner_image || store.cover_image || "";
  const dealsCount = store.total_offers || store.active_deals_count || store.deals_count || 0;
  const isFeatured = store.featured || store.is_featured;
  const storeName = store.name || store.store_name || store.title || "";
  const slug = store.slug || storeName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (viewMode === "list") {
    return /* @__PURE__ */ jsx(Link, { to: `/store/${slug}`, children: /* @__PURE__ */ jsxs("div", { className: `group bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all overflow-hidden`, children: [
      profileImage && /* @__PURE__ */ jsxs("div", { className: "relative h-32 w-full overflow-hidden", children: [
        /* @__PURE__ */ jsx(
          ImageWithFallback,
          {
            src: profileImage,
            alt: name,
            className: "w-full h-full object-cover"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-transparent to-black/20" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `flex ${isRTL ? "flex-row-reverse" : ""} items-center gap-6 p-6 ${profileImage ? "-mt-10 relative" : ""}`, children: [
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: `h-20 w-20 rounded-xl border-2 overflow-hidden flex items-center justify-center p-2 ${profileImage ? "border-white bg-white shadow-lg" : "border-[#E5E7EB] bg-white"}`, children: logo ? /* @__PURE__ */ jsx(
          ImageWithFallback,
          {
            src: logo,
            alt: name,
            className: "w-full h-full object-contain"
          }
        ) : /* @__PURE__ */ jsx(Store, { className: "h-10 w-10 text-[#9CA3AF]" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: `flex-1 ${isRTL ? "text-right" : "text-left"}`, children: [
          /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 mb-2 ${isRTL ? "flex-row-reverse" : ""}`, children: [
            /* @__PURE__ */ jsx("h3", { className: "text-[#111827]", style: { fontSize: "20px", fontWeight: 600 }, children: name }),
            isFeatured && /* @__PURE__ */ jsxs(Badge, { className: "bg-[#FEF3C7] text-[#92400E] border-[#F59E0B]", children: [
              /* @__PURE__ */ jsx(Star, { className: `h-3 w-3 ${isRTL ? "ml-1" : "mr-1"} fill-current` }),
              language === "en" ? "Featured" : "مميز"
            ] })
          ] }),
          description && /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] text-sm mb-3 line-clamp-2", children: description }),
          /* @__PURE__ */ jsx("div", { className: `flex items-center gap-4 text-sm ${isRTL ? "flex-row-reverse" : ""}`, children: /* @__PURE__ */ jsxs("span", { className: "text-[#5FB57A] flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Tag, { className: "h-4 w-4" }),
            dealsCount,
            " ",
            language === "en" ? "deals" : "عروض"
          ] }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full bg-[#E8F3E8] flex items-center justify-center group-hover:bg-[#5FB57A] transition-colors", children: /* @__PURE__ */ jsx(ChevronDown, { className: `h-5 w-5 text-[#5FB57A] group-hover:text-white ${isRTL ? "rotate-90" : "-rotate-90"}` }) }) })
      ] })
    ] }) });
  }
  return /* @__PURE__ */ jsx(Link, { to: `/store/${slug}`, children: /* @__PURE__ */ jsxs("div", { className: "group bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all overflow-hidden", children: [
    profileImage ? /* @__PURE__ */ jsxs("div", { className: "relative h-32 w-full overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        ImageWithFallback,
        {
          src: profileImage,
          alt: name,
          className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-transparent to-black/30" }),
      isFeatured && /* @__PURE__ */ jsx("div", { className: `absolute top-3 ${isRTL ? "right-3" : "left-3"}`, children: /* @__PURE__ */ jsxs(Badge, { className: "bg-[#F59E0B] text-white border-0 shadow-lg", children: [
        /* @__PURE__ */ jsx(Star, { className: `h-3 w-3 ${isRTL ? "ml-1" : "mr-1"} fill-current` }),
        language === "en" ? "Featured" : "مميز"
      ] }) })
    ] }) : (
      /* Featured Badge - No Profile Image */
      isFeatured && /* @__PURE__ */ jsx("div", { className: `bg-[#FEF3C7] px-4 py-2 border-b-2 border-[#111827] ${isRTL ? "text-right" : "text-left"}`, children: /* @__PURE__ */ jsxs(Badge, { className: "bg-[#F59E0B] text-white border-0", children: [
        /* @__PURE__ */ jsx(Star, { className: `h-3 w-3 ${isRTL ? "ml-1" : "mr-1"} fill-current` }),
        language === "en" ? "Featured Store" : "متجر مميز"
      ] }) })
    ),
    /* @__PURE__ */ jsxs("div", { className: `p-6 ${profileImage ? "-mt-8 relative" : ""}`, children: [
      /* @__PURE__ */ jsx("div", { className: `h-24 w-24 mx-auto mb-4 rounded-xl border-2 overflow-hidden flex items-center justify-center ${profileImage ? "border-white bg-white shadow-lg p-0" : "border-[#E5E7EB] bg-white p-0"}`, children: logo ? /* @__PURE__ */ jsx(
        ImageWithFallback,
        {
          src: logo,
          alt: name,
          className: "w-full h-full object-contain"
        }
      ) : /* @__PURE__ */ jsx(Store, { className: "h-12 w-12 text-[#9CA3AF]" }) }),
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("h3", { className: "mb-2 text-[#111827]", style: { fontSize: "18px", fontWeight: 600 }, children: name }),
        description && /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] text-sm mb-4 line-clamp-2", children: description }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-sm text-[#5FB57A]", children: [
          /* @__PURE__ */ jsx(Tag, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxs("span", { style: { fontWeight: 600 }, children: [
            dealsCount,
            " ",
            language === "en" ? "Active Deals" : "عروض نشطة"
          ] })
        ] })
      ] })
    ] })
  ] }) });
}

function BlogPage() {
  const { t, isRTL, language } = useLanguage();
  const { country } = useCountry();
  const { data: ssrData } = useSSRData();
  const hasSSRData = ssrData && ssrData.articles;
  const [articles, setArticles] = useState(hasSSRData ? ssrData.articles || [] : []);
  const [displayedArticles, setDisplayedArticles] = useState(hasSSRData ? ssrData.articles?.slice(0, 12) || [] : []);
  const [loading, setLoading] = useState(!hasSSRData);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);
  const ITEMS_PER_PAGE = 12;
  useEffect(() => {
    if (hasSSRData && ssrData.articles) {
      setHasMore(ssrData.articles.length > ITEMS_PER_PAGE);
    }
  }, [hasSSRData, ssrData]);
  useEffect(() => {
    if (hasSSRData && !loading) {
      return;
    }
    fetchArticles();
  }, [country, language]);
  const fetchArticles = async () => {
    try {
      setLoading(true);
      const countryValue = getCountryValue(country);
      const { projectId, publicAnonKey } = await Promise.resolve().then(() => info);
      const url = countryValue ? `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/articles?country=${countryValue}` : `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/articles`;
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.articles && result.articles.length > 0) {
        setArticles(result.articles);
        setDisplayedArticles(result.articles.slice(0, ITEMS_PER_PAGE));
        setHasMore(result.articles.length > ITEMS_PER_PAGE);
      } else {
        setArticles([]);
        setDisplayedArticles([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
      setArticles([]);
      setDisplayedArticles([]);
    } finally {
      setLoading(false);
      setPage(1);
    }
  };
  const getFilteredArticles = useCallback(() => {
    let filtered = [...articles];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((article) => {
        const title = getArticleTitle(article, language).toLowerCase();
        const excerpt = getArticleExcerpt(article, language).toLowerCase();
        const author = getArticleAuthor(article, language).toLowerCase();
        return title.includes(query) || excerpt.includes(query) || author.includes(query);
      });
    }
    filtered.sort((a, b) => {
      const aFeatured = a.featured || a.is_featured ? 1 : 0;
      const bFeatured = b.featured || b.is_featured ? 1 : 0;
      if (aFeatured !== bFeatured) {
        return bFeatured - aFeatured;
      }
      const aDate = new Date(a.published_at || a.created_at || 0).getTime();
      const bDate = new Date(b.published_at || b.created_at || 0).getTime();
      return bDate - aDate;
    });
    return filtered;
  }, [articles, searchQuery, language]);
  useEffect(() => {
    const filtered = getFilteredArticles();
    setDisplayedArticles(filtered.slice(0, ITEMS_PER_PAGE));
    setPage(1);
    setHasMore(filtered.length > ITEMS_PER_PAGE);
  }, [searchQuery, getFilteredArticles]);
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const filtered = getFilteredArticles();
    const nextPage = page + 1;
    const start = 0;
    const end = nextPage * ITEMS_PER_PAGE;
    setTimeout(() => {
      setDisplayedArticles(filtered.slice(start, end));
      setPage(nextPage);
      setHasMore(filtered.length > end);
      setLoadingMore(false);
    }, 500);
  }, [page, hasMore, loadingMore, getFilteredArticles]);
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loadMore]);
  function getArticleTitle(article, lang) {
    if (lang === "ar") {
      return article.title_ar || article.title || "Article";
    }
    return article.title || "Article";
  }
  function getArticleExcerpt(article, lang) {
    if (lang === "ar") {
      return article.excerpt_ar || article.excerpt || "";
    }
    return article.excerpt || "";
  }
  function getArticleAuthor(article, lang) {
    if (lang === "ar") {
      return article.author_ar || article.author || (language === "en" ? "Anonymous" : "مجهول");
    }
    return article.author || "Anonymous";
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-8 md:py-12", children: [
    /* @__PURE__ */ jsxs("div", { className: `mb-8 ${isRTL ? "text-right" : "text-left"}`, children: [
      /* @__PURE__ */ jsx("h1", { className: "mb-3 text-[#111827]", style: { fontSize: "48px", fontWeight: 700 }, children: language === "en" ? "Shopping Guides" : "أدلة التسوق" }),
      /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] text-lg", children: language === "en" ? "Expert tips, tricks, and insights to help you save more" : "نصائح الخبراء والحيل والرؤى لمساعدتك على توفير المزيد" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `mb-8 bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] p-4 md:p-6`, children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { className: `absolute top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280] ${isRTL ? "right-3" : "left-3"}` }),
        /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            placeholder: language === "en" ? "Search articles..." : "ابحث عن المقالات...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: `${isRTL ? "pr-10 pl-4" : "pl-10 pr-4"} h-12 border-2 border-[#111827] rounded-xl`
          }
        ),
        searchQuery && /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setSearchQuery(""),
            className: `absolute top-1/2 -translate-y-1/2 ${isRTL ? "left-3" : "right-3"}`,
            children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5 text-[#6B7280] hover:text-[#111827]" })
          }
        )
      ] }),
      searchQuery && /* @__PURE__ */ jsxs("div", { className: `mt-4 flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`, children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-[#6B7280]", children: language === "en" ? "Searching for:" : "البحث عن:" }),
        /* @__PURE__ */ jsxs(
          Badge,
          {
            variant: "secondary",
            className: "bg-[#E8F3E8] text-[#111827] border border-[#5FB57A]",
            children: [
              searchQuery,
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setSearchQuery(""),
                  className: `${isRTL ? "mr-2" : "ml-2"} hover:text-[#EF4444]`,
                  children: /* @__PURE__ */ jsx(X, { className: "h-3 w-3" })
                }
              )
            ]
          }
        )
      ] })
    ] }),
    loading ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-96 rounded-2xl" }, i)) }) : displayedArticles.length === 0 ? (
      /* Empty State */
      /* @__PURE__ */ jsxs("div", { className: "text-center py-16", children: [
        /* @__PURE__ */ jsx(BookOpen, { className: "h-16 w-16 text-[#9CA3AF] mx-auto mb-4" }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl text-[#111827] mb-2", style: { fontWeight: 600 }, children: language === "en" ? "No articles found" : "لم يتم العثور على مقالات" }),
        /* @__PURE__ */ jsx("p", { className: "text-[#6B7280]", children: language === "en" ? "Try adjusting your search" : "حاول تعديل البحث" })
      ] })
    ) : /* @__PURE__ */ jsxs(Fragment, { children: [
      displayedArticles.length > 0 && (displayedArticles[0].featured || displayedArticles[0].is_featured) && /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsx(
        ArticleCardFeatured,
        {
          article: displayedArticles[0],
          language,
          isRTL
        }
      ) }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: displayedArticles.slice(displayedArticles[0].featured || displayedArticles[0].is_featured ? 1 : 0).map((article) => /* @__PURE__ */ jsx(
        ArticleCard,
        {
          article,
          language,
          isRTL
        },
        article.id
      )) }),
      hasMore && /* @__PURE__ */ jsx("div", { ref: loadMoreRef, className: "mt-8 flex justify-center", children: loadingMore && /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full", children: [...Array(3)].map((_, i) => /* @__PURE__ */ jsx(Skeleton, { className: "h-96 rounded-2xl" }, i)) }) })
    ] })
  ] }) });
}
function ArticleCardFeatured({
  article,
  language,
  isRTL
}) {
  const title = language === "ar" && article.title_ar ? article.title_ar : article.title || "Article";
  const excerpt = language === "ar" && article.excerpt_ar ? article.excerpt_ar : article.excerpt || "";
  const author = language === "ar" && article.author_ar ? article.author_ar : article.author || (language === "en" ? "Anonymous" : "مجهول");
  const image = article.featured_image || article.featured_image_url || article.image_url || "";
  const articleTitle = article.title || article.title_ar || "";
  const slug = article.slug || articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const date = article.published_at || article.created_at;
  const readingTime = article.reading_time || 5;
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date2 = new Date(dateString);
    if (language === "ar") {
      return date2.toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
    }
    return date2.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };
  return /* @__PURE__ */ jsx(Link, { to: `/guides/${slug}`, children: /* @__PURE__ */ jsx("div", { className: `group bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all overflow-hidden`, children: /* @__PURE__ */ jsxs("div", { className: `grid md:grid-cols-2 gap-0 ${isRTL ? "md:grid-flow-dense" : ""}`, children: [
    /* @__PURE__ */ jsxs("div", { className: `relative h-64 md:h-full overflow-hidden ${isRTL ? "md:col-start-2" : ""}`, children: [
      image ? /* @__PURE__ */ jsx(
        ImageWithFallback,
        {
          src: image,
          alt: title,
          className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        }
      ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-gradient-to-br from-[#E8F3E8] to-[#5FB57A] flex items-center justify-center", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-24 w-24 text-white opacity-50" }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" }),
      /* @__PURE__ */ jsx("div", { className: `absolute top-4 ${isRTL ? "right-4" : "left-4"}`, children: /* @__PURE__ */ jsx(Badge, { className: "bg-[#F59E0B] text-white border-0", children: language === "en" ? "Featured" : "مميز" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `p-8 flex flex-col justify-center ${isRTL ? "md:col-start-1 text-right" : "text-left"}`, children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-4 text-[#111827] group-hover:text-[#5FB57A] transition-colors", style: { fontSize: "32px", fontWeight: 700, lineHeight: "1.2" }, children: title }),
      excerpt && /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] mb-6 line-clamp-3", style: { fontSize: "18px" }, children: excerpt }),
      /* @__PURE__ */ jsxs("div", { className: `flex flex-wrap items-center gap-4 text-sm text-[#6B7280] ${isRTL ? "flex-row-reverse" : ""}`, children: [
        /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`, children: [
          /* @__PURE__ */ jsx(User, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: author })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`, children: [
          /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: formatDate(date) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`, children: [
          /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxs("span", { children: [
            readingTime,
            " ",
            language === "en" ? "min read" : "دقيقة"
          ] })
        ] })
      ] })
    ] })
  ] }) }) });
}
function ArticleCard({
  article,
  language,
  isRTL
}) {
  const title = language === "ar" && article.title_ar ? article.title_ar : article.title || "Article";
  const excerpt = language === "ar" && article.excerpt_ar ? article.excerpt_ar : article.excerpt || "";
  language === "ar" && article.author_ar ? article.author_ar : article.author || (language === "en" ? "Anonymous" : "مجهول");
  const image = article.featured_image || article.featured_image_url || article.image_url || "";
  const articleTitle = article.title || article.title_ar || "";
  const slug = article.slug || articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const date = article.published_at || article.created_at;
  const readingTime = article.reading_time || 5;
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date2 = new Date(dateString);
    if (language === "ar") {
      return date2.toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" });
    }
    return date2.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };
  return /* @__PURE__ */ jsx(Link, { to: `/guides/${slug}`, children: /* @__PURE__ */ jsxs("div", { className: "group bg-white rounded-2xl border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all overflow-hidden h-full flex flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "relative h-48 overflow-hidden", children: [
      image ? /* @__PURE__ */ jsx(
        ImageWithFallback,
        {
          src: image,
          alt: title,
          className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        }
      ) : /* @__PURE__ */ jsx("div", { className: "w-full h-full bg-gradient-to-br from-[#E8F3E8] to-[#5FB57A] flex items-center justify-center", children: /* @__PURE__ */ jsx(BookOpen, { className: "h-12 w-12 text-white opacity-50" }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `p-6 flex-1 flex flex-col ${isRTL ? "text-right" : "text-left"}`, children: [
      /* @__PURE__ */ jsx("h3", { className: "mb-3 text-[#111827] group-hover:text-[#5FB57A] transition-colors line-clamp-2", style: { fontSize: "20px", fontWeight: 600 }, children: title }),
      excerpt && /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] text-sm mb-4 line-clamp-3 flex-1", children: excerpt }),
      /* @__PURE__ */ jsxs("div", { className: `flex flex-wrap items-center gap-3 text-xs text-[#6B7280] pt-4 border-t border-[#E5E7EB] ${isRTL ? "flex-row-reverse" : ""}`, children: [
        /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`, children: [
          /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
          /* @__PURE__ */ jsx("span", { children: formatDate(date) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`, children: [
          /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
          /* @__PURE__ */ jsxs("span", { children: [
            readingTime,
            " ",
            language === "en" ? "min" : "د"
          ] })
        ] })
      ] })
    ] })
  ] }) });
}

function PrivacyPage() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const englishContent = `

### What information we collect, and how we use it.

("Tuut", "we", "us", "our") is committed to protecting the privacy of your personally identifiable information. We provide this privacy policy ("Privacy Policy") in order to explain our online information practices and the choices you can make about the way your information is used by us. You must agree to this Privacy Policy, in its entirety, including our use of cookies in order to register an account ("Account") with "Tuut" website ("Website") and to use the Website. If you do not agree to the "Tuut" Privacy Policy in its entirety, you are not authorized to use the Website.

#### Personally Identifiable Information
We collect personally identifiable information when you register for an Account or otherwise choose to provide personally identifiable information to us. Personally identifiable information is any information that can be used to identify or locate a particular person or entity. This may include but is not limited to: business entity name and/or your title with the applicable business entity, as well as your personal and/or business entity related e-mail address, mailing address, daytime and/or cellular telephone numbers, fax number, account information (or other information that we require in order to pay any amounts due to you under the Website), IP address and/or any other information requested on the applicable Subscriber registration form.

#### Non-Personally Identifiable Information
We will collect certain non-personally identifiable information about you when you visit certain pages of this Website and/or register for an Account on the Website, such as the type of browser you are using (e.g., Chrome, Internet Explorer), the type of operating system you are using, (e.g., Windows or Mac OS) and the domain name of your Internet service provider (ISP) and share such information with our Third-Party Agent. We use the non-personally identifiable information that we collect to improve the design and content of the Website and to enable us to personalize your Internet experience. We also may use this information in the aggregate to analyze Website usage.

#### Cookies and Web Beacons
To enhance your experience with the Website, we use "cookies." Cookies are small packets of data stored on your computer used to store your preferences. Cookies, by themselves, do not tell us your e-mail address or other personally identifiable information. You may set your browser to warn you that cookies are in use, or to block the use of cookies. We use strictly necessary cookies to allow you to move around the Website and log in to your Account, and functional cookies to improve the services and support available to you. Accepting strictly necessary cookies is a condition of using the Website. You can control whether or not functional cookies are used, though preventing them may mean some services and support will be unavailable. Cookies may be managed for us by third parties; where this is the case, we do not allow the third party to use the cookies for any purpose other than as necessary to provide the services. We may additionally collect information using Web beacons, which are commonly referred to in the industry as web bugs, pixel tags or Clear GIFs. Web beacons are electronic images that may be used on the Website, in your Account, or in our emails to deliver cookies, count visits and determine if an email has been opened and acted upon.

#### Use of Information
We use your personally identifiable information: (a) to send you information regarding your Account and the Website; (b) to track your compliance with the Terms and Conditions ("Terms and Conditions"); and/or (c) for validation, suppression, content improvement and feedback purposes. In addition, we may use your IP address for the purposes identified above, as well as to analyze trends, administer the Website, track users' movements, gather broad demographic information for aggregate use, and to confirm that a particular individual affirmed his/her consent to specific legal terms (e.g. a clickwrap license agreement). You agree that we, or our Third Party Agent, may contact you at any time regarding your Account or the Website and/or any other information that we may deem appropriate for you to receive in connection with your Account on the Website. You may update your contact preferences as set forth below.

#### Information Sharing
As a general rule, and other than in connection with the limited exceptions set forth below, we will not sell, share or rent your personally identifiable information to or with non-related parties. Notwithstanding the foregoing, we may share information with 3rd parties, only where we have a lawful basis to do so. In respect of your personal data, the lawful basis for processing may include: where we are required to do so in accordance with legal or regulatory obligations – If we are required to disclose your information by a judicial, governmental or regulatory authority we will do so under the legal basis of complying with mandatory legal requirements imposed on us. where it is in our legitimate interests to process your personal data – in case of a serious abuse of rights of the Privacy Policy or violation of any applicable law, we will share your information with competent authorities and with third parties (such as legal counsels and advisors), for the purpose of handling of the violation under the legal basis of defending and enforcing against violation and breaches that are harmful to our business. Contract performance – where it is necessary for us to process your data in order to establish, operate and manage your account in our website. Legitimate interests – to improve our service and make your experience as enjoyable as possible by conducting technical diagnostics, research analyses and obtaining feedback from time to time, in order to personalize and modify our website and services. We will share your personal data with our trusted vendors, such as Google and Apple, who assist us with marketing optimization, analyzing data, payment processing and analysis of our services.

#### Security
We endeavor to safeguard and protect our Account holders' information. When our website users submit personally identifiable information to the Website, their personally identifiable information is protected both online and offline. When our registration process asks registrants to submit information such as bank account information and/or credit card information ("Sensitive Information"), and when we transmit such Sensitive Information, that Sensitive Information is encrypted and protected. The Third-Party Agent servers that we utilize to store personally identifiable information are kept in a secure physical environment. The Third-Party Agent has security measures in place to protect the loss, misuse and alteration of personally identifiable information stored on its servers. In compliance with applicable federal and state laws, we shall notify and any applicable regulatory agencies in the event that we learn of an information security breach with respect to your personally identifiable information. You will be notified via e-mail in the event of such a breach. Please be advised that notice may be delayed in order to address the needs of law enforcement, determine the scope of network damage, and to engage in remedial measures. You acknowledge that you provide your personally identifiable information to us with knowledgeable consent and at your own risk.

#### Opting Out of Receiving E-mail
You may at any time choose to stop receiving emails containing general information regarding "Tuut" by following the instructions at the end of each such email or by contacting us. Should you be contacted by our Third-Party Agent through email, you can follow the instructions at the end of each such email to stop receiving such emails. There may be a short delay of up to several business days while your request is being verified, deployed and processed across our servers. Notwithstanding the foregoing, we may continue to contact you for the purpose of communicating information relating to your Account, as well as to respond to any inquiry or request made by you.

#### Customer Support Correspondence
Correspondences with our support team will be collected and stored, including your contact details and the information provided by you during the various correspondences, in order to provide support, improve our services and for our exercise or defense of potential legal claims (only for the appropriate period under applicable law).

#### Notification of Changes
We reserve the right to change or update this Privacy Policy at any time by posting a clear and conspicuous notice on the Website explaining that we are changing our Privacy Policy. All Privacy Policy changes will take effect immediately upon their posting on the Website. Please check the Website periodically for any changes. Your continued use of the Website and/or acceptance of our e-mail communications following the posting of changes to this Privacy Policy will constitute your acceptance of any and all changes.

#### Comments and Questions
If you have any comments or questions about our privacy policy, please contact us.
  `;
  const arabicContent = `

موقِعُنا "توت" (نحن في "توت" ) يَلتزُم بحمايةِ خصوصيّة بياناتك الشّخصية, وسريّة معلوماتك الشخصية. ونحنُ في هذا البيان نُحيطكَ علماً بِسياسَتنا بشأن هذه الخصوصية (سياسة الخُصوصيّة), لنوضّح لك أُسلوب ممارساتنا وتعاملاتنا مع هذه المعلومات عبر الإنترنت, ولكي نحدّد لك حقوقك والبدائلَ المتاحة لك فيما يتعلّق بطريقة استعمالنا لمعلوماتك تلك. يتوجّبُ عليك مصادقة هذه السّياسة والموافقة عليها بأكملِها وبما في ذلك استخدامنا لِ كوكيز (ملفات تعريف الارتباط cookies) في حالة عدم موافقتك على سياسة الخصوصية هذه بكاملها، فلا يسمحُ لك باستخدام موقع "توت" أو التطبيق على حدّ سواء.

## معلومات التعريف الشخصيّة

اننا نجمع معلوماتك الشخصيّة حينما تدخل وتنضم وتستخدم عروض وخدمات "توت", أو يمكنك بالمقابل تقديم معلوماتك الشخصية لنا مباشرة  إن فضّلت ذلك. المقصودُ هنا بمعلومات التّعريفِ الشّخصية هوَ أيّة معلوماتٍ يمكن استخدامها للتّعريف عنك أو عن كيان تجاري معيّن وأيضاً تحديدُ موقعك. قد يشمل ذلك على سبيل المثال لا الحصر: اسم الكيان التجاري و / أو تعريف مركزك في الكيان التجاري. وكذلك عنوان البريد الإلكتروني الخاص بك و / أو البريد الإلكتروني للكيان التجاري ذي الصلة ، والعنوان البريدي ، و رقم هاتفك في خلال ساعات النهار و / أو أرقام الهواتف الخلوية ، رقم الفاكس أو تفاصيل الحساب أو عنوان IP  الذي يحتوي على البروتوكول أو السّجل الإنترنتي الخاص بك/ أو أي معلومات أخرى مطلوبة بشأن التسجيل المشترك في نموذج التعبئة.

### معلومات ليست للتعريف الشّخصي

إننا نقوم بجمع معلوماتٍ معينة أخرى عنك لا تحمل الطابع الشخصيّ لحظة دخولك موقع "توت"  و / أو زيارتك لصفحاتٍ معينة في هذا الموقع ، مثلُ نوعِ المتصفّح الذي تستخدمه, (على سبيل المثال، Chrome ، Internet Explorer ) ونوعُ نظام التشغيل الذي تستخدمه, على سبيل المثال, Windows  أو Mac OS واسم المجال الخاص بتزويدك خدمات الإنترنت (ISP) ومن الممكن أن نشارك هذه المعلومات مع وكيل الطرف الثالث الخاص بنا. نحن نستخدم المعلومات غير الشخصية التي نجمعها لتحسين تصميم ومحتوى الموقع, و لتمكيننا من ملاءمة وتطابق الموقع  لتجربتك الإنترنتية الخاصة بك. يجوز لنا أيضًا استخدام مجموعة المعلومات المتراكمة في المجمل لتحليل استخدام الموقع.

### الكوكيز ومنارات الويب

لتحسين تجربتك مع الموقع ، نستخدم كوكيز وهي عبارة عن حزم صغيرة من البيانات المخزنة على حاسوبك المستخدمة لتخزين تفضيلاتك. كوكيز, في حد ذاتها, لا تدلنا عنوان بريدك الإلكتروني أو غيرها من المعلومات الشخصية. يمكنك إعداد المتصفح ليقوم بتحذيرك من استخدام كوكيز, أو الحظر وإلغاء استخدام كوكيز نهائياً. نستخدم كوكيز الضرورية فقط وذلك لتمكينك التحرك في الموقع والدخول إلى حسابك, وكوكيز الوظيفية قد نستخدمها لهدف تحسين الخدمات وتقديم الدّعم المناسب لك. إنّ قبولك لاستخدامنا كوكيز هو شرط لاستخدامك الموقع. يمكنك التحكم في استخدام كوكيز الوظيفية أم لا, ولكن خذ بعين الاعتبار أن منعها قد يعني أن بعض الخدمات والدعم لن يكون متاحًا. وقد نطلب من  إدارة كوكيز لنا بواسطة أطراف ثالثة. في هذه الحالة ، لا نسمح للطرف الثالث باستخدام كوكيز لأيّ غرضٍ آخر غير ضروري سوى تقديم الخدمات. وقد نقوم أيضًا بجمع المعلومات باستخدام إشارات الويب, والتي يشار إليها عادة في الصناعة مثل عوامل الخلل في الويب أو علامات البكسل أو ملفات GIF. منارات الويب هي صور إلكترونية يمكن استخدامها على الموقع, في حسابك, أو في رسائل البريد الإلكتروني الخاصة بنا لتقديم كوكيز, وحساب الزيارات وتحديد ما إذا كان قد تم فتح بريد إلكتروني وتم التصرف بناءً عليه.

### استخدام المعلومات

نستخدم معلوماتك الشخصية: لتتبع امتثالك للشروط والأحكام ("الشروط والأحكام") ؛  و / أو للتصديق, القمع, , تحسين المحتوى ولمعرفة التعليقات وردود الفعل المختلفة. بالإضافة إلى ذلك ، قد نستخدم عنوان IP  الخاص بك للأغراض المحددة أعلاه, بالإضافة إلى تحليل الاتجاهات الدارجة على نطاق واسع وإدارة الموقع وتتبع حركات المستخدمين وجمع معلومات ديموغرافية واسعة للاستخدام الكلي وتأكيد موافقته على شروط قانونية محددة. على سبيل المثال (اتفاقية ترخيص clickwrap – مجموعة النقرات). أنت ملزم أن توافق على أننا, قد نتصل بك في أي وقت بخصوص أي معلومات أخرى قد نعتبرها مناسبة لتتلقى. يمكنك تحديث تفضيلات الاتصال الخاصة بك كما هو موضح أدناه و وتأكيد ذلك على وجه الخصوص نتأكد أن الشخص موافقته على شروط قانونية محددة. يمكنك إعلامنا بأي تحديث أو تفضيلات الاتصال الخاصة بك كما هو موضح أدناه.

### مشاركة المعلومات
كقاعدة عامة, عدا الاستثناءات التي سيتم طرحها, لن يجوز لنا بيع معلوماتك الشخصية, مشاركتها أو تأجيرها للآخرين. بغض النظر عما سبق, قد نشارك معلوماتك مع أطراف ثالثة, وذلك فقط عندما يكون لدينا أساس قانوني للقيام بذلك. فيما يتعلق ببياناتك الشخصية, قد يتضمن الأساس القانوني للمعالجة: أنّه حيث يُطلب منا القيام بذلك وفقًا لالتزامات قانونية أو تنظيمية – إذا طُلب منا الكشف عن معلوماتك من قبل سلطة قضائية أو حكومية أو تنظيمية, فسنضطر لفعل ذلك بموجب المتطلبات القانونية الإلزامية المفروضة علينا. إذا كان من مصلحتنا الشرعية معالجة بياناتك الشخصية – في حالة حدوث انتهاك خطير لحقوق الخصوصية أو انتهاك أي قانون سارٍ, سنقوم بمشاركة معلوماتك مع السلطات المختصة ومع أطراف ثالثة (مثل المستشار القانوني و المستشارين), لغرض التعامل مع الانتهاك بموجب الأساس القانوني للدفاع والتنفيذ ضد المخالفات التي تضر بعملنا.

### تَأدية العقد
الاهتمامات المشروعة – لتحسين خدماتنا وجعل تجربتك ممتعة قدر الإمكان عن طريق إجراء التشخيص التقني, وتحليلات الأبحاث والحصول على ردود الفعل والتعليقات من وقت لآخر, بهدف جعل موقعنا شخصياً أكثر ومن أجل تعديل الموقع  وخدماتنا سنشارك بياناتك الشخصية مع موردينا الموثوقين, أمثال جوجل و أبل, الذين يساعدوننا في تحسين التسويق, تحليل البيانات, ومعالجة عمليات الدفع وتحليل خدماتنا.

### الأمن
نحن نسعى لحماية معلومات أصحاب الحسابات لدينا. عندما يقوم مستخدمو موقع الويب الخاص بنا بتقديم معلومات تعريف شخصية إلى شبكة الشركات التابعة ، فإن معلومات التعريف الشخصية الخاصة بهم محمية داخل الإنترنت وخارجه. أثناء عملية التسجيل, حين نطلب من المسجلين تقديم معلومات عن الحساب البنكي- المصرفي و / أو معلومات بطاقة الائتمان ("المعلومات الحساسة"), وعندما نقوم بنقل هذه المعلومات الحساسة ، يتم تشفير المعلومات الحساسة وحمايتها. خدمات وكلاء الطرف الثالث التي نستخدمها لتخزين معلومات التعريف الشخصية يتم الاحتفاظ بها في بيئة مادية آمنة. خدمات وكلاء الطرف الثالث تقوم بإجراءات أمنية لحماية فقدان المعلومات الشخصية التي يتم تخزينها, في حالة سوء استخدامها, وتعديلها. امتثالًا للقوانين الفيدرالية والمدنيّة المعمول بها ، سنقوم بإبلاغ الجهات التنظيمية سارية في حال علمنا بخرق أمن المعلومات فيما يتعلق بمعلومات التعريف الشخصية الخاصة بك. وسيتم إعلامُكَ عبر البريد الإلكتروني في حالة حدوث مثل هذا الخرق. يرجى العلم بأن الإخطار قد يتأخر فترة من أجل تلبية احتياجات تنفيذ القانون ، وتحديد نطاق ضرر الحادث للشبكة, والقيام بالتدابير العلاجية. عليك أن تقرّ أنك تزودنا بمعلوماتك الشخصية بموافقتك وبعد اطلاع وعلى مسؤوليتك الخاصة.

### إلغاء الاشتراك في تلقي البريد الإلكتروني

في أي وقت تختار, يمكنك إيقاف تلقي رسائل البريد الإلكتروني التي تحتوي على معلومات عامة بخصوص  المُــوفـّــر وذلك باتباع التعليمات الواردة في نهاية كل بريد إلكتروني أو عن طريق الاتصال بنا. إذا اتصل بك وكيل الطرف الثالث عبر البريد الإلكتروني فيمكنك اتباع التعليمات الواردة في نهاية كل بريد إلكتروني لإيقاف تلقي مثل هذه الرسائل الإلكترونية. قد يكون هناك تأخير قصير يصل إلى عدة أيام عمل أثناء التحقق من طلبك ونشره ومعالجته في جميع أنحاء موقعنا.  بغض النظر عما سبق ، يجوز لنا الاستمرار في الاتصال بك لغرض توصيل المعلومات المتعلقة بحسابك ، وكذلك الرد على أي استفسار أو طلب تقدمت به.

### المراسلات لدعم العملاء

سيتم تجميع المراسلات مع فريق الدعم لدينا وتخزينها ، بما في ذلك تفاصيل الاتصال الخاصة بك والمعلومات التي قدمتها خلال المراسلات المختلفة ، من أجل تقديم الدعم ، وتحسين خدماتنا وممارستنا أو الدفاع عن المطالبات القانونية المحتملة (فقط لفترة بموجب القانون المعمول به).

### الإخطار بالتغييرات

نحن نحتفظ بحقنا في تغيير أو تحديث سياسة الخصوصية هذه في أي وقت من خلال نشر إشعار واضح وملحوظ على الموقع يشرح أننا نقوم بتغيير سياسة الخصوصية الخاصة بنا. سيتم تفعيل جميع تغييرات سياسة الخصوصية فور نشرها على الموقع. يرجى التحقق من الموقع بشكل دوري لأية تغييرات. إن استمرارك في استخدام الموقع و / أو قبول اتصالاتنا عبر البريد الإلكتروني بعد نشر التغييرات على سياسة الخصوصية هذه سيشكل موافقتك على أي وجميع التغييرات.

### التعليقات والأسئلة
إذا كان لديك أيّة تعليقات أو أسئلة حول سياسة الخصوصية الخاصة بنا ، يرجى الاتصال بالدعم هنا.
  `;
  const content = isRTL ? arabicContent : englishContent;
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm p-8", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-8", children: isRTL ? "سياسة الخصوصية" : "Privacy Policy" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `prose max-w-none text-gray-700 leading-relaxed ${isRTL ? "text-right" : "text-left"}`,
        dangerouslySetInnerHTML: {
          __html: content.replace(/\n/g, "<br />").replace(
            /### (.*)/g,
            '<h3 class="text-xl font-semibold mt-6 mb-3 text-gray-900">$1</h3>'
          ).replace(
            /#### (.*)/g,
            '<h4 class="text-lg font-medium mt-4 mb-2 text-gray-800">$1</h4>'
          ).replace(/• (.*)/g, '<li class="ml-4">$1</li>').replace(
            /^(\d+)\.\s/gm,
            '<div class="font-medium mt-3">$1.</div>'
          )
        }
      }
    )
  ] }) }) });
}

function TermsPage() {
  const { language } = useLanguage();
  const isRTL = language === "ar";
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const englishContent = `
### Accepting Terms of Use

Use of this Website tuut.shop ("tuut" "we" "our" "us") or any Website that replaces it or is added to it, including in the smartphone-enabled app (the "Website"), by you -the End User (the "End User" or "you"), submitting an offer to purchase, registering for the Website and/or opening an account on the Website constitutes an agreement to the following Terms of Use.

If you do not agree to the following Terms of Use ("Terms of Use" "Agreement"), you should refrain from using the Website.

We encourage you to re-read, from time to time, the Terms of Use and Privacy Policy to be up to date on changes.

You must be at least 18 years old to be eligible to use the Website.

You expressly consent to all the Terms of Use and Privacy Policy, and that you or anyone on your behalf will not make any claim against "tuut", the website owners, "tuut" managers, directors of "tuut", their agents, their affiliates and/or anyone on their behalf, other than claims related to breach of "tuut" obligations under the Terms of Use and Privacy Policy.

"tuut" reserves the right to change the Terms of Use from time to time, in its sole discretion. Any change will only apply to Coupons acquired after the change.

### Use of the Website

#### General

The Website provides a platform for merchants ("Merchants") to showcase discount Coupons for a specific web site and/or for that particular Offers ("Coupons"). "tuut" does not sell or provide the products or services presented on the Website, which may be purchased from the different businesses through the sale of Coupons. The products or services which can be used on Coupons sold on the Website are offered by the various businesses and not by "tuut".

The End User is solely responsible for protecting the confidentiality of the Website's password and/or anything related to it. You understand and agree that there may be interruptions in Website access or access to your account due to circumstances that are dependent on "tuut" as well as circumstances that are not dependent on "tuut". You hereby indemnify "tuut" for any damage and/or payment and/or loss you may incur as a result of the foregoing.

"tuut" will have the right, at any time, to change or any feature, including any content. "tuut" may stop disseminating any information, may change or discontinue any information transmission method. You hereby acknowledge that you are legally competent and legally sufficient to create a binding contract by law.

#### Changing Terms of Use and Privacy Policy

in addition to any notice permitted to be given under this Agreement, If "tuut" makes material changes to the Terms of Use, we shall provide you with a notification by email or by posting notice of the change to the Website. The changes in the Terms of Use and/or the Privacy Policy will apply immediately to all users of the Website. Your continued participation in this website will constitute your acceptance of such change. If the modifications are unacceptable to you, you may terminate using the Website. In addition, "tuut" may change, suspend or discontinue any aspect of an Offer or Link or remove, alter, or modify any tags, text, graphic or banner ad in connection with a Link.

#### End-User

Without derogating from the foregoing, "tuut" may prevent you from participating in any of the sales and/or offers, in part, in any of the following cases: if you have breached the Terms of Use. If you have committed an act or omission that may harm "tuut" or any third party, including the Company's clients, businesses and affiliates.

#### Intellectual Property, Copyright, and Trademarks

The Website is the sole property of "tuut". Any reproduction, distribution, transmission, posting, linking, or another modification of the Website without the express prior written consent of "tuut" is strictly prohibited.

Except as expressly stated herein, nothing in this Agreement is intended to grant you any rights to any of "tuut" trademarks, service marks, copyrights, patents or trade secrets. You agree that "tuut" may use any suggestion, comment or recommendation you choose to provide to "tuut" without compensation. All rights not expressly granted in this Agreement are reserved by "tuut".

#### Lack of responsibility

The End User hereby expressly agrees that the use of the Website is at its sole risk and risk. "tuut", its affiliates, employees, agents, affiliates, businesses, third parties providing content and licensors and all their directors, employees and agents do not represent or warrant that the use of the Website will be error free or shall be provided without interruption, nor shall they guarantee the accuracy, reliability of any information, service or Coupons provided through the Website.

"tuut" does not import, manufacture, market, sell and/or provide the product and/or service that you intend to purchase on the Website and therefore does not directly or indirectly bear any responsibility for the products, the products shipment and/or import into the country, their nature, their suitability and/or specification.

The products and services on the website are presented in good faith and under the responsibility of the business, and do not constitute a recommendation and/or opinion of the "tuut" regarding the nature of the products and/or services.

The Company will not be held liable for any illegal activity by the sale participants or any other party not under its full control. Without derogating from the foregoing, "tuut" will not be liable for any damage, whether direct or indirect, caused by use of the Website.

#### Indemnification

You hereby agree to indemnify, defend and hold harmless "tuut" and its Clients and their respective subsidiaries, affiliates, partners and licensors, shareholders, directors, officers, employees, owners and agents against any and all claims, actions, demands, liabilities, losses, damages, judgments, settlements, costs, and expenses (including reasonable attorney's fees and costs) based on (i) any failure or breach of this Agreement, including any breach of representation, warranty, covenant, restriction or obligation, (ii) any misuse by the End User of the Links, Coupons, Website and/or services or "tuut" intellectual property, or (iii) any claim related to any products or services, and the quality of any products or services.

#### Privacy

The End User hereby acknowledges that all discussions, ratings, comments, bulletin board service, chat rooms, and/or all messaging infrastructure, relays, and posts on the Website ("Communities") are public and not private, so third parties may read End User Communications Without his knowledge. "tuut" does not control or sponsor any content, message or information contained in any community and therefore "tuut" expressly disclaims any liability relating to communities and is not responsible for any consequences arising from the end user's participation in the communities. Any end-user information posted on the Website, whether in chat rooms, discussion rooms, message boards or otherwise, Is not information that is confidential. By posting comments, notices and/or other information on the Website, the End User grants "tuut" the right to use those comments, notices and/or other information for promotional, advertising, market research and for any other lawful purpose without limitation of territory, time Or any other restriction. For more information, please see "tuut"'s Privacy Policy.

#### Agreement Termination

"tuut" may terminate this Agreement at any time and for any reason and without cause, in its sole discretion and without having to notify the End User.

#### Third parties Content

The Website may contain links to third-party websites. These links are provided for your convenience only and do not imply endorsement by "tuut" of the content contained on such websites. The End User is aware that visiting a Web Website linked to on the Website may result in additional damages, including viruses, spyware, and other malware. If the end user decides to log on to a Web Website of A third party through a link appearing on the Website does so at his own risk and sole responsibility.

#### Emails

You hereby authorize "tuut" and/or anyone on its behalf to send you E-mails and messages. You also acknowledge and acknowledge that "tuut" may send you notices for the date of the expiry of the Coupon you have purchased.

In addition, by accepting these Terms of Use, you agree that "tuut" or anyone on its behalf may from time to time contact you with marketing and advertising offers, including through direct mail, text messages, text messages, e-mail correspondence, push notifications In the website app, or through any other means of communication.

#### Coupons- General

All Coupons from the Website or through the Website, including any Website linked to "tuut" (the "Coupons") are promotional Coupons which can be purchased from "tuut" in order to replace them with products and/or services at a discount to their regular price (not Including various discounts that the business gives from time to time). The Coupons can be purchased on the Website and in accordance with the terms and conditions applicable to each transaction and each business.

"tuut" allows you to purchase Coupons that can be redeemed in connection with the purchase of products and/or services from the business, subject to these Terms of Use and the relevant terms of the transaction. The businesses that provide the products/services are not "tuut", providing the relevant products and services is the sole responsibility of the different businesses.

#### Coupon purchase

"tuut" may, as well as any business, increase or decrease the minimum quantity during the sale of any Coupon. The purchase of the Coupons will constitute a limited contractual right to exercise the Coupons vis-à-vis the business that issued the Coupons only, which is subject to "tuut"'s contractual rights vis-à-vis that business Terms and Conditions.

For more information about "tuut" end-user personal information collection, please see "tuut"'s Privacy Policy.

#### The Coupons rights

The rights granted to each Coupon will be governed by the terms of each business providing the product/service and the terms of each specific Coupon, as they may appear from time to time on the Website and/or on the Coupon, in any case of conflict between the terms displayed on the Website and the Coupon, "tuut" shall have the absolute right to decide on what terms of use apply.

#### The products/services listed on the Website

"tuut" does not sell and/or provide the products and/or services presented on the Website. "tuut" provides the businesses within the Website as a platform for displaying and selling the products and services, using various sales methods. The sales page for each product and product showcases the specific terms for selling the product as provided by the various businesses.

The product images on the Website are for illustration purposes only and there may be differences between the product/service image and the product/service sold. Any information about the products including the price of the products are provided by the products/services providers. The responsibility for the information, its nature, and its reliability, therefore, rests entirely with the products/services providers.

#### Website registration

You must register on our website. You must accurately complete the registration form and not use any aliases or other means to mask your true identity or contact information. By entering these details you declare that these are your details and that they are correct, accurate and complete and that you own the credit card, e-mail, and telephone line. We may accept or reject your application at our sole discretion for any reason and will be under no obligation to provide you with any justification for our decision. "tuut" and/or the products/services providers reserve the right to cancel your participation/purchase for any reason at any time and without requiring reason, due to the submission of false, partial or inaccurate details.

#### Payment

All Prices shown in all sales methods include VAT, as required by law, unless otherwise explicitly stated.

#### Supply of products

Products/Services will be delivered in accordance with the terms of these Terms of Use and the Product/Service Coupons Sales Page. The Products/Services will be delivered by the products/services providers and under their sole responsibility in accordance with the terms set forth in these Terms of Use and the Coupon Sales Page for the product/service on the Website.

#### Redeem Coupons

No Coupons can be exercised more than once. Unless specifically stated otherwise, Coupons use may not be combined with other coupons, discounts, offers, and/or other promotions and no multiple offers will apply.

Coupons cannot be used to pay off a previous debt to the business or to pay a tip unless otherwise expressly stated.

"tuut" and the products/services providers will not be liable for loss and/or theft and/or duplication and/or printing of the remaining Coupons and/or serial numbers.

Any attempt to use the Coupons in contravention of the terms set forth below or contrary to the terms that appear in the Coupon/Sale page on the website invalidate the Coupons.

All Coupons are limited in time so that after the Coupons's validity period, no Coupons can be used and the Coupons will not give the Coupons buyer any right of any kind nor will he be entitled to a refund, subject to any law. It is the End User sole responsibility to use the Coupons during the Coupon validity period.

If the time limit for redeeming the Coupons is not specified in the sale page, the Coupons will expire after six months from the date of the purchase.

In cases where Coupons are not used until its expiry date, the amount paid for the Coupons purchase will be transferred to the products/services providers or to the "tuut", in accordance with the agreements between "tuut" and the products/services providers.

#### Cancel a transaction by "tuut"

"tuut" and/or anyone on its behalf reserves the right to cease its operation at any time, and/or cancel a sale (before or after closing), including in any of the following cases:

1. Illegal activity has been or is taking place on the Website.
2. If there was a technical malfunction.
3. In the event of a force majeure, war or terror that prevents "tuut" its line of business.
4. Any action taken in violation of these Terms of Use.

#### Products/services providers responsibility

The products/services providers will be solely responsible for any injury, illness, damage, claim, claim, liability, loss of pocket, loss, expense and/or any other payment that the end user may incur in connection with the Coupons.

#### Coupons for business transactions outside of the United Arab Emirates

1. From time to time "tuut" Coupons may appear on the website for services or products outside of the United Arab Emirates.

2. For the avoidance of doubt, it will be made clear that the purchase of Coupons for overseas transactions will be governed by these Terms and Conditions of Use.

3. When purchasing Coupons for overseas transactions, the End User declares that he understands and agrees to the following terms:

a. "tuut" does not sell and/or provide the products and/or services specified in Coupons for overseas transactions, but merely liaises between the buyer and the local products/services providers. "tuut" is not responsible for the nature of the product and/or service provided by the products/services providers.

b. It is made clear that "tuut" will not be held liable for failure to redeem the Coupons due to any change in any kind and for any reason in the End User's overseas travel plans, whether the change in plans was made by the buyer or caused by external circumstances.

c. It is stated that "tuut" will not be liable to the End User, in any form or way, and will not be liable for any damage, direct or indirect, which may be caused to the End User for failure to comply with the products/services providers undertaking towards the End User, including damages resulting from delays, deliveries of products or service exceeding what is stated in the Coupons.

d. "tuut" will not be liable, directly or indirectly, for any damage to the body or property which may be caused to the End User as a result of using the Coupon, direct or indirect damage and/or loss, any damage or loss due to force majeure.

e. It is made clear that the End User will not be entitled to a refund and/or compensation for failure to use the Coupons and/or in part, for any reason.

f. The local products/services providers may propose to the End User to purchase additional products or services not included in the Coupons. In such cases, the End User will execute the purchase of the additional products or services directly in front of the products/services providers and "tuut" will have no responsibility for these products or services or for any transaction under which it is purchased.

g. It is the End User's responsibility to ensure, that he has all the insurance and permissions/licenses required to redeem the Coupons. It is clarified that "tuut" will not be liable for any damage caused by the absence of appropriate insurance when the Coupons are redeemed for transactions abroad.

h. The End User must keep the Coupons and present them to the products/services providers.

i. The Coupons amount may be added to local tax or other compulsory payments. These payments will be paid by the End User directly to the business. The End User is responsible for clarifying and checking the existence of such payments.

j. In any case of dispute or dispute between the End User and the local products/services provider, the law of the State in which the business is located shall govern, unless otherwise expressly stated on the Coupons. It is clarified that "tuut" shall have no part in any such legal proceedings.

#### Disclaimers

THE WEBSITE, LINKS, COUPONS, GRAPHICS OR OTHER MATERIALS PROVIDED, THE CONTENT INCLUDED THEREIN, AND THE PRODUCTS AND SERVICES PROVIDED IN CONNECTION THEREWITH OR OTHERWISE BY "TUUT", ARE PROVIDED TO END USER AS IS. EXCEPT AS EXPRESSLY SET FORTH HEREIN, "TUUT" EXPRESSLY DISCLAIMS ALL WARRANTIES, EXPRESS, IMPLIED OR STATUTORY, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF COURSE OF DEALING, USAGE, OR TRADE.

#### Limitation of Liability

IN NO EVENT SHALL "TUUT" BE LIABLE FOR ANY UNAVAILABILITY OR INOPERABILITY OF THE LINKS, COUPONS, PROGRAM WEB SITES, TECHNICAL MALFUNCTION, COMPUTER ERROR, CORRUPTION OR LOSS OF INFORMATION, OR OTHER INJURY, DAMAGE OR DISRUPTION OF ANY KIND. IN NO EVENT WILL "TUUT" BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, PERSONAL INJURY / WRONGFUL DEATH, SPECIAL OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO, LOSS OF PROFITS OR LOSS OF BUSINESS OPPORTUNITY, LOSS OF DATA OR CUSTOMERS, EVEN IF SUCH DAMAGES ARE FORESEEABLE AND WHETHER OR NOT "TUUT" HAS BEEN ADVISED OF THE POSSIBILITY THEREOF.

#### Governing Law

The laws of the United Arab Emirates shall govern this Agreement, and the Parties hereby submit to the jurisdiction of the competent courts of Dubai, United Arab Emirates in any matter arising out of or relating to this Agreement.

#### Miscellaneous

Without derogating from the provisions of the above, the End User and the products/services providers shall be responsible for the payment of all attorney fees and expenses incurred by "tuut" to enforce the terms of this Agreement. This Agreement, together with the Privacy Policy, contains the entire agreement between "tuut" and the End User with respect to the subject matter hereof and supersedes all prior and/or contemporaneous agreements or understandings, written or oral.

If any provision of this Agreement is held to be void, invalid or inoperative, the remaining provisions of this Agreement shall continue in effect and the invalid portion of any provision shall be deemed modified to the least degree necessary to remedy such invalidity while retaining the original intent of the parties.

Each party to this Agreement is an independent contractor in relation to the other party with respect to all matters arising under this Agreement. Nothing herein shall be deemed to establish a partnership, joint venture, association or employment relationship between the parties.

No course of dealing nor any delay in exercising any rights hereunder shall operate as a waiver of any such rights.

No waiver of any default or breach shall be deemed a continuing waiver or a waiver of any other breach or default.

By using the Website, you affirm and acknowledge that you have read this Agreement in its entirety and agree to be bound by all of its terms and conditions. If you do not wish to be bound by this Agreement, you should not use the Website.

#### Contact Information

If you have any questions about these Terms and Conditions, please contact us at:
• Email: support@tuut.shop
• Website: tuut.shop

Last updated: ${(/* @__PURE__ */ new Date()).toLocaleDateString()}
  `;
  const arabicContent = `
### قبول شروط الاستخدام

استخدام هذا الموقع الإلكتروني tuut.shop (يُشار إليه لاحقًا بـ "تووت" أو "نحن" أو "الخاص بنا" أو الضمير المتصل "نا" الذي يدلّ علينا) أو أي موقع إلكتروني بديل له أو يُضاف إليه، يشمل التطبيق الخاص بنا للهواتف الذكية (يُشار إليه بـ "الموقع الإلكتروني")، من قِبَلك أنت (يُشار إليك بـ "المستخدِم" أو "أنت" أو أي ضمير متصل نخاطبك فيه)، أو تقديم عرض للشّراء، التّسجيل في الموقع و/أو إنشاء حساب في الموقع، يشكّل اتفاقية بيننا ويؤكّد موافقتك على شروط الاستخدام التالية وقبولك بها.

إذا كنت لا توافق على شروط الاستخدام التالية (يُشار إليها بـ "شروط الاستخدام" أو "اتفاقية")، فينبغي عليك الامتناع عن استخدام الموقع الإلكتروني.

من المفضّل أن تقوم من حينٍ لآخر بقراءة شروط الاستخدام وسياسة الخصوصية الخاصة بنا كي تبقى مطّلعًا على جميع التعديلات والتغييرات.

يجب أن يكون عمرك 18 عامًا على الأقلّ كي تكون مؤهّلًا لاستخدام الموقع الإلكتروني.

أنت توافق -وبشكل صريح- على جميع شروط الاستخدام وسياسة الخصوصية، وتقرّ وتصرّح بأنّك لن تقوم أنت أو أي شخص أو أي طرف ينوب عنك بتقديم أي دعوى أو شكوى ضد "تووت"، مالكي الموقع الإلكتروني، مديري "تووت"، أعضاء مجلس الإدارة ووكلائهم، المسوّقين بالعمولة التابعين لهم و/أو مَن ينوب عنهم، باستثناء الدعاوى والشكاوى على انتهاكات "تووت" لشروط الاستخدام وسياسة الخصوصية.

يحتفظ "تووت" بالحقّ في تغيير شروط الاستخدام من حين لآخر، وفقًا لتقديره. أي تغيير سيكون ساريًا فقط على الكوبونات المكتَسبة بعد موعد التغيير.

### استخدام الموقع الإلكتروني

#### شروط عامّة

يوفّر الموقع الإلكتروني منصة للتّجار (يُشار إليهم بـ "تجّار") لطرح وعرض كوبونات خصم لموقع إلكتروني معيّن و/أو لعروض (يُشار إليها بـ"كوبونات") محدّدة.

"تووت" لا يقوم ببيع أو توفير المنتَجات أو الخدمات المعروضة على الموقع، والتي من الممكن أن يتم شراؤها من الشركات المختلفة من خلال بيع الكوبونات. المنتَجات أو الخدمات التي تُستخدم في الكوبونات التي يتمّ بيعها على الموقع، تقدّمها وتعرضها الشركاتُ المختلفة لا "تووت".

المستخدِم هو المسؤول المطلق عن حماية سرّيّة كلمة المرور الخاصة به على الموقع و/أو ما يخصّها أو يتعلّق بها. أنت تعلم وتوافق على أنّه قد تكون هناك انقطاعات أو معوقات في الوصول إلى الموقع أو دخول الموقع أو تسجيل الدخول إلى حسابك لأسباب وظروف منها ما يتعلّق ب"تووت" ومنها ما لا علاقة لشركة "تووت" بها. وبموجب هذا فأنت تُعفي "تووت" من أي مسؤولية لتعويضك على أي ضرر و/أو دفوعات و/أو خسارة قد تتكبّدهم أو تتحمّلهم جرّاء ما ذكرناه أعلاه.

يحتفظ "تووت" بالحقّ في تغيير أي ميزة أو خاصية، يشمل أي محتوى كان. قد يوقف "تووت" نشر أي معلومات، أو يغيّر أو يعلّق أي طريقة لنقل المعلومات. وعليه، فأنت تقرّ بأنّك ذو أهلية قانونية كافية لإنشاء عقد ملزِم بموجب القانون.

#### تغيير شروط الاستخدام وسياسة الخصوصية

بالإضافة إلى كلّ إشعار أو تنبيه يُسمح به بموجب هذه الاتفاقية، في حال قام "تووت" بإجراء تغيير على نص شروط الاستخدام، فإنّنا سنقوم بإشعارك أو إخطارك بذلك عبر البريد الإلكتروني أو من خلال نشر إشعار على الموقع لتنبيهك بالتغييرات أو التعديلات. ستكون التغييرات في شروط الاستخدام و/أو سياسة الخصوصية سارية في الحال، على جميع مستخدمي الموقع. استمرارك في استخدام الموقع يمثّل موافقتك على تلك التغييرات وقبولك بها. إذا كنت غير راضٍ عن التعديلات ولا تقبلها، فينبغي عليك التوقّف عن استخدام الموقع في الحال. بالإضافة إلى ذلك، قد يقوم "تووت" بتغيير، تعليق أو توقيف أي جانب من جوانب العرض أو الرابط، أو إزالة، تغيير، أو تعديل أي وسوم أو علامات، محتوى نصَي، محتوى جرافيكي، رسومات أو إعلان بانر أو إعلان راية لهم علاقة بالرابط.

#### المستخدِم

وبما لا يتعارض أو ينتقص ممّا ذكرناه أعلاه، فإن "تووت" قد يمنعك من المشاركة في أي من المبيعات و/أو العروض، أو جزئيًّا، في إحدى الحالات التالية: إذا قمت بانتهاك شروط الاستخدام. إذا قمت بأي عمل أو تجاوُز أو إهمال من شأنه أن يسيء أو يضرّ ب"تووت" أو بأي طرف ثالث، يشمل عملاء الشركة، الشركات والأعمال التجارية والمسوّقين بالعمولة.

#### الملكيّة الفكرية، حقوق النشر، والعلامات التجارية

الموقع الإلكتروني مُلك "تووت" وخاص به فقط. ممنوع منعًا باتًّا نسخ أو توزيع أو إرسال أو نشر أو رَبط أو القيام بأي تعديل آخر على الموقع الإلكتروني بدون موافقة خطيّة صريحة ومسبقة من "تووت".

باستثناء ما منصوص عليه في هذه الاتفاقية، فإنّه لا شيء فيها يمنحك الحقّ في أي من العلامات التجارية، علامات الخدمة، حقوق النشر، براءات الاختراع أو أسرار التجارة الخاصة جميعها ب"تووت". أنت توافق على أنّه يمكن لشركة "تووت" استخدام أي اقتراح من اقتراحاتك أو أي تعليق من تعليقاتك أو أي توصية من توصياتك تختار أن تقدّمهم لشركة "تووت" بدون مقابل. "تووت" يحتفظ بجميع الحقوق التي لم تُذكر ولم تُمنح في هذه الاتفاقية.

#### إخلاء المسؤولية

يوافق المستخدِم على أنّه هو المسؤول المطلق عن استخدامه الموقع الإلكتروني وعن المخاطر المتأتّية عن ذلك. "تووت"، المسوّقون بالعمولة الخاصون به، موظّفوه، وكلاؤه، الشركات التجارية، أطراف ثالثة توفّر المحتوى له والمرخِّصون وجميع المديرين وأعضاء الإدارة والموظّفين والوكلاء فيها، لا يتعّهدون ولا يقرّون بأنّ استخدام الموقع الإلكتروني سيكون خاليًا من الأخطاء أو دون انقطاع في تقديم الخدمات فيه، وكما لا يضمنون دقّة وموثوقيّة وصلاحيّة أي معلومات، خدمات أو كوبونات تُقدَّم وتُطرَح عبر الموقع الإلكتروني.

"تووت" لا يقوم باستيراد، تصنيع، تسويق، بيع و/أو تقديم أي منتج و/أو أي خدمة تقوم أنت بشرائهم من الموقع الإلكتروني، ولذلك فهو لا يتحمّل أي مسؤولية مباشرة أو غير مباشرة على المنتجات، شحن المنتجات و/أو استيرادها إلى الدولة، طبيعة المنتجات، مدى ملاءمتها و/أو مواصفاتها.

يتمّ تقديم المنتجات والخدمات على الموقع الإلكتروني بنيّة حسنة وبمسؤولية من الشركة التجارية، وهي لا تمثّل بأي شكل من الأشكال منتجات موصى بها من "تووت" و/أو رأي "تووت" في المنتجات بغضّ النظر عن طبيعة المنتجات و/أو الخدمات.

لن تكون الشركة مسؤولة عن أي نشاط غير قانوني يقوم به المشارِكون في عمليّة البيع أو أي طرف ثالث آخر ليس في نطاق سيطرتها ومسؤوليتها. وبالإضافة إلى ما ذكر سابقًا وبما لا يتعارض معه، فإنّ "تووت" ليس مسؤولًا ولن يكون مسؤولًا عن أي ضرر يحدث، بشكل مباشر أو غير مباشر، من جرّاء استخدام الموقع الإلكتروني.

#### التعويض

أنتَ توافق بموجب هذه الاتفاقيّة على تعويض "تووت"، عدم إلحاق أي ضرر به والدفاع عن "تووت" وعن عملائه والشركات التابعة لهم، المسوّقين بالعمولة، الشركاء والمرخِّصين، المساهِمين، المديرين، الموظّفين، العاملين، المالكين والوكلاء، ضد جميع الدعاوى، الإجراءات، الطلبات، الالتزامات، الخصوم، الخسائر، الأضرار، الأحكام، التسويات، التكاليف والنفقات (يشمل أتعاب المحامي والنفقات المترتّبة عن ذلك) في الحالات التالية: (1) فشل هذه الاتفاقية أو انتهاكها، يشمل أي خرق للتمثيل، الضمان، الاتفاق، القيود الملزمة أو التعهُّدات. (2) أي سوء استخدام من قِبَل المستخدِم للروابط، الكوبونات، الموقع الإلكتروني و/أو الخدمات أو الملكية الفكرية الخاصة ب"تووت"، أو (3) أي دعوى لها علاقة بأي منتج أو خدمة، وأي دعوى تتعلّق بجودة أي من المنتجات والخدمات.

#### الخصوصية

المستخدِم يقرّ وفقا لهذه الاتفاقية أنّ جميع النقاشات، التصنيفات، التعليقات، خدمة لوحة الإعلانات، غرف الدردشة و/أو جميع البنى التحتية لإرسال الرسائل، المرحلات، والمنشورات على الموقع الإلكتروني (يُشار إليها بـ "المجتمعات") هي عامّة وعلنيّة وليست خاصّة، ما يتيح لأطراف ثالثة الاطّلاع عليها وقراءتها دون علم المستخدِم. "تووت" لا يتحكّم ولا يرعى أي محتوى، رسالة أو معلومات واردة في أي مجتمع من المجتمعات، وعليه فإن "تووت" يقرّ بإخلاء مسؤوليته من كلّ ما يتعلّق بالمجتمعات، ويقرّ أنّه ليس مسؤولا عن أي من التبعات والتداعيات التي تنشأ وتترتّب عن مشاركة المستخدِم في هذه المجتمعات. أي معلومات يقوم المستخدِم بنشرها على الموقع الإلكتروني، سواءٌ أكانت في غرف الدردشة أو غرف المناقشات أو المنتديات أو غير ذلك، ليست معلومات سريّة. من خلال قيامه بنشر التعليقات، الملاحظات و/أو أي معلومات أخرى على الموقع، فإن المستخدِم يمنح "تووت" الحقّ المطلق في استخدام هذه التعليقات، الملاحظات و/أو أي من المعلومات في نشاطاته الترويجية، الإعلانية، أبحاث ودراسات السوق أو لأي غرض قانوني وشرعي آخر بغضّ النظر عن المكان والوقت أو أي قيود أخرى. للمزيد من المعلومات، اقرأ سياسة الخصوصية الخاصة بنا.

#### إنهاء الاتفاقية

يجوز لشركة "تووت" إنهاء الاتفاقية في أيّ وقت، لأي سبب، أو دون أي سبب، وفقًا لتقديره الخاص، ودون أن يكون ملزَمًا بإشعار أو إخطار المستخدِم بذلك.

#### محتوى من أطراف ثالثة

قد يحتوي الموقع الإلكتروني على روابط إلى مواقع إلكترونية خاصة بأطراف ثالثة. يتم توفير هذه الروابط لراحتك فقط، وهي لا تعني موافقة أو مصادقة موقع "تووت" على المحتوى الذي تنشره هذه المواقع الإلكترونية. المستخدِم يدرك تماما أن زيارة مواقع إلكترونية عبر الروابط في موقعنا الإلكتروني قد ينتج عنها أضرار إضافية، تشمل فيروسات، برامج تجسس وبرامج ضارة أخرى. في حال قرّر المستخدِم تسجيل الدخول في موقع إلكتروني خاص بطرف ثالث عبر رابط يظهر في موقعنا الإلكتروني، فإنّه يتحمّل المسؤولية المطلقة عن الأخطار التي قد تنتج عن ذلك.

#### البريد الإلكتروني

أنت تسمح -بموجب هذه الاتفاقية- لشركة "تووت" و/أو لأي شخص ينوب عنه أو من طرفه، بأن يرسلوا إليك رسائل عبر البريد الإلكتروني أو رسائل أخرى عبر وسائط أخرى. أنت تقرّ أيضًا أن "تووت" قد يرسل إليك تنبيهات حول تاريخ انتهاء صلاحية الكوبون الذي قمتَ بشرائه.

بالإضافة إلى ذلك، وبقبولك شروط الاستخدام، أنت توافق على أن "تووت" أو أي شخص ينوب عنه أو من طرفه، قد يقوم بالتواصل معك، من حين لآخر، ليعرض عليك عروض تسويقية وإعلانية، عبر بريد مباشر، رسائل نصيّة، مراسلات عبر البريد الإلكتروني، الإعلانات أو الإشعارات المنبثقة في التطبيق، أو باستخدام أي وسيلة اتصال أخرى.

#### الكوبونات- شروط عامّة

جميع الكوبونات من الموقع الإلكتروني أو عبر الموقع الإلكتروني، يشمل أي موقع إلكتروني مرتبط ب"تووت" (يُشار إليها بـ الـ "كوبونات") هي كوبونات ترويجية يمكن شراؤها من "تووت" من أجل استبدالها بمنتجات و/أو خدمات عبر الحصول على خصم على أسعار المنتجات والخدمات الأساسية (لا يشمل خصومات متعدّدة ومتنوّعة التي تقوم الشركة التجارية بتقديمها من حين لآخر). يمكن شراء الكوبونات على الموقع الإلكتروني بما يتماشى مع الشروط والأحكام المفروضة والسارية على كل صفقة أو معاملة أو نشاط تجاري أو شركة تجارية.

يسمح لك "تووت" بشراء الكوبونات التي يمكن استبدالها بشراء منتجات و/أو خدمات من الشركة التجارية، وفقًا لهذه الشروط والأحكام وشروط الاستخدام من جهة ولشروط الصفقة التجارية المقصودة من جهة أخرى.cالشركات التجارية هي التي تقدّم المنتجات والخدمات وليس "تووت"، وعليه فإن توفير المنتجات والخدمات المناسبة يقع وبشكل مطلق على عاتق هذه الشركات التجارية المختلفة وهو مسؤوليتها المطلقة.

#### معلومات الاتصال

إذا كان لديك أي أسئلة حول هذه الشروط والأحكام، يرجى الاتصال بنا على:
• البريد الإلكتروني: support@tuut.shop
• الموقع الإلكتروني: tuut.shop

آخر تحديث: ${(/* @__PURE__ */ new Date()).toLocaleDateString("ar-EG")}
  `;
  const content = isRTL ? arabicContent : englishContent;
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg shadow-sm p-8", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-gray-900 mb-8", children: isRTL ? "الشروط والأحكام" : "Terms and Conditions" }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `prose max-w-none text-gray-700 leading-relaxed ${isRTL ? "text-right" : "text-left"}`,
        dangerouslySetInnerHTML: {
          __html: content.replace(/\n/g, "<br />").replace(
            /### (.*)/g,
            '<h3 class="text-xl font-semibold mt-6 mb-3 text-gray-900">$1</h3>'
          ).replace(
            /#### (.*)/g,
            '<h4 class="text-lg font-medium mt-4 mb-2 text-gray-800">$1</h4>'
          ).replace(/• (.*)/g, '<li class="ml-4">$1</li>').replace(
            /^(\d+)\.\s/gm,
            '<div class="font-medium mt-3">$1.</div>'
          )
        }
      }
    )
  ] }) }) });
}

const FallbackPage = () => /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
  /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-4", children: "Tuut Website" }),
  /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground", children: "SSR Website is loading..." })
] }) });
function getPageForPath(path) {
  const cleanPath = path.replace(/\/$/, "").split("?")[0];
  switch (cleanPath) {
    // Home page
    case "":
    case "/":
      return HomePage;
    // Main pages
    case "/deals":
      return DealsPage;
    case "/stores":
      return StoresPage;
    case "/blog":
    case "/guides":
      return BlogPage;
    case "/privacy":
      return PrivacyPage;
    case "/terms":
      return TermsPage;
    // These pages will be added later once we check their exports
    // case '/products':
    //   return ProductsPage
    // case '/search':
    //   return SearchPage
    // case '/wishlist':
    //   return WishlistPage
    // case '/tracked-products':
    //   return TrackedProductsPage
    // Dynamic routes - will be added later
    default:
      return FallbackPage;
  }
}

function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(SheetPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxs(
      SheetPrimitive.Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxs(SheetPrimitive.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", children: [
            /* @__PURE__ */ jsx(XIcon, {}),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SheetPrimitive.Description,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}

function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive: "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Alert({
  className,
  variant,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "alert",
      role: "alert",
      className: cn(alertVariants({ variant }), className),
      ...props
    }
  );
}
function AlertDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "alert-description",
      className: cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
        className
      ),
      ...props
    }
  );
}

function SignInModal({ open, onOpenChange }) {
  const { signIn } = useAuth();
  const { isRTL } = useLanguage();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!phone || phone.trim().length < 10) {
      setError(isRTL ? "الرجاء إدخال رقم هاتف صحيح" : "Please enter a valid phone number");
      return;
    }
    setError("");
    setLoading(true);
    console.log("📞 Saving phone number:", phone);
    const result = await signIn(phone);
    setLoading(false);
    console.log("✅ Result:", result);
    if (result.success) {
      console.log("🎉 Success! Closing modal");
      onOpenChange(false);
      setPhone("");
    } else {
      console.error("❌ Error:", result.error);
      setError(result.error || (isRTL ? "فشل حفظ رقم الهاتف" : "Failed to save phone number"));
    }
  };
  return /* @__PURE__ */ jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-md", dir: isRTL ? "rtl" : "ltr", children: [
    /* @__PURE__ */ jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Phone, { className: "w-5 h-5" }),
        isRTL ? "تسجيل الدخول" : "Sign In"
      ] }),
      /* @__PURE__ */ jsx(DialogDescription, { children: isRTL ? "أدخل رقم هاتفك للمتابعة" : "Enter your phone number to continue" })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSignIn, className: "space-y-4", children: [
      error && /* @__PURE__ */ jsx(Alert, { variant: "destructive", children: /* @__PURE__ */ jsx(AlertDescription, { children: error }) }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { htmlFor: "phone", children: isRTL ? "رقم الهاتف" : "Phone Number" }),
        /* @__PURE__ */ jsx(
          Input,
          {
            id: "phone",
            type: "tel",
            placeholder: isRTL ? "+966 5X XXX XXXX" : "+966 5X XXX XXXX",
            value: phone,
            onChange: (e) => setPhone(e.target.value),
            disabled: loading,
            required: true,
            dir: "ltr"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "submit",
          className: "w-full",
          disabled: loading || !phone,
          children: loading ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }),
            isRTL ? "جاري التحميل..." : "Loading..."
          ] }) : isRTL ? "تسجيل الدخول" : "Sign In"
        }
      )
    ] })
  ] }) });
}

function Header() {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { country, countries, setCountry } = useCountry();
  const { user, isAuthenticated, signOut } = useAuth();
  const { navigate, currentPath } = useRouter();
  const [showSignIn, setShowSignIn] = useState(false);
  const navItems = [
    { key: "deals", label: t("header.deals"), href: "/deals" },
    { key: "stores", label: t("header.stores"), href: "/stores" },
    { key: "products", label: t("header.products"), href: "/products" },
    { key: "guides", label: t("header.blog"), href: "/guides" }
  ];
  const handleStartSaving = () => {
    setShowSignIn(true);
  };
  const handleSignOut = async () => {
    await signOut();
  };
  return /* @__PURE__ */ jsxs("header", { className: "w-full border-b-2 border-[#111827] bg-background", children: [
    /* @__PURE__ */ jsx("div", { className: "container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: "flex h-20 items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-8 ${isRTL ? "flex-row-reverse" : ""}`, children: [
        /* @__PURE__ */ jsx("a", { href: "/", className: "flex items-center", children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "https://i.ibb.co/XZV7bXh3/Tuut.png",
            alt: "Tuut",
            className: "h-12 w-auto"
          }
        ) }),
        /* @__PURE__ */ jsx("nav", { className: `hidden md:flex items-center gap-8 ${isRTL ? "flex-row-reverse" : ""}`, children: navItems.map((item) => /* @__PURE__ */ jsx(
          Link,
          {
            to: item.href,
            className: "text-[#111827] transition-colors hover:opacity-60",
            style: { fontWeight: 500 },
            children: item.label
          },
          item.key
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`, children: [
        /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
            Button,
            {
              variant: "ghost",
              className: "hidden md:flex h-11 px-4 rounded-xl border-2 border-[#111827] hover:bg-[#E8F3E8]",
              children: country ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  ImageWithFallback,
                  {
                    src: getCountryImage(country),
                    alt: getCountryName(country, language),
                    className: `w-6 h-6 rounded-full object-cover ${isRTL ? "ml-2" : "mr-2"}`
                  }
                ),
                /* @__PURE__ */ jsx("span", { children: getCountryName(country, language) })
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Globe, { className: `h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}` }),
                language === "en" ? "Select Country" : "اختر الدولة"
              ] })
            }
          ) }),
          /* @__PURE__ */ jsx(DropdownMenuContent, { align: isRTL ? "start" : "end", className: "w-56", children: countries.map((c) => /* @__PURE__ */ jsxs(
            DropdownMenuItem,
            {
              onClick: () => setCountry(c),
              className: `cursor-pointer ${getCountryId(country) === getCountryId(c) ? "bg-[#E8F3E8]" : ""}`,
              children: [
                /* @__PURE__ */ jsx(
                  ImageWithFallback,
                  {
                    src: getCountryImage(c),
                    alt: getCountryName(c, language),
                    className: `w-6 h-6 rounded-full object-cover ${isRTL ? "ml-2" : "mr-2"}`
                  }
                ),
                /* @__PURE__ */ jsx("span", { children: getCountryName(c, language) })
              ]
            },
            getCountryId(c)
          )) })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "ghost",
            onClick: () => setLanguage(language === "en" ? "ar" : "en"),
            className: "hidden md:flex h-11 px-4 rounded-xl border-2 border-[#111827] hover:bg-[#E8F3E8]",
            children: [
              /* @__PURE__ */ jsx(Languages, { className: `h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}` }),
              language === "en" ? "عربي" : "English"
            ]
          }
        ),
        isAuthenticated ? /* @__PURE__ */ jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(
            Button,
            {
              className: "hidden md:flex bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all h-11 px-6",
              style: { fontWeight: 600 },
              children: language === "en" ? "RADAR" : "الرادار"
            }
          ) }),
          /* @__PURE__ */ jsxs(DropdownMenuContent, { align: isRTL ? "start" : "end", className: "w-48", children: [
            /* @__PURE__ */ jsx(DropdownMenuItem, { onClick: () => navigate("/wishlist"), children: language === "en" ? "My Wishlist" : "قائمتي" }),
            /* @__PURE__ */ jsx(DropdownMenuSeparator, {}),
            /* @__PURE__ */ jsxs(DropdownMenuItem, { onClick: handleSignOut, className: "text-red-600", children: [
              /* @__PURE__ */ jsx(LogOut, { className: `h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}` }),
              language === "en" ? "Sign Out" : "تسجيل الخروج"
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: handleStartSaving,
            className: "hidden md:flex bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all h-11 px-6",
            style: { fontWeight: 600 },
            children: [
              /* @__PURE__ */ jsx(PiggyBank, { className: `h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}` }),
              language === "en" ? "Start Saving" : "ابدأ التوفير"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(Sheet, { children: [
          /* @__PURE__ */ jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "icon", className: "md:hidden", children: /* @__PURE__ */ jsx(Menu, { className: "h-6 w-6" }) }) }),
          /* @__PURE__ */ jsxs(SheetContent, { side: isRTL ? "left" : "right", className: "w-[300px] sm:w-[400px]", children: [
            /* @__PURE__ */ jsx(SheetHeader, { children: /* @__PURE__ */ jsx(SheetTitle, { children: language === "en" ? "Menu" : "القائمة" }) }),
            /* @__PURE__ */ jsxs("nav", { className: "flex flex-col gap-4 mt-8", children: [
              navItems.map((item) => /* @__PURE__ */ jsx(
                Link,
                {
                  to: item.href,
                  className: "text-[#111827] py-2 transition-colors hover:opacity-60",
                  style: { fontWeight: 500 },
                  children: item.label
                },
                item.key
              )),
              /* @__PURE__ */ jsxs("div", { className: "mt-2", children: [
                /* @__PURE__ */ jsx("div", { className: "text-[#111827] mb-2", style: { fontWeight: 500 }, children: language === "en" ? "Country" : "الدولة" }),
                /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-2 max-h-[200px] overflow-y-auto border-2 border-[#111827] rounded-xl p-2", children: countries.map((c) => /* @__PURE__ */ jsxs(
                  "button",
                  {
                    onClick: () => setCountry(c),
                    className: `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-[#E8F3E8] text-right ${getCountryId(country) === getCountryId(c) ? "bg-[#E8F3E8]" : ""} ${isRTL ? "flex-row-reverse text-right" : "text-left"}`,
                    children: [
                      /* @__PURE__ */ jsx(
                        ImageWithFallback,
                        {
                          src: getCountryImage(c),
                          alt: getCountryName(c, language),
                          className: "w-6 h-6 rounded-full object-cover"
                        }
                      ),
                      /* @__PURE__ */ jsx("span", { children: getCountryName(c, language) })
                    ]
                  },
                  getCountryId(c)
                )) })
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  onClick: () => setLanguage(language === "en" ? "ar" : "en"),
                  className: "mt-2 border-2 border-[#111827] rounded-xl",
                  children: [
                    /* @__PURE__ */ jsx(Languages, { className: `h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}` }),
                    language === "en" ? "العربية" : "English"
                  ]
                }
              ),
              isAuthenticated ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    onClick: () => navigate("/tracked-products"),
                    variant: "outline",
                    className: "mt-4 border-2 border-[#111827] rounded-xl",
                    children: language === "en" ? "Tracked Products" : "المنتجات المتتبعة"
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    onClick: handleSignOut,
                    variant: "outline",
                    className: "mt-2 border-2 border-red-500 text-red-600 rounded-xl",
                    children: [
                      /* @__PURE__ */ jsx(LogOut, { className: `h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}` }),
                      language === "en" ? "Sign Out" : "تسجيل الخروج"
                    ]
                  }
                )
              ] }) : /* @__PURE__ */ jsxs(
                Button,
                {
                  onClick: handleStartSaving,
                  className: "mt-4 bg-[#5FB57A] hover:bg-[#4FA569] text-white border-2 border-[#111827] rounded-xl shadow-[3px_3px_0px_0px_rgba(17,24,39,1)]",
                  style: { fontWeight: 600 },
                  children: [
                    /* @__PURE__ */ jsx(PiggyBank, { className: `h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}` }),
                    language === "en" ? "Start Saving" : "ابدأ التوفير"
                  ]
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(SignInModal, { open: showSignIn, onOpenChange: setShowSignIn })
  ] });
}

const TikTokIcon = ({ className }) => /* @__PURE__ */ jsx(
  "svg",
  {
    viewBox: "0 0 24 24",
    fill: "currentColor",
    className,
    xmlns: "http://www.w3.org/2000/svg",
    children: /* @__PURE__ */ jsx("path", { d: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" })
  }
);
function Footer() {
  const { t, isRTL } = useLanguage();
  const { country } = useCountry();
  const { data: ssrData } = useSSRData();
  const hasSSRData = ssrData && ssrData.footer;
  const [featuredDeals, setFeaturedDeals] = useState(hasSSRData ? ssrData.footer.featuredDeals || [] : []);
  const [topStores, setTopStores] = useState(hasSSRData ? ssrData.footer.topStores || [] : []);
  const [guides, setGuides] = useState(hasSSRData ? ssrData.footer.guides || [] : []);
  const [categories, setCategories] = useState(hasSSRData ? ssrData.footer.categories || [] : []);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  useEffect(() => {
    if (!hasSSRData) {
      fetchFooterData();
    } else {
      fetchFooterData();
    }
  }, [country]);
  const fetchFooterData = async () => {
    try {
      const dealsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/featured-deals${country?.value ? `?country=${country.value}` : ""}`,
        {
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`
          }
        }
      );
      if (dealsResponse.ok) {
        const dealsData = await dealsResponse.json();
        const actualDeals = (dealsData.deals || []).map((item) => item.deals).filter(Boolean);
        setFeaturedDeals(actualDeals.slice(0, 5));
      } else {
        console.error("Error fetching featured deals:", dealsResponse.status);
      }
      const supabaseClient = createClient();
      try {
        let storesQuery = supabaseClient.from("stores").select("*").limit(20);
        if (country) {
          const { data: countryData } = await supabaseClient.from("countries").select("id").eq("value", country.value).single();
          if (countryData) {
            storesQuery = storesQuery.eq("country_id", countryData.id);
            console.log("Filtering stores by country_id:", countryData.id);
          }
        }
        const { data: storesData, error: storesError } = await storesQuery;
        if (storesError) {
          console.error("Error fetching stores:", storesError);
          setTopStores([]);
        } else if (storesData && storesData.length > 0) {
          console.log("Fetched", storesData.length, "stores, selecting 10 random ones");
          const shuffled = [...storesData].sort(() => 0.5 - Math.random());
          const selectedStores = shuffled.slice(0, 10);
          setTopStores(selectedStores.map((store) => ({
            id: store.id,
            name: store.name || store.store_name || store.title || "Store",
            slug: store.slug || store.id
          })));
        } else {
          console.log("No stores found");
          setTopStores([]);
        }
      } catch (error) {
        console.error("Error in stores fetch:", error);
        setTopStores([]);
      }
      if (country) {
        const articlesResponse = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/articles?limit=8&country=${country.value}`,
          {
            headers: {
              "Authorization": `Bearer ${publicAnonKey}`
            }
          }
        );
        if (articlesResponse.ok) {
          const articlesData = await articlesResponse.json();
          setGuides((articlesData.articles || []).slice(0, 6));
        } else {
          console.error("Error fetching articles:", articlesResponse.status);
          setGuides([]);
        }
      } else {
        const supabaseClient2 = createClient();
        const { data: articlesData, error: articlesError } = await supabaseClient2.from("articles").select("id, title, slug").order("is_featured", { ascending: false }).order("published_at", { ascending: false }).limit(8);
        if (!articlesError && articlesData) {
          setGuides(articlesData.slice(0, 6));
        } else {
          console.error("Error fetching articles:", articlesError);
          setGuides([]);
        }
      }
      const supabase = createClient();
      const { data: categoriesData, error: categoriesError } = await supabase.from("categories").select("*").order("id", { ascending: true }).limit(10);
      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError);
      } else if (categoriesData) {
        setCategories(categoriesData);
      }
      const productsUrl = `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/products${country?.value ? `?country=${country.value}&sort=ratings_count&limit=10` : "?sort=ratings_count&limit=10"}`;
      console.log("Fetching best selling products from:", productsUrl);
      try {
        const productsResponse = await fetch(productsUrl, {
          headers: {
            "Authorization": `Bearer ${publicAnonKey}`
          }
        });
        console.log("Products response status:", productsResponse.status);
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          console.log("Products API response:", productsData);
          console.log("Products data length:", productsData.products?.length || 0);
          if (productsData.products && productsData.products.length > 0) {
            console.log("Best selling products fetched:", productsData.products.length);
            const productsToSet = productsData.products.slice(0, 10);
            console.log("Setting bestSellingProducts to:", productsToSet);
            setBestSellingProducts(productsToSet);
          } else {
            console.log("No products found in API response");
            console.log("Full API response structure:", productsData);
          }
        } else {
          console.error("Products API error:", productsResponse.status, productsResponse.statusText);
        }
      } catch (error) {
        console.error("Error fetching best selling products:", error);
      }
    } catch (error) {
      console.error("Error fetching footer data:", error);
    }
  };
  const footerLinks = {
    company: [
      { label: t("footer.about"), href: "#" },
      { label: isRTL ? "كيف يعمل" : "How It Works", href: "#" },
      { label: t("footer.careers"), href: "#" },
      { label: isRTL ? "المدونة" : "Blog", href: "/guides" },
      { label: isRTL ? "سياسة الخصوصية" : "Privacy Policy", href: "/privacy" },
      { label: isRTL ? "الشروط والأحكام" : "Terms of Use", href: "/terms" }
    ],
    browse: [
      { label: isRTL ? "جميع الكوبونات" : "All Coupons", href: "/deals" },
      { label: isRTL ? "أفضل المتاجر" : "Top Stores", href: "/stores" },
      { label: isRTL ? "الفئات" : "Categories", href: "/#categories" },
      { label: isRTL ? "عروض جديدة" : "New Deals", href: "/deals" }
    ],
    support: [
      { label: t("footer.help"), href: "#" },
      { label: t("footer.faq"), href: "#" },
      { label: t("footer.contact"), href: "#" },
      { label: isRTL ? "إرسال عرض" : "Submit a Deal", href: "#" }
    ]
  };
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: TikTokIcon, href: "#", label: "TikTok" }
  ];
  return /* @__PURE__ */ jsx("footer", { className: "bg-white border-t-2 border-[#111827]", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8 py-12", children: [
    /* @__PURE__ */ jsxs("div", { className: `mb-12 ${isRTL ? "text-right" : ""}`, children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-col lg:flex-row gap-8 mb-12", children: /* @__PURE__ */ jsxs("div", { className: "lg:w-1/4", children: [
        /* @__PURE__ */ jsx("div", { className: `mb-4 ${isRTL ? "flex justify-end" : ""}`, children: /* @__PURE__ */ jsx(
          "img",
          {
            src: "https://i.ibb.co/XZV7bXh3/Tuut.png",
            alt: "Tuut",
            className: "h-12 w-auto"
          }
        ) }),
        /* @__PURE__ */ jsx("p", { className: "text-[#6B7280] mb-6 max-w-[280px]", children: t("footer.tagline") }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3 text-sm text-[#6B7280]", children: /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`, children: [
          /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: "support@tuut.com" })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-4 text-[#111827]", style: { fontWeight: 600 }, children: t("footer.company") }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: footerLinks.company.map((link, index) => /* @__PURE__ */ jsx("li", { children: link.href.startsWith("#") ? /* @__PURE__ */ jsx(
            "a",
            {
              href: link.href,
              className: "text-[#6B7280] hover:text-[#111827] transition-colors text-sm underline underline-offset-2 hover:underline-offset-4",
              children: link.label
            }
          ) : /* @__PURE__ */ jsx(
            Link,
            {
              to: link.href,
              className: "text-[#6B7280] hover:text-[#111827] transition-colors text-sm underline underline-offset-2 hover:underline-offset-4",
              children: link.label
            }
          ) }, index)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-4 text-[#111827]", style: { fontWeight: 600 }, children: isRTL ? "تصفح" : "Browse" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: footerLinks.browse.map((link, index) => /* @__PURE__ */ jsx("li", { children: link.href.startsWith("/#") ? /* @__PURE__ */ jsx(
            "a",
            {
              href: link.href,
              className: "text-[#6B7280] hover:text-[#111827] transition-colors text-sm underline underline-offset-2 hover:underline-offset-4",
              children: link.label
            }
          ) : /* @__PURE__ */ jsx(
            Link,
            {
              to: link.href,
              className: "text-[#6B7280] hover:text-[#111827] transition-colors text-sm underline underline-offset-2 hover:underline-offset-4",
              children: link.label
            }
          ) }, index)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-4 text-[#111827]", style: { fontWeight: 600 }, children: t("footer.featuredDeals") }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-2", children: [
            featuredDeals.length > 0 ? featuredDeals.slice(0, 5).map((deal) => {
              const getTitle = () => {
                if (isRTL) {
                  if (deal.title_ar) return deal.title_ar;
                  if (deal.name_ar) return deal.name_ar;
                  if (deal.title_en) return deal.title_en;
                  if (deal.name) return deal.name;
                } else {
                  if (deal.title_en) return deal.title_en;
                  if (deal.name) return deal.name;
                }
                const storeName = isRTL ? deal.store_name_ar || deal.stores?.name_ar || deal.stores?.name || "متجر" : deal.store_name || deal.stores?.name || deal.stores?.name_ar || "Store";
                const discount = deal.discount_percentage ? `${deal.discount_percentage}% off` : deal.discount_amount ? `$${deal.discount_amount} off` : deal.code ? `Code: ${deal.code}` : "Special Offer";
                return isRTL ? `${discount} من ${storeName}` : `${discount} at ${storeName}`;
              };
              const title = getTitle();
              return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                Link,
                {
                  to: `/deal/${deal.slug || deal.id}`,
                  className: "text-[#6B7280] hover:text-[#111827] transition-colors text-sm underline underline-offset-2 hover:underline-offset-4",
                  children: title
                }
              ) }, deal.id);
            }) : /* @__PURE__ */ jsx("li", { className: "text-[#6B7280] text-sm", children: isRTL ? "قريباً..." : "Coming soon..." }),
            featuredDeals.length > 0 && /* @__PURE__ */ jsx("li", { className: "pt-2", children: /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/deals",
                className: "text-[#5FB57A] hover:text-[#4a9561] text-sm transition-colors underline underline-offset-2 hover:underline-offset-4",
                style: { fontWeight: 500 },
                children: [
                  t("footer.viewAll"),
                  " ",
                  !isRTL && "→"
                ]
              }
            ) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-4 text-[#111827]", style: { fontWeight: 600 }, children: t("footer.shoppingGuides") }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: guides.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
            guides.map((guide) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              Link,
              {
                to: `/guides/${guide.slug}`,
                className: "text-[#6B7280] hover:text-[#111827] transition-colors text-sm line-clamp-1 underline underline-offset-2 hover:underline-offset-4",
                children: guide.title
              }
            ) }, guide.id)),
            /* @__PURE__ */ jsx("li", { className: "pt-2", children: /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/guides",
                className: "text-[#5FB57A] hover:text-[#4a9561] text-sm transition-colors underline underline-offset-2 hover:underline-offset-4",
                style: { fontWeight: 500 },
                children: [
                  t("footer.viewAll"),
                  " ",
                  !isRTL && "→"
                ]
              }
            ) })
          ] }) : /* @__PURE__ */ jsx("li", { className: "text-[#6B7280] text-sm", children: isRTL ? "قريباً..." : "Coming soon..." }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-4 text-[#111827]", style: { fontWeight: 600 }, children: t("footer.topStores") }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: topStores.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
            topStores.map((store) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              Link,
              {
                to: `/store/${store.slug}`,
                className: "text-[#6B7280] hover:text-[#111827] transition-colors text-sm underline underline-offset-2 hover:underline-offset-4",
                children: store.name
              }
            ) }, store.id)),
            /* @__PURE__ */ jsx("li", { className: "pt-2", children: /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/stores",
                className: "text-[#5FB57A] hover:text-[#4a9561] text-sm transition-colors underline underline-offset-2 hover:underline-offset-4",
                style: { fontWeight: 500 },
                children: [
                  t("footer.viewAll"),
                  " ",
                  !isRTL && "→"
                ]
              }
            ) })
          ] }) : /* @__PURE__ */ jsx("li", { className: "text-[#6B7280] text-sm", children: isRTL ? "قريباً..." : "Coming soon..." }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-4 text-[#111827]", style: { fontWeight: 600 }, children: isRTL ? "تصفح حسب الفئة" : "Browse by Category" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: categories.length > 0 ? categories.map((category) => {
            const categoryName = category.category_name || category.name || category.label || category.title || "Category";
            const categoryUrl = `/category/${category.slug || category.id}`;
            return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
              Link,
              {
                to: categoryUrl,
                className: "text-[#6B7280] hover:text-[#111827] transition-colors text-sm underline underline-offset-2 hover:underline-offset-4",
                children: categoryName
              }
            ) }, category.id);
          }) : /* @__PURE__ */ jsx("li", { className: "text-[#6B7280] text-sm", children: isRTL ? "قريباً..." : "Coming soon..." }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "mb-4 text-[#111827]", style: { fontWeight: 600 }, children: isRTL ? "أفضل المنتجات مبيعًا" : "Best Selling Products" }),
          /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: bestSellingProducts.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
            bestSellingProducts.map((product) => {
              const getTitle = () => {
                if (isRTL) {
                  return product.title_ar || product.name_ar || product.title || product.name || "منتج";
                }
                return product.title || product.name || product.name_ar || product.title_ar || "Product";
              };
              const title = getTitle();
              return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                Link,
                {
                  to: `/products/${product.slug || product.id}`,
                  className: "text-[#6B7280] hover:text-[#111827] transition-colors text-sm line-clamp-1 underline underline-offset-2 hover:underline-offset-4",
                  children: title
                }
              ) }, product.id);
            }),
            /* @__PURE__ */ jsx("li", { className: "pt-2", children: /* @__PURE__ */ jsxs(
              Link,
              {
                to: "/products",
                className: "text-[#5FB57A] hover:text-[#4a9561] text-sm transition-colors underline underline-offset-2 hover:underline-offset-4",
                style: { fontWeight: 500 },
                children: [
                  t("footer.viewAll"),
                  " ",
                  !isRTL && "→"
                ]
              }
            ) })
          ] }) : /* @__PURE__ */ jsx("li", { className: "text-[#6B7280] text-sm", children: isRTL ? "قريباً..." : "Coming soon..." }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mb-8 pb-8 border-b-2 border-[#E5E7EB]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-[#111827] mb-6 text-center", style: { fontWeight: 600 }, children: t("testimonials.downloadApp") }),
      /* @__PURE__ */ jsxs("div", { className: `flex flex-col sm:flex-row items-center justify-center gap-4 ${isRTL ? "sm:flex-row-reverse" : ""}`, children: [
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "#",
            className: `group flex items-center gap-3 bg-white border-2 border-[#111827] rounded-xl px-4 py-2.5 transition-all hover:shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] ${isRTL ? "flex-row-reverse" : ""}`,
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-7 h-7 text-[#111827]", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" }) }),
              /* @__PURE__ */ jsxs("div", { className: `${isRTL ? "text-right" : "text-left"}`, children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs text-[#111827]/70", children: t("testimonials.downloadOn") }),
                /* @__PURE__ */ jsx("div", { className: "text-[#111827]", style: { fontWeight: 600 }, children: t("testimonials.appStore") })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "#",
            className: `group flex items-center gap-3 bg-white border-2 border-[#111827] rounded-xl px-4 py-2.5 transition-all hover:shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] ${isRTL ? "flex-row-reverse" : ""}`,
            children: [
              /* @__PURE__ */ jsx("svg", { className: "w-7 h-7 text-[#111827]", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" }) }),
              /* @__PURE__ */ jsxs("div", { className: `${isRTL ? "text-right" : "text-left"}`, children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs text-[#111827]/70", children: t("testimonials.getItOn") }),
                /* @__PURE__ */ jsx("div", { className: "text-[#111827]", style: { fontWeight: 600 }, children: t("testimonials.googlePlay") })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "#",
            className: `group flex items-center gap-3 bg-white border-2 border-[#111827] rounded-xl px-4 py-2.5 transition-all hover:shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] ${isRTL ? "flex-row-reverse" : ""}`,
            children: [
              /* @__PURE__ */ jsx(Chrome, { className: "w-7 h-7 text-[#111827]" }),
              /* @__PURE__ */ jsxs("div", { className: `${isRTL ? "text-right" : "text-left"}`, children: [
                /* @__PURE__ */ jsx("div", { className: "text-xs text-[#111827]/70", children: isRTL ? "أضف إلى" : "Add to" }),
                /* @__PURE__ */ jsx("div", { className: "text-[#111827]", style: { fontWeight: 600 }, children: "Chrome" })
              ] })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "pt-8", children: /* @__PURE__ */ jsxs("div", { className: `flex flex-col md:flex-row items-center justify-between gap-4 ${isRTL ? "md:flex-row-reverse" : ""}`, children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm text-[#6B7280]", children: t("footer.copyright") }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-[#6B7280] mr-2", children: t("footer.followUs") }),
        socialLinks.map((social, index) => {
          const Icon = social.icon;
          return /* @__PURE__ */ jsx(
            "a",
            {
              href: social.href,
              "aria-label": social.label,
              className: "h-10 w-10 rounded-full border-2 border-[#111827] hover:bg-[#5FB57A] flex items-center justify-center transition-colors",
              children: typeof Icon === "function" && Icon.name === "TikTokIcon" ? /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-[#111827]" }) : /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5 text-[#111827]" })
            },
            index
          );
        })
      ] })
    ] }) })
  ] }) });
}

const app = new Hono();
const mimeTypes = {
  ".css": "text/css",
  ".js": "application/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json"
};
app.get("/assets/*", async (c) => {
  const filePath = c.req.path;
  const localPath = `./build${filePath}`;
  try {
    const fileStats = await stat(localPath);
    if (!fileStats.isFile()) {
      return c.notFound();
    }
    const content = await readFile(localPath);
    const ext = extname(filePath);
    const mimeType = mimeTypes[ext] || "application/octet-stream";
    return c.body(content, 200, {
      "Content-Type": mimeType,
      "Cache-Control": "public, max-age=31536000"
      // 1 year
    });
  } catch (error) {
    return c.notFound();
  }
});
const staticFiles = ["favicon.svg", "favicon-32x32.png", "favicon-16x16.png", "apple-touch-icon.png", "site.webmanifest"];
staticFiles.forEach((file) => {
  app.get(`/${file}`, async (c) => {
    try {
      const content = await readFile(`./build/${file}`);
      const ext = extname(file);
      const mimeType = mimeTypes[ext] || "application/octet-stream";
      return c.body(content, 200, {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000"
      });
    } catch (error) {
      return c.notFound();
    }
  });
});
async function fetchStoresData() {
  try {
    const { createClient } = await Promise.resolve().then(() => client);
    const supabase = createClient();
    let storesQuery = supabase.from("stores").select("*").limit(50);
    const { data: storesData, error } = await storesQuery;
    if (error) {
      console.error("Error fetching stores data:", error);
      return [];
    }
    return storesData || [];
  } catch (error) {
    console.error("Error in fetchStoresData:", error);
    return [];
  }
}
async function fetchDealsData() {
  try {
    const { createClient } = await Promise.resolve().then(() => client);
    const supabase = createClient();
    const { data: dealsData, error } = await supabase.from("deals").select("*").limit(50).order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching deals data:", error);
      return { deals: [], total: 0 };
    }
    return { deals: dealsData || [], total: dealsData?.length || 0 };
  } catch (error) {
    console.error("Error in fetchDealsData:", error);
    return { deals: [], total: 0 };
  }
}
async function fetchProductsData() {
  try {
    const { createClient } = await Promise.resolve().then(() => client);
    const supabase = createClient();
    const { data: productsData, error } = await supabase.from("products").select("*").limit(50).order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching products data:", error);
      return [];
    }
    return productsData || [];
  } catch (error) {
    console.error("Error in fetchProductsData:", error);
    return [];
  }
}
async function fetchGuidesData() {
  try {
    const { createClient } = await Promise.resolve().then(() => client);
    const supabase = createClient();
    const { data: guidesData, error } = await supabase.from("articles").select("*").limit(50).order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching guides data:", error);
      return [];
    }
    return guidesData || [];
  } catch (error) {
    console.error("Error in fetchGuidesData:", error);
    return [];
  }
}
async function fetchProductData(slug) {
  const products = {
    "samsung-galaxy-s24": {
      id: 1,
      title: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24",
      description: "Samsung Galaxy S24 Ultra with 256GB storage, 200MP camera, S Pen included. Features a stunning 6.8-inch Dynamic AMOLED display and powerful Snapdragon processor.",
      price: 599.99,
      original_price: 1199.99,
      currency: "USD",
      store: "Amazon",
      available: true,
      images: [
        "https://via.placeholder.com/600x600",
        "https://via.placeholder.com/600x600/alt"
      ],
      rating: 4.5,
      ratings_count: 2847,
      sku: "B0CJHJFQ2B",
      features: ["256GB Storage", "200MP Camera", "S Pen Included", '6.8" Display']
    }
  };
  return products[slug] || null;
}
async function fetchFooterData(country) {
  try {
    const dealsResponse = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-4f34ef25/featured-deals${country ? `?country=${country}` : ""}`,
      {
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`
        }
      }
    );
    let featuredDeals = [];
    if (dealsResponse.ok) {
      const dealsData = await dealsResponse.json();
      featuredDeals = (dealsData.deals || []).map((item) => item.deals).filter(Boolean).slice(0, 5);
    }
    const { createClient } = await Promise.resolve().then(() => client);
    const supabase = createClient();
    let storesQuery = supabase.from("stores").select("*").limit(20);
    if (country) {
      const { data: countryData } = await supabase.from("countries").select("id").eq("value", country).single();
      if (countryData) {
        storesQuery = storesQuery.eq("country_id", countryData.id);
      }
    }
    const { data: storesData } = await storesQuery;
    const topStores = (storesData || []).slice(0, 10);
    const { data: categoriesData } = await supabase.from("categories").select("*").limit(10);
    const categories = categoriesData || [];
    const { data: guidesData } = await supabase.from("articles").select("*").limit(5);
    const guides = guidesData || [];
    return {
      featuredDeals,
      topStores,
      categories,
      guides
    };
  } catch (error) {
    console.warn("⚠️ Could not fetch footer data:", error.message);
    return {
      featuredDeals: [],
      topStores: [],
      categories: [],
      guides: []
    };
  }
}
async function fetchDealData(slug) {
  try {
    const { createClient } = await Promise.resolve().then(() => client);
    const supabase = createClient();
    const { data: dealData, error: dealError } = await supabase.from("deals").select("*").eq("slug", slug).single();
    if (dealError) throw dealError;
    if (!dealData) return null;
    let storeData = null;
    if (dealData.store_id) {
      const { data: store } = await supabase.from("stores").select("*").eq("id", dealData.store_id).single();
      storeData = store;
    }
    let relatedDeals = [];
    if (dealData.store_id) {
      const { data: related } = await supabase.from("deals").select("*").eq("store_id", dealData.store_id).neq("slug", slug).limit(4);
      if (related) {
        relatedDeals = related.map((deal) => ({
          ...deal,
          store_name: storeData?.title || dealData.store_name,
          store_name_ar: storeData?.title_ar || dealData.store_name_ar,
          store_logo: storeData?.profile_picture_url || dealData.store_logo
        }));
      }
    }
    return {
      ...dealData,
      store: storeData,
      related_deals: relatedDeals
    };
  } catch (error) {
    console.warn(`⚠️ Could not fetch deal "${slug}" from Supabase:`, error.message);
    return null;
  }
}
async function fetchStoreData(slug) {
  try {
    const { createClient } = await Promise.resolve().then(() => client);
    const supabase = createClient();
    const isUUID = (str) => {
      const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      return uuidPattern.test(str);
    };
    let storeData = null;
    if (isUUID(slug)) {
      const { data: store, error: storeError } = await supabase.from("stores").select("*").eq("id", slug).single();
      if (!storeError && store) {
        storeData = store;
      }
    } else {
      const { data: store, error: storeError } = await supabase.from("stores").select("*").eq("slug", slug).single();
      if (!storeError && store) {
        storeData = store;
      }
    }
    if (!storeData) {
      const { data: allStores } = await supabase.from("stores").select("id, title, title_ar, slug");
      if (allStores) {
        const matchedStore = allStores.find((store) => {
          const storeName = store.title || store.title_ar || "";
          const generatedSlug = storeName.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
          return generatedSlug === slug || store.id === slug;
        });
        if (matchedStore) {
          const { data: finalStore } = await supabase.from("stores").select("*").eq("id", matchedStore.id).single();
          storeData = finalStore;
        }
      }
    }
    if (!storeData) {
      console.warn(`⚠️ Store "${slug}" not found in Supabase`);
      return null;
    }
    const { data: storeDeals, error: dealsError } = await supabase.from("deals").select("*").eq("store_id", storeData.id).order("created_at", { ascending: false }).limit(20);
    if (dealsError) {
      console.warn(`⚠️ Could not fetch deals for store "${slug}":`, dealsError.message);
    }
    return {
      ...storeData,
      deals: storeDeals || []
    };
  } catch (error) {
    console.warn(`⚠️ Could not fetch store "${slug}" from Supabase:`, error.message);
    return null;
  }
}
function generateMetadata(route, data) {
  const baseMetadata = {
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1.0",
    themeColor: "#5FB57A",
    robots: "index, follow",
    googlebot: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    author: "Tuut - Smart Deal Finder",
    publisher: "Tuut",
    applicationName: "Tuut",
    keywords: "deals, discounts, coupons, savings, offers, shopping, e-commerce, best prices",
    language: "en",
    rating: "general",
    distribution: "global",
    revisitAfter: "1 day",
    documentState: "dynamic"
  };
  switch (true) {
    case route === "/":
      return {
        ...baseMetadata,
        title: "Tuut - Smart Deal Finder | Save Up to 80% on Electronics, Fashion & More",
        description: "Tuut is your ultimate deal finder platform. Discover verified coupons, flash sales, and exclusive discounts from 1000+ top retailers. Save big on electronics, fashion, home goods, travel, and more. Updated daily with AI-powered deal matching.",
        ogType: "website",
        ogImage: "/og-image-home.jpg",
        siteName: "Tuut",
        category: "shopping,deals,savings",
        subject: "Online Shopping Deals and Discounts"
      };
    case route === "/deals":
      return {
        ...baseMetadata,
        title: `Hot Deals & Flash Sales - ${data.total || 500}+ Active Offers | Tuut`,
        description: `Explore ${data.total || 500}+ verified deals and limited-time offers from top retailers. Tuut curates the best discounts on electronics, fashion, home goods, and more. Save up to 80% with AI-powered deal recommendations updated in real-time.`,
        ogType: "website",
        ogImage: "/og-image-deals.jpg",
        siteName: "Tuut",
        category: "deals,shopping,savings,flash-sales",
        subject: "Current Deals and Discount Offers"
      };
    case route.startsWith("/deal/"):
      const product = data?.product;
      if (!product) {
        return {
          ...baseMetadata,
          title: "Exclusive Deals & Discount Codes | Tuut Smart Deals",
          description: "Find the best verified deals and discount codes from top retailers. Save money on your favorite brands with Tuut.",
          ogType: "website",
          ogImage: "/og-image.jpg",
          siteName: "Tuut",
          category: "deals,shopping,savings,discounts",
          subject: "Current Deals and Offers"
        };
      }
      const discount = product.original_price && product.price ? Math.round((product.original_price - product.price) / product.original_price * 100) : 0;
      return {
        ...baseMetadata,
        title: `${product.title} - ${discount > 0 ? `${discount}% Off | ` : ""}Tuut`,
        description: product.description?.substring(0, 160) || `Get ${product.title} for $${product.price}${discount > 0 ? ` (${discount}% off)` : ""}. ${product.available ? "In stock" : "Out of stock"} at ${product.store}.`,
        ogType: "product",
        ogImage: product.images?.[0] || "/product-placeholder.jpg",
        productPriceAmount: product.price,
        productPriceCurrency: product.currency || "USD",
        productAvailability: product.available ? "in stock" : "out of stock",
        productBrand: product.store || ""
      };
    case route.startsWith("/store/"):
      return {
        ...baseMetadata,
        title: `Amazon Deals & Coupons - Tuut`,
        description: "Find the latest Amazon deals, coupons, and discount codes. Save money on electronics, books, fashion, and more with verified Amazon offers.",
        ogType: "website",
        ogImage: "/og-image-store.jpg"
      };
    default:
      return {
        ...baseMetadata,
        title: "Tuut - Best Deals & Discounts",
        description: "Discover the best deals and discounts from top stores. Save up to 80% today.",
        ogType: "website"
      };
  }
}
function generateStructuredData(route, data) {
  switch (true) {
    case route === "/deals":
      return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Hot Deals and Flash Sales on Tuut",
        description: "Discover verified deals, discounts, and exclusive offers from 1000+ top retailers curated by Tuut AI",
        url: `https://tuut.com${route}`,
        provider: {
          "@type": "Organization",
          name: "Tuut",
          url: "https://tuut.com",
          logo: "https://tuut.com/logo.png",
          description: "Tuut is the smart deal finder platform that helps shoppers save money with AI-powered deal recommendations and verified discount codes.",
          sameAs: [
            "https://facebook.com/tuutdeals",
            "https://twitter.com/tuutdeals",
            "https://instagram.com/tuutdeals"
          ],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            email: "support@tuut.com"
          }
        },
        mainEntity: {
          "@type": "ItemList",
          name: "Current Active Deals and Discounts",
          description: "Hand-picked deals from verified retailers with significant savings",
          numberOfItems: data.total || 0,
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          itemListElement: data.deals?.slice(0, 10).map((deal2, index) => ({
            "@type": "Offer",
            position: index + 1,
            name: deal2.title,
            description: deal2.description,
            url: `https://tuut.com/deal/${deal2.slug}`,
            price: deal2.discounted_price,
            priceCurrency: "USD",
            discount: deal2.original_price ? `${Math.round((deal2.original_price - deal2.discounted_price) / deal2.original_price * 100)}%` : void 0,
            availability: deal2.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            validFrom: (/* @__PURE__ */ new Date()).toISOString(),
            seller: {
              "@type": "Organization",
              name: deal2.store_name,
              url: `https://tuut.com/store/${deal2.store_name?.toLowerCase() || "unknown"}`
            },
            provider: {
              "@type": "Organization",
              name: "Tuut",
              url: "https://tuut.com"
            }
          }))
        }
      };
    case route.startsWith("/deal/"):
      const deal = data?.product;
      if (!deal) {
        return null;
      }
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: deal.title_en,
        description_en: deal.description_en,
        image: deal.image_url ? [deal.image_url] : [],
        brand: {
          "@type": "Brand",
          name: deal.store_name || "Tuut"
        },
        offers: {
          "@type": "Offer",
          url: `https://tuut.com${route}`,
          priceCurrency: "USD",
          // Deal prices are typically in the local currency
          price: deal.discounted_price || deal.original_price,
          availability: deal.available !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: deal.store_name || "Tuut"
          },
          ...deal.original_price && deal.discounted_price && {
            highPrice: deal.original_price,
            discount: Math.round((deal.original_price - deal.discounted_price) / deal.original_price * 100) + "%"
          }
        },
        // Deal items typically don't have ratings like products
        ...deal.is_verified && {
          review: {
            "@type": "Review",
            reviewRating: {
              "@type": "Rating",
              ratingValue: "5",
              bestRating: "5"
            },
            author: {
              "@type": "Organization",
              name: "Tuut Verification Team"
            }
          }
        }
      };
    case (route === "/guides" || route === "/blog"):
      return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Shopping Guides and Tips - Tuut",
        description: "Expert shopping guides, tips, and insights to help you save more and shop smarter",
        url: `https://tuut.com${route}`,
        provider: {
          "@type": "Organization",
          name: "Tuut",
          url: "https://tuut.com"
        },
        mainEntity: {
          "@type": "ItemList",
          name: "Shopping Guides",
          description: "Expert tips and insights for smart shopping",
          numberOfItems: data.articles?.length || 0,
          itemListElement: data.articles?.slice(0, 10).map((article, index) => ({
            "@type": "Article",
            position: index + 1,
            name: article.title || article.title_ar || "Untitled Article",
            description: article.excerpt || article.excerpt_ar || "",
            url: `https://tuut.com/guides/${article.slug || article.id}`,
            datePublished: article.created_at,
            author: {
              "@type": "Person",
              name: article.author || article.author_ar || "Tuut Team"
            }
          })) || []
        }
      };
    default:
      return null;
  }
}
app.get("*", async (c) => {
  try {
    const url = new URL(c.req.url);
    const path = url.pathname;
    let data = {};
    try {
      const urlSearchParams = url.searchParams;
      const country = urlSearchParams.get("country") || void 0;
      const footerData = await fetchFooterData(country);
      if (path === "/deals") {
        data = {
          ...await fetchDealsData(),
          footer: footerData
        };
      } else if (path.startsWith("/deal/")) {
        const slug = path.split("/")[2];
        const dealData = await fetchDealData(slug);
        if (dealData) {
          data = {
            product: dealData,
            store: dealData.store,
            related_deals: dealData.related_deals,
            footer: footerData
          };
        } else {
          data = { footer: footerData };
        }
      } else if (path.startsWith("/store/")) {
        const slug = path.split("/")[2];
        const storeData = await fetchStoreData(slug);
        if (storeData) {
          data = {
            store: storeData,
            deals: storeData.deals || [],
            footer: footerData
          };
        } else {
          data = { footer: footerData };
        }
      } else if (path.startsWith("/product/")) {
        const slug = path.split("/")[2];
        data = {
          product: await fetchProductData(slug),
          footer: footerData
        };
      } else if (path === "/stores") {
        data = {
          stores: await fetchStoresData(),
          footer: footerData
        };
      } else if (path === "/products") {
        data = {
          products: await fetchProductsData(),
          footer: footerData
        };
      } else if (path === "/guides" || path === "/blog") {
        data = {
          articles: await fetchGuidesData(),
          footer: footerData
        };
      } else {
        data = { footer: footerData };
      }
    } catch (error) {
      console.error("Error fetching route data:", error);
    }
    const metadata = generateMetadata(path, data);
    const structuredData = generateStructuredData(path, data);
    setGlobalSSRData(data);
    const PageComponent = getPageForPath(path);
    const pageContent = /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsx(Header, {}),
      /* @__PURE__ */ jsx("main", { children: /* @__PURE__ */ jsx(PageComponent, {}) }),
      /* @__PURE__ */ jsx(Footer, {})
    ] });
    const appHtml = renderToString(
      /* @__PURE__ */ jsx(RouterProvider, { initialPath: path, children: /* @__PURE__ */ jsx(LanguageProvider, { children: /* @__PURE__ */ jsx(CountryProvider, { children: /* @__PURE__ */ jsx(AuthProvider, { children: /* @__PURE__ */ jsx(SSRDataProvider, { data, children: pageContent }) }) }) }) })
    );
    const html = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <!-- Basic Meta -->
          <meta charset="${metadata.charset}" />
          <meta name="viewport" content="${metadata.viewport}" />
          <title>${metadata.title}</title>
          <meta name="description" content="${metadata.description}" />
          <meta name="keywords" content="${metadata.keywords}" />
          <meta name="author" content="${metadata.author}" />
          <meta name="publisher" content="${metadata.publisher}" />
          <meta name="application-name" content="${metadata.applicationName}" />
          <meta name="language" content="${metadata.language}" />
          <meta name="rating" content="${metadata.rating}" />
          <meta name="distribution" content="${metadata.distribution}" />
          <meta name="revisit-after" content="${metadata.revisitAfter}" />
          <meta name="document-state" content="${metadata.documentState}" />

          <!-- Advanced SEO -->
          <meta name="robots" content="${metadata.robots}" />
          <meta name="googlebot" content="${metadata.googlebot}" />
          <meta name="theme-color" content="${metadata.themeColor}" />
          <meta name="msapplication-TileColor" content="${metadata.themeColor}" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Tuut" />

          <!-- Category and Subject -->
          ${metadata.category ? `<meta name="category" content="${metadata.category}" />` : ""}
          ${metadata.subject ? `<meta name="subject" content="${metadata.subject}" />` : ""}
          ${metadata.siteName ? `<meta name="site" content="${metadata.siteName}" />` : ""}

          <!-- Canonical and Alternate URLs -->
          <link rel="canonical" href="https://tuut.com${path}" />
          <link rel="alternate" hreflang="en" href="https://tuut.com${path}" />
          <link rel="alternate" hreflang="x-default" href="https://tuut.com${path}" />

          <!-- Open Graph / Facebook -->
          <meta property="og:title" content="${metadata.title}" />
          <meta property="og:description" content="${metadata.description}" />
          <meta property="og:type" content="${metadata.ogType}" />
          <meta property="og:url" content="https://tuut.com${path}" />
          <meta property="og:image" content="https://tuut.com${metadata.ogImage}" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content="${metadata.title}" />
          <meta property="og:site_name" content="Tuut" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:locale:alternate" content="en_GB" />

          <!-- Twitter Card -->
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${metadata.title}" />
          <meta name="twitter:description" content="${metadata.description}" />
          <meta name="twitter:image" content="https://tuut.com${metadata.ogImage}" />
          <meta name="twitter:image:alt" content="${metadata.title}" />
          <meta name="twitter:site" content="@tuutdeals" />
          <meta name="twitter:creator" content="@tuutdeals" />
          <meta name="twitter:domain" content="tuut.com" />

          <!-- E-commerce Specific Meta -->
          ${metadata.productPriceAmount ? `
            <meta name="product:price:amount" content="${metadata.productPriceAmount}" />
            <meta name="product:price:currency" content="${metadata.productPriceCurrency}" />
            <meta name="product:availability" content="${metadata.productAvailability}" />
            <meta name="product:brand" content="${metadata.productBrand}" />
            <meta name="product:condition" content="${metadata.condition}" />
            <meta name="product:retailer_item_id" content="${metadata.sku}" />
            <meta property="product:price:amount" content="${metadata.productPriceAmount}" />
            <meta property="product:price:currency" content="${metadata.productPriceCurrency}" />
            <meta property="product:availability" content="${metadata.productAvailability}" />
            <meta property="product:brand" content="${metadata.productBrand}" />
            <meta property="product:condition" content="${metadata.condition}" />
            <meta property="product:retailer_item_id" content="${metadata.sku}" />
          ` : ""}

          <!-- Rich Snippets Validation -->
          <meta name="google-site-verification" content="your-google-verification-code" />
          <meta name="msvalidate.01" content="your-bing-verification-code" />
          <meta name="yandex-verification" content="your-yandex-verification-code" />

          <!-- Business Information -->
          <meta name="business:contact_data:street_address" content="123 Shopping Street" />
          <meta name="business:contact_data:locality" content="Cairo" />
          <meta name="business:contact_data:region" content="Cairo" />
          <meta name="business:contact_data:postal_code" content="12345" />
          <meta name="business:contact_data:country_name" content="Egypt" />
          <meta name="business:contact_data:email" content="support@tuut.com" />
          <meta name="business:contact_data:phone_number" content="+20 123 456 7890" />
          <meta name="business:contact_data:website" content="https://tuut.com" />

          <!-- Performance and CDN -->
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link rel="preconnect" href="https://api.tuut.com" />
          <link rel="dns-prefetch" href="//cdn.tuut.com" />
          <link rel="dns-prefetch" href="//analytics.tuut.com" />

          <!-- Critical CSS -->
          <style>
            /* Critical CSS for above-the-fold content */
            body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            #root { min-height: 100vh; }
          </style>

          <!-- Stylesheets -->
          <link rel="stylesheet" href="/assets/index-1UyPdu-j.css" />

          <!-- Icons and Manifest -->
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="${metadata.themeColor}" />

          <!-- Structured Data (JSON-LD) -->
          ${structuredData ? `
            <script type="application/ld+json">
            ${JSON.stringify(structuredData).replace(/</g, "\\u003c")}
            <\/script>
          ` : ""}

          <!-- Analytics (placeholder) -->
          <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"><\/script>
          <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          <\/script>
        </head>
        <body>
          <div id="root">${appHtml}</div>

          <!-- Built client bundle (PRODUCTION version) -->
          <script type="module" src="/assets/index-HlZX9iwz.js" defer><\/script>

          <!-- Initial data for client-side hydration -->
          <script>
            window.__INITIAL_DATA__ = ${JSON.stringify(data)};
            window.__TUUT_CONFIG__ = {
              apiEndpoint: 'https://api.tuut.com',
              version: '1.0.0',
              environment: 'production'
            };
          <\/script>

          <!-- Performance Monitoring (placeholder) -->
          <script>
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          <\/script>
        </body>
      </html>
    `;
    c.header("Content-Type", "text/html; charset=utf-8");
    c.header("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    c.header("X-Content-Type-Options", "nosniff");
    c.header("X-Frame-Options", "SAMEORIGIN");
    c.header("X-XSS-Protection", "1; mode=block");
    c.header("Referrer-Policy", "strict-origin-when-cross-origin");
    c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
    c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    c.header("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.tuut.com https://analytics.google.com https://oluyzqunbbqaxalodhdg.supabase.co https://oluyzqunbbqaxalodhdg.supabase.co/rest/v1 https://oluyzqunbbqaxalodhdg.supabase.co/functions/v1; frame-src 'self' https://www.youtube.com");
    c.header("X-Robots-Tag", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    c.header("X-UA-Compatible", "IE=edge");
    c.header("Vary", "Accept-Encoding, Accept-Language");
    c.header("Accept-Ranges", "bytes");
    return c.html(html.trim());
  } catch (error) {
    console.error("SSR Error:", error);
    return c.html(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Tuut - Error</title>
        </head>
        <body>
          <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
            <h1>Something went wrong</h1>
            <p>Please refresh the page or try again later.</p>
          </div>
        </body>
      </html>
    `, 500);
  }
});
const port = 3e3;
const isDev = process.env.DEV_MODE === "true" || !process.env.VERCEL && process.env.NODE_ENV !== "production";
if (isDev) {
  (async () => {
    try {
      const { serve } = await import('@hono/node-server');
      console.log(`🚀 SSR server running at http://localhost:${port}`);
      console.log("🔄 Hot reload enabled - modify any file to rebuild");
      serve({
        fetch: app.fetch,
        port
      });
    } catch (error) {
      console.error("❌ Failed to start server:", error);
      console.log("Falling back to direct export mode...");
    }
  })();
}

export { app as default };
