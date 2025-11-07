import { Hero } from "../components/Hero";
import { CategoryGrid } from "../components/CategoryGrid";
import { FeaturedDeals } from "../components/FeaturedDeals";
import { CommunityActivity } from "../components/CommunityActivity";
import { PopularStores } from "../components/PopularStores";
import { WhyDifferent } from "../components/WhyDifferent";
import { Testimonials } from "../components/Testimonials";
import { Newsletter } from "../components/Newsletter";

export function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedDeals />
      <CommunityActivity />
      <PopularStores />
      <WhyDifferent />
      <Testimonials />
      <Newsletter />
    </>
  );
}
