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

const HomePageClient = () => {
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
      <FeaturedDeals />
      <CategoryGrid />
      <CommunityActivity />
      <PopularStores />
      <WhyDifferent />
      <Testimonials />
      <Newsletter />
    </>
  );
};

export default HomePageClient;
