import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NewsTicker } from "@/components/home/NewsTicker";
import { HeroBanner } from "@/components/home/HeroBanner";
import { SecondaryNav } from "@/components/home/SecondaryNav";
import { LatestMovies } from "@/components/home/LatestMovies";
import { FeaturedArticles } from "@/components/home/FeaturedArticles";
import { UpcomingReleases } from "@/components/home/UpcomingReleases";
import { WeeklyMagazine } from "@/components/home/WeeklyMagazine";
import { CelebrityProfiles } from "@/components/home/CelebrityProfiles";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16 md:pt-20">
        <NewsTicker />
        <HeroBanner />
        <SecondaryNav />
        <LatestMovies />
        <FeaturedArticles />
        <UpcomingReleases />
        <WeeklyMagazine />
        <CelebrityProfiles />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
