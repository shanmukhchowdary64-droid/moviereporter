import { Star, Calendar, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  id: string;
  title: string;
  poster: string;
  rating?: number;
  releaseDate: string;
  industry: string;
  isUpcoming?: boolean;
}

export function MovieCard({ id, title, poster, rating, releaseDate, industry, isUpcoming }: MovieCardProps) {
  return (
    <Link 
      to={`/movie/${id}`}
      className="group block"
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden card-shine hover-lift">
        <img
          src={poster}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        {/* Overlay content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
          {/* Top badges */}
          <div className="flex justify-between items-start">
            <span className="bg-gold/90 text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
              {industry}
            </span>
            {rating && (
              <div className="flex items-center gap-1 bg-card/90 backdrop-blur-sm text-gold text-sm font-semibold px-2 py-1 rounded">
                <Star className="w-3 h-3 fill-gold" />
                {rating}
              </div>
            )}
          </div>

          {/* Bottom content */}
          <div className="space-y-2">
            <h3 className="font-display text-xl text-foreground line-clamp-2 group-hover:text-gold transition-colors">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-foreground/70 text-sm">
              <Calendar className="w-4 h-4" />
              {releaseDate}
            </div>
            
            {/* Play button on hover */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2 text-gold text-sm font-medium">
                <Play className="w-4 h-4" />
                View Details
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming badge */}
        {isUpcoming && (
          <div className="absolute top-4 right-4">
            <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded animate-pulse">
              COMING SOON
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
