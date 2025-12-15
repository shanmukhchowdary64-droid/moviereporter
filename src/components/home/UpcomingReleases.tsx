import { useState } from "react";
import { MovieCard } from "@/components/cards/MovieCard";
import { SectionHeader } from "./SectionHeader";
import { Button } from "@/components/ui/button";
import { ChevronDown, Clock } from "lucide-react";

const upcomingMovies = [
  {
    id: "u1",
    title: "Spirit",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    releaseDate: "Jan 14, 2025",
    industry: "Bollywood",
    isUpcoming: true,
  },
  {
    id: "u2",
    title: "OG",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
    releaseDate: "Jan 26, 2025",
    industry: "Tollywood",
    isUpcoming: true,
  },
  {
    id: "u3",
    title: "Atlee's Next",
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80",
    releaseDate: "Mar 15, 2025",
    industry: "Pan India",
    isUpcoming: true,
  },
  {
    id: "u4",
    title: "NTR31",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&q=80",
    releaseDate: "Apr 10, 2025",
    industry: "Tollywood",
    isUpcoming: true,
  },
  {
    id: "u5",
    title: "Thangalaan 2",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80",
    releaseDate: "May 1, 2025",
    industry: "Kollywood",
    isUpcoming: true,
  },
  {
    id: "u6",
    title: "Salar 2: Shouryanga Parvam",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
    releaseDate: "Jun 20, 2025",
    industry: "Pan India",
    isUpcoming: true,
  },
  {
    id: "u7",
    title: "Coolie",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80",
    releaseDate: "Jul 10, 2025",
    industry: "Kollywood",
    isUpcoming: true,
  },
  {
    id: "u8",
    title: "War 2",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80",
    releaseDate: "Aug 15, 2025",
    industry: "Bollywood",
    isUpcoming: true,
  },
];

export function UpcomingReleases() {
  const [showMore, setShowMore] = useState(false);
  const displayedMovies = showMore ? upcomingMovies : upcomingMovies.slice(0, 8);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader 
          title="Upcoming Releases"
          subtitle="Mark your calendars for these highly anticipated films"
          viewAllLink="/upcoming-releases"
        />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayedMovies.map((movie, index) => (
            <div 
              key={movie.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <MovieCard {...movie} />
            </div>
          ))}
        </div>
        
        {!showMore && upcomingMovies.length > 8 && (
          <div className="flex justify-center mt-8">
            <Button 
              variant="cinema" 
              size="lg"
              onClick={() => setShowMore(true)}
              className="gap-2"
            >
              Load More
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
