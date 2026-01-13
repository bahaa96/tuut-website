"use client";
import { useEffect } from "react";
import { Hero } from "./Hero";
import { FeaturedDeals } from "./FeaturedDeals";
import { CategoryGrid } from "./CategoryGrid";
import { CommunityActivity } from "./CommunityActivity";
import { PopularStores } from "./PopularStores";
import { WhyDifferent } from "./WhyDifferent";
import { Testimonials } from "./Testimonials";
import { Newsletter } from "./Newsletter";
import { FeaturedProducts } from "./FeaturedProducts";
import { SpinToWin } from "./SpinToWin";
import { FAQ } from "./FAQ";
import { FeaturedDeal, Category, Store, Product, Deal } from "@/domain-models";

interface HomePageClientProps {
  initialFeaturedDeals: FeaturedDeal[];
  initialCategories: Category[];
  initialPopularStores: Store[];
  initialFeaturedProducts: Product[];
  initialWheelDeals?: Deal[];
}

const HomePageClient = ({
  initialFeaturedDeals,
  initialCategories,
  initialPopularStores,
  initialFeaturedProducts,
  initialWheelDeals,
}: HomePageClientProps) => {
  useEffect(() => {
    // Handle hash navigation on mount
    if (window.location.hash === "#featured-deals") {
      setTimeout(() => {
        const featuredDealsSection = document.getElementById("featured-deals");
        if (featuredDealsSection) {
          featuredDealsSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100); // Small delay to ensure the section has rendered
    }
  }, []);

  return (
    <>
      <Hero />
      <FeaturedDeals initialFeaturedDeals={initialFeaturedDeals} />
      <FeaturedProducts initialFeaturedProducts={initialFeaturedProducts} />
      <SpinToWin initialWheelDeals={initialWheelDeals} />
      <CategoryGrid initialCategories={initialCategories} />
      {/* <CommunityActivity /> */}
      <PopularStores initialPopularStores={initialPopularStores} />
      <WhyDifferent />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </>
  );
};

export default HomePageClient;
