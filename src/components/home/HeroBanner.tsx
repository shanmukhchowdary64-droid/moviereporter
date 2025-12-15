import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Calendar, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const bannerItems = [
  {
    id: 1,
    title: "Kalki 2898 AD",
    subtitle: "The Epic Saga Continues",
    description: "A mythological sci-fi film set in a dystopian future, blending ancient Hindu mythology with futuristic elements.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80",
    rating: 4.5,
    category: "Tollywood",
    isPromotion: true,
  },
  {
    id: 2,
    title: "Pushpa 2: The Rule",
    subtitle: "The Rise of the Syndicate",
    description: "The sequel to the blockbuster hit continues the story of Pushpa Raj as he becomes the kingpin of red sandalwood smuggling.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&q=80",
    rating: 4.8,
    category: "Pan India",
    isPromotion: true,
  },
  {
    id: 3,
    title: "Stree 3",
    subtitle: "She's Back",
    description: "The horror-comedy franchise returns with more scares and laughs in this highly anticipated sequel.",
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=1920&q=80",
    rating: 4.2,
    category: "Bollywood",
    isPromotion: false,
  },
  {
    id: 4,
    title: "Avatar 3",
    subtitle: "Return to Pandora",
    description: "James Cameron's epic continuation of the Avatar saga takes us deeper into the world of Pandora.",
    image: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1920&q=80",
    rating: 4.7,
    category: "Hollywood",
    isPromotion: false,
  },
  {
    id: 5,
    title: "RRR 2",
    subtitle: "The Legacy Continues",
    description: "The blockbuster sequel to the Oscar-winning RRR brings back the legendary friendship.",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=1920&q=80",
    rating: 4.6,
    category: "Tollywood",
    isPromotion: true,
  },
  {
    id: 6,
    title: "Vikram 2",
    subtitle: "Rolex Returns",
    description: "Kamal Haasan returns as Vikram in this action-packed thriller from the Lokesh Cinematic Universe.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&q=80",
    rating: 4.4,
    category: "Kollywood",
    isPromotion: false,
  },
  {
    id: 7,
    title: "Salaar 2",
    subtitle: "The Reign Begins",
    description: "Prabhas returns in this action saga, continuing his journey as the ruthless leader.",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&q=80",
    rating: 4.3,
    category: "Pan India",
    isPromotion: true,
  },
];

export function HeroBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + bannerItems.length) % bannerItems.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % bannerItems.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentBanner = bannerItems[currentIndex];

  return (
    <section className="relative h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Background Images */}
      {bannerItems.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl space-y-6 animate-fade-in-up">
          {currentBanner.isPromotion && (
            <span className="inline-block bg-gold text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold animate-pulse-glow">
              🔥 PROMOTED
            </span>
          )}
          <span className="inline-block bg-secondary/80 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm ml-2">
            {currentBanner.category}
          </span>
          
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-foreground leading-none">
            {currentBanner.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-gold font-display tracking-wide">
            {currentBanner.subtitle}
          </p>
          
          <p className="text-foreground/80 text-lg max-w-xl">
            {currentBanner.description}
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gold">
              <Star className="w-5 h-5 fill-gold" />
              <span className="font-semibold">{currentBanner.rating}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="gold" size="lg" className="gap-2">
              <Play className="w-5 h-5" />
              Watch Trailer
            </Button>
            <Button variant="gold-outline" size="lg">
              View Details
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-gold hover:text-primary-foreground transition-all group"
      >
        <ChevronLeft className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-gold hover:text-primary-foreground transition-all group"
      >
        <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {bannerItems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              index === currentIndex 
                ? "bg-gold w-8" 
                : "bg-foreground/30 hover:bg-foreground/50"
            )}
          />
        ))}
      </div>
    </section>
  );
}
