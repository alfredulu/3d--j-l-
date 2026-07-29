import HeroSection from '@/components/hero/HeroSection';
import MarqueeBand from '@/components/sections/MarqueeBand';
import ScrollFilmSection from '@/components/sections/ScrollFilmSection';
import DishSection from '@/components/sections/DishSection';
import EditorialSection from '@/components/sections/EditorialSection';
import IngredientsSection from '@/components/sections/IngredientsSection';
import ManifestoSection from '@/components/sections/ManifestoSection';
import StorySection from '@/components/sections/StorySection';
import ReserveSection from '@/components/sections/ReserveSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <MarqueeBand />
      <ScrollFilmSection />
      <DishSection />
      <EditorialSection />
      <IngredientsSection />
      <ManifestoSection />
      <StorySection />
      <ReserveSection />
      <Footer />
    </main>
  );
}
