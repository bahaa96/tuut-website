"use client";
import {
  ShoppingBag,
  Laptop,
  Coffee,
  Plane,
  Sparkles,
  Dumbbell,
  Home,
  Heart,
  ChevronLeft,
  ChevronRight,
  Shirt,
  Watch,
  Footprints,
  Glasses,
  Smartphone,
  Tablet,
  Headphones,
  Monitor,
  Camera,
  Gamepad2,
  Utensils,
  Pizza,
  Wine,
  IceCream2,
  Palmtree,
  Hotel,
  Luggage,
  Map,
  Brush,
  Gem,
  Trophy,
  Bike,
  Waves,
  Sofa,
  Lamp,
  Hammer,
  Pill,
  Baby,
  Leaf,
  Apple,
  BookOpen,
  GraduationCap,
  Palette,
  Music,
  Film,
  Car,
  Wrench,
  PawPrint,
  Dog,
  Cat,
  Package,
  Gift,
  Tags,
  Flower,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Category } from "@/domain-models";
import * as m from "@/src/paraglide/messages";

interface CategoryGridProps {
  initialCategories: Category[];
}

// Function to get icon based on category name
function getCategoryIcon(categoryName: string): LucideIcon {
  const name = categoryName.toLowerCase();

  // Fashion & Clothing
  if (
    name.includes("fashion") ||
    name.includes("clothing") ||
    name.includes("apparel")
  ) {
    return Shirt;
  }
  if (name.includes("shoe") || name.includes("footwear")) {
    return Footprints;
  }
  if (
    name.includes("accessories") ||
    name.includes("watch") ||
    name.includes("jewelry")
  ) {
    return Watch;
  }
  if (
    name.includes("glasses") ||
    name.includes("eyewear") ||
    name.includes("sunglass")
  ) {
    return Glasses;
  }

  // Electronics & Tech
  if (
    name.includes("electron") ||
    name.includes("tech") ||
    name.includes("computer") ||
    name.includes("laptop")
  ) {
    return Laptop;
  }
  if (
    name.includes("phone") ||
    name.includes("mobile") ||
    name.includes("smartphone")
  ) {
    return Smartphone;
  }
  if (name.includes("tablet") || name.includes("ipad")) {
    return Tablet;
  }
  if (
    name.includes("headphone") ||
    name.includes("audio") ||
    name.includes("speaker")
  ) {
    return Headphones;
  }
  if (name.includes("camera") || name.includes("photo")) {
    return Camera;
  }
  if (
    name.includes("gaming") ||
    name.includes("game") ||
    name.includes("console")
  ) {
    return Gamepad2;
  }
  if (
    name.includes("monitor") ||
    name.includes("display") ||
    name.includes("screen")
  ) {
    return Monitor;
  }

  // Food & Dining
  if (
    name.includes("food") ||
    name.includes("dining") ||
    name.includes("restaurant") ||
    name.includes("meal")
  ) {
    return Utensils;
  }
  if (
    name.includes("coffee") ||
    name.includes("cafe") ||
    name.includes("drink") ||
    name.includes("beverage")
  ) {
    return Coffee;
  }
  if (name.includes("pizza")) {
    return Pizza;
  }
  if (
    name.includes("wine") ||
    name.includes("alcohol") ||
    name.includes("bar")
  ) {
    return Wine;
  }
  if (
    name.includes("ice cream") ||
    name.includes("dessert") ||
    name.includes("sweet")
  ) {
    return IceCream2;
  }

  // Travel
  if (
    name.includes("travel") ||
    name.includes("flight") ||
    name.includes("airline")
  ) {
    return Plane;
  }
  if (
    name.includes("hotel") ||
    name.includes("accommodation") ||
    name.includes("resort")
  ) {
    return Hotel;
  }
  if (
    name.includes("vacation") ||
    name.includes("beach") ||
    name.includes("tropical")
  ) {
    return Palmtree;
  }
  if (
    name.includes("luggage") ||
    name.includes("baggage") ||
    name.includes("suitcase")
  ) {
    return Luggage;
  }
  if (
    name.includes("tour") ||
    name.includes("map") ||
    name.includes("navigation")
  ) {
    return Map;
  }

  // Beauty & Personal Care
  if (
    name.includes("beauty") ||
    name.includes("makeup") ||
    name.includes("cosmetic")
  ) {
    return Sparkles;
  }
  if (name.includes("hair") || name.includes("salon")) {
    return Brush;
  }
  if (
    name.includes("jewelry") ||
    name.includes("jewellery") ||
    name.includes("gem")
  ) {
    return Gem;
  }

  // Sports & Fitness
  if (
    name.includes("sport") ||
    name.includes("fitness") ||
    name.includes("gym") ||
    name.includes("exercise")
  ) {
    return Dumbbell;
  }
  if (
    name.includes("bike") ||
    name.includes("cycling") ||
    name.includes("bicycle")
  ) {
    return Bike;
  }
  if (
    name.includes("swim") ||
    name.includes("pool") ||
    name.includes("water sport")
  ) {
    return Waves;
  }
  if (
    name.includes("trophy") ||
    name.includes("award") ||
    name.includes("competition")
  ) {
    return Trophy;
  }

  // Home & Garden
  if (
    name.includes("home") ||
    name.includes("house") ||
    name.includes("household")
  ) {
    return Home;
  }
  if (
    name.includes("furniture") ||
    name.includes("sofa") ||
    name.includes("couch")
  ) {
    return Sofa;
  }
  if (
    name.includes("garden") ||
    name.includes("outdoor") ||
    name.includes("plant")
  ) {
    return Flower;
  }
  if (
    name.includes("tool") ||
    name.includes("hardware") ||
    name.includes("diy")
  ) {
    return Hammer;
  }
  if (
    name.includes("decor") ||
    name.includes("decoration") ||
    name.includes("lamp")
  ) {
    return Lamp;
  }

  // Health & Wellness
  if (
    name.includes("health") ||
    name.includes("wellness") ||
    name.includes("medical")
  ) {
    return Heart;
  }
  if (
    name.includes("pharmacy") ||
    name.includes("medicine") ||
    name.includes("drug")
  ) {
    return Pill;
  }
  if (
    name.includes("baby") ||
    name.includes("infant") ||
    name.includes("child care")
  ) {
    return Baby;
  }
  if (
    name.includes("organic") ||
    name.includes("natural") ||
    name.includes("eco")
  ) {
    return Leaf;
  }
  if (
    name.includes("nutrition") ||
    name.includes("vitamin") ||
    name.includes("supplement")
  ) {
    return Apple;
  }

  // Books & Education
  if (
    name.includes("book") ||
    name.includes("reading") ||
    name.includes("literature")
  ) {
    return BookOpen;
  }
  if (
    name.includes("education") ||
    name.includes("school") ||
    name.includes("college") ||
    name.includes("university")
  ) {
    return GraduationCap;
  }
  if (
    name.includes("art") ||
    name.includes("craft") ||
    name.includes("creative")
  ) {
    return Palette;
  }
  if (name.includes("music") || name.includes("audio")) {
    return Music;
  }
  if (
    name.includes("movie") ||
    name.includes("film") ||
    name.includes("entertainment")
  ) {
    return Film;
  }

  // Automotive
  if (
    name.includes("car") ||
    name.includes("auto") ||
    name.includes("vehicle")
  ) {
    return Car;
  }
  if (
    name.includes("repair") ||
    name.includes("mechanic") ||
    name.includes("maintenance")
  ) {
    return Wrench;
  }

  // Pets
  if (name.includes("pet") || name.includes("animal")) {
    return PawPrint;
  }
  if (
    name.includes("dog") ||
    name.includes("puppy") ||
    name.includes("canine")
  ) {
    return Dog;
  }
  if (
    name.includes("cat") ||
    name.includes("kitten") ||
    name.includes("feline")
  ) {
    return Cat;
  }

  // Kids & Toys
  if (
    name.includes("toy") ||
    name.includes("kid") ||
    name.includes("children") ||
    name.includes("baby")
  ) {
    return Package;
  }

  // Gifts & Special
  if (name.includes("gift") || name.includes("present")) {
    return Gift;
  }
  if (
    name.includes("deal") ||
    name.includes("coupon") ||
    name.includes("discount")
  ) {
    return Tags;
  }

  // Default icon
  return ShoppingBag;
}

export function CategoryGrid({ initialCategories }: CategoryGridProps) {
  const pathname = usePathname();
  const localeCountry = pathname?.split("/")[1];
  const locale = localeCountry?.split("-")[0];
  const isRTL = locale === "ar";
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const navigate = (url: string) => {
    router.push(url);
  };

  useEffect(() => {
    checkScrollButtons();
  }, [scrollPosition, initialCategories]);

  const checkScrollButtons = () => {
    const container = document.getElementById("category-scroll-container");
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft <
          container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("category-scroll-container");
    if (container) {
      const scrollAmount = 400;
      const newPosition =
        direction === "left"
          ? container.scrollLeft - scrollAmount
          : container.scrollLeft + scrollAmount;

      container.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });

      setTimeout(() => {
        setScrollPosition(container.scrollLeft);
      }, 300);
    }
  };

  if (!initialCategories || initialCategories.length === 0) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2
              className="mb-2 text-[#111827]"
              style={{ fontSize: "36px", fontWeight: 700 }}
            >
              {m.CATEGORIES()}
            </h2>
            <p className="text-[#6B7280]">{m.EXPLORE_DEALS_CATEGORY()}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-6 border-2 border-[#E5E7EB] h-32 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto max-w-[1200px] px-4 md:px-6 lg:px-8">
        <div
          className={`mb-10 ${isRTL ? "text-right" : "text-left"}`}
        >
          <h2
            className="mb-2 text-[#111827]"
            style={{ fontSize: "36px", fontWeight: 700 }}
          >
            {m.CATEGORIES()}
          </h2>
          <p className="text-[#6B7280]">{m.EXPLORE_DEALS_CATEGORY()}</p>
        </div>

        <div className="relative">
          {/* Left Arrow */}
          {canScrollLeft && (
            <Button
              onClick={() => scroll(isRTL ? "right" : "left")}
              className={`absolute ${
                isRTL ? "right-0" : "left-0"
              } top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all p-0 flex items-center justify-center`}
              style={isRTL ? { marginRight: "-24px" } : { marginLeft: "-24px" }}
            >
              {isRTL ? (
                <ChevronRight className="h-6 w-6 text-[#111827]" />
              ) : (
                <ChevronLeft className="h-6 w-6 text-[#111827]" />
              )}
            </Button>
          )}

          {/* Right Arrow */}
          {canScrollRight && (
            <Button
              onClick={() => scroll(isRTL ? "left" : "right")}
              className={`absolute ${
                isRTL ? "left-0" : "right-0"
              } top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white border-2 border-[#111827] shadow-[4px_4px_0px_0px_rgba(17,24,39,1)] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] transition-all p-0 flex items-center justify-center`}
              style={isRTL ? { marginLeft: "-24px" } : { marginRight: "-24px" }}
            >
              {isRTL ? (
                <ChevronLeft className="h-6 w-6 text-[#111827]" />
              ) : (
                <ChevronRight className="h-6 w-6 text-[#111827]" />
              )}
            </Button>
          )}

          {/* Scrollable Container */}
          <div
            id="category-scroll-container"
            className="overflow-x-auto scrollbar-hide"
            onScroll={(e) => {
              setScrollPosition(e.currentTarget.scrollLeft);
              checkScrollButtons();
            }}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {/* Two-row grid */}
            <div className="grid grid-rows-2 grid-flow-col gap-4 md:gap-6 pb-2">
              {initialCategories.map((category, index) => {
                // Get category name based on language
                const categoryName = isRTL
                  ? category.title_ar || category.title_en || "Uncategorized"
                  : category.title_en || category.title_ar || "Uncategorized";

                // Get icon based on category name
                const Icon = getCategoryIcon(categoryName);

                const displayColor = [
                  "#7EC89A",
                  "#5FB57A",
                  "#9DD9B3",
                  "#BCF0CC",
                ][index % 4];

                // Format deals count (default to 0 since we don't have count in Category model)
                const displayCount = isRTL ? "0 عروض" : "0 deals";

                // Determine the link URL - use slug if available, otherwise use id
                const slug = isRTL
                  ? category.slug_ar || category.slug_en
                  : category.slug_en || category.slug_ar;
                const categoryUrl = `/category/${slug || category.id}`;

                return (
                  <button
                    key={category.id}
                    onClick={() => navigate(categoryUrl)}
                    className="group bg-white rounded-xl p-6 border-2 border-[#111827] shadow-[3px_3px_0px_0px_rgba(17,24,39,1)] hover:shadow-[1px_1px_0px_0px_rgba(17,24,39,1)] transition-all text-center w-[160px] md:w-[180px] cursor-pointer"
                  >
                    <div
                      className="inline-flex h-16 w-16 items-center justify-center rounded-full mb-4 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: displayColor }}
                    >
                      <Icon className="h-8 w-8 text-[#111827]" />
                    </div>
                    <div
                      style={{ fontSize: "18px", fontWeight: 600 }}
                      className="text-[#111827] mb-1"
                    >
                      {categoryName}
                    </div>
                    <div className="text-sm text-[#6B7280]">{displayCount}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
    </section>
  );
}
