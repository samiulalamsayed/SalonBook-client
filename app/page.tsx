import HeroSection from "@/components/home/HeroSection";
import FeaturedServices from "@/components/home/FeaturedServices";
import ServiceCategories from "@/components/home/ServiceCategories";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedServices />
      <ServiceCategories />
      <WhyChooseUs />
    </main>
  );
}