import { useState } from "react";
import { MovieCard } from "@/components/cards/MovieCard";
import { SectionHeader } from "./SectionHeader";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const movies = [
  {
    id: "1",
    title: "Kalki 2898 AD",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    rating: 4.5,
    releaseDate: "June 27, 2024",
    industry: "Tollywood",
  },
  {
    id: "2",
    title: "Pushpa 2: The Rule",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
    rating: 4.8,
    releaseDate: "Dec 6, 2024",
    industry: "Pan India",
  },
  {
    id: "3",
    title: "Stree 3",
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80",
    rating: 4.2,
    releaseDate: "Aug 15, 2024",
    industry: "Bollywood",
  },
  {
    id: "4",
    title: "Devara",
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&q=80",
    rating: 4.3,
    releaseDate: "Sep 27, 2024",
    industry: "Tollywood",
  },
  {
    id: "5",
    title: "The Greatest of All Time",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80",
    rating: 4.1,
    releaseDate: "Sep 5, 2024",
    industry: "Kollywood",
  },
  {
    id: "6",
    title: "Singham Again",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&q=80",
    rating: 4.0,
    releaseDate: "Nov 1, 2024",
    industry: "Bollywood",
  },
  {
    id: "7",
    title: "Vettaiyan",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80",
    rating: 3.9,
    releaseDate: "Oct 10, 2024",
    industry: "Kollywood",
  },
  {
    id: "8",
    title: "Amaran",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&q=80",
    rating: 4.6,
    releaseDate: "Oct 31, 2024",
    industry: "Kollywood",
  },
];

const moreMovies = [
  {
    id: "9",
    title: "Lucky Bhaskar",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    rating: 4.4,
    releaseDate: "Oct 31, 2024",
    industry: "Tollywood",
  },
  {
    id: "10",
    title: "Kanguva",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
    rating: 3.8,
    releaseDate: "Nov 14, 2024",
    industry: "Kollywood",
  },
];

export function LatestMovies() {
  const [showMore, setShowMore] = useState(false);
  const displayedMovies = showMore ? [...movies, ...moreMovies] : movies;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader 
          title="Latest Movies"
          subtitle="Recently released blockbusters from around the world"
          viewAllLink="/movies-info"
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
        
        {!showMore && (
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
