import { Hero } from "../components/Hero";
import { CategoryGrid } from "../components/CategoryGrid";
import { FeaturedDeals } from "../components/FeaturedDeals";
import { PopularStores } from "../components/PopularStores";
import { Testimonials } from "../components/Testimonials";
import { Newsletter } from "../components/Newsletter";

export function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedDeals />
      <PopularStores />
      <Testimonials />
      <Newsletter />
    </>
  );
}
