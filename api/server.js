import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { Hono } from 'hono';
import { renderToString } from 'react-dom/server';
import { stat, readFile } from 'fs/promises';
import { extname } from 'path';
import * as React from 'react';
import { createContext, useState, useEffect, useContext } from 'react';
import { XIcon, Phone, Loader2, Globe, Languages, LogOut, PiggyBank, Menu, Mail, Chrome, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as LabelPrimitive from '@radix-ui/react-label';
import { createClient as createClient$1 } from '@supabase/supabase-js';

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
    let value = translations[language];
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
const translations = {
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
      const { fetchCountries: fetchCountriesAPI } = await import('./chunks/api-BcNMdqht.js');
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

const FallbackPage = () => /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-background flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
  /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold mb-4", children: "Tuut Website" }),
  /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground", children: "SSR Website is loading..." })
] }) });
function getPageForPath(path) {
  return FallbackPage;
}

function cn(...inputs) {
  return twMerge(clsx(inputs));
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

function getCountryName(country, language = "en") {
  if (!country) return language === "en" ? "Country" : "دولة";
  return country.label[language] || (language === "en" ? "Country" : "دولة");
}
function getCountryImage(country) {
  if (!country) return "";
  return country.image_url || "";
}
function getCountryId(country) {
  if (!country) return "";
  return country.id || "";
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
                  if (deal.title) return deal.title;
                  if (deal.name) return deal.name;
                } else {
                  if (deal.title) return deal.title;
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
        name: deal.title,
        description: deal.description,
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

export { publicAnonKey as a, app as default, projectId as p };
