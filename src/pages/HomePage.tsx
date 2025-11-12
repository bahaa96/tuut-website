import { Hero } from "../components/Hero";
import { FeaturedDeals } from "../components/FeaturedDeals";
import { CategoryGrid } from "../components/CategoryGrid";
import { CommunityActivity } from "../components/CommunityActivity";
import { PopularStores } from "../components/PopularStores";
import { WhyDifferent } from "../components/WhyDifferent";
import { Testimonials } from "../components/Testimonials";
import { Newsletter } from "../components/Newsletter";
import { useEffect } from "react";

export function HomePage() {
  useEffect(() => {
    // Handle hash navigation on mount
    if (window.location.hash === '#featured-deals') {
      setTimeout(() => {
        const featuredDealsSection = document.getElementById('featured-deals');
        if (featuredDealsSection) {
          featuredDealsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
}
