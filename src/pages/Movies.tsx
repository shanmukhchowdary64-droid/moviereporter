import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Star, ChevronDown, X, Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const industries = ["All", "Tollywood", "Bollywood", "Kollywood", "Hollywood", "Pan India", "Mollywood", "Sandalwood"];

const moviesData = [
  {
    id: "1",
    title: "Kalki 2898 AD",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80",
    rating: 4.5,
    userRating: 4.3,
    totalRatings: 15420,
    releaseDate: "June 27, 2024",
    industry: "Tollywood",
    description: "A mythological sci-fi film set in a dystopian future, blending ancient Hindu mythology with futuristic elements.",
    reviews: [
      { id: "r1", user: "MovieFan123", rating: 5, review: "Absolutely stunning visuals and storytelling!", date: "Jul 1, 2024" },
      { id: "r2", user: "CinemaLover", rating: 4, review: "Great movie, loved the concept.", date: "Jul 2, 2024" },
    ]
  },
  {
    id: "2",
    title: "Pushpa 2: The Rule",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80",
    rating: 4.8,
    userRating: 4.7,
    totalRatings: 25000,
    releaseDate: "Dec 6, 2024",
    industry: "Pan India",
    description: "The sequel to the blockbuster hit continues the story of Pushpa Raj.",
    reviews: []
  },
  {
    id: "3",
    title: "Stree 3",
    poster: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&q=80",
    rating: 4.2,
    userRating: 4.0,
    totalRatings: 12000,
    releaseDate: "Aug 15, 2024",
    industry: "Bollywood",
    description: "The horror-comedy franchise returns with more scares and laughs.",
    reviews: []
  },
  // Add more movies as needed
];

export default function Movies() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedMovie, setSelectedMovie] = useState<typeof moviesData[0] | null>(null);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [visibleMovies, setVisibleMovies] = useState(10);

  const filteredMovies = moviesData.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === "All" || movie.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const handleSubmitReview = () => {
    // In a real app, this would save to database
    console.log("Submitting review:", { movie: selectedMovie?.id, rating: userRating, review: userReview });
    setUserRating(0);
    setUserReview("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Movie Reviews & Ratings"
            subtitle="Rate and review your favorite movies"
          />

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-full md:w-[200px] bg-card border-border">
                <SelectValue placeholder="Select Industry" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredMovies.slice(0, visibleMovies).map((movie, index) => (
              <div
                key={movie.id}
                onClick={() => setSelectedMovie(movie)}
                className="group cursor-pointer animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden card-shine hover-lift">
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  
                  <div className="absolute inset-0 p-3 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="bg-gold/90 text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                        {movie.industry}
                      </span>
                      <div className="flex items-center gap-1 bg-card/90 backdrop-blur-sm text-gold text-sm font-semibold px-2 py-1 rounded">
                        <Star className="w-3 h-3 fill-gold" />
                        {movie.userRating}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display text-lg text-foreground group-hover:text-gold transition-colors line-clamp-2">
                        {movie.title}
                      </h3>
                      <p className="text-muted-foreground text-xs mt-1">
                        {movie.totalRatings.toLocaleString()} ratings
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {visibleMovies < filteredMovies.length && (
            <div className="flex justify-center mt-8">
              <Button 
                variant="cinema" 
                size="lg"
                onClick={() => setVisibleMovies(prev => prev + 10)}
                className="gap-2"
              >
                Load More
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Movie Detail Modal */}
      <Dialog open={!!selectedMovie} onOpenChange={() => setSelectedMovie(null)}>
        <DialogContent className="max-w-4xl bg-card border-border max-h-[90vh] overflow-y-auto">
          {selectedMovie && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-3xl text-gradient-gold">
                  {selectedMovie.title}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="aspect-[2/3] rounded-xl overflow-hidden">
                  <img
                    src={selectedMovie.poster}
                    alt={selectedMovie.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-lg">
                      <Star className="w-6 h-6 fill-gold" />
                      <span className="text-2xl font-bold">{selectedMovie.userRating}</span>
                      <span className="text-sm text-muted-foreground">/ 5</span>
                    </div>
                    <div className="text-muted-foreground">
                      {selectedMovie.totalRatings.toLocaleString()} ratings
                    </div>
                  </div>

                  <div>
                    <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                      {selectedMovie.industry}
                    </span>
                    <span className="text-muted-foreground ml-3">{selectedMovie.releaseDate}</span>
                  </div>

                  <p className="text-foreground/80">{selectedMovie.description}</p>

                  {/* Rating Section */}
                  <div className="bg-secondary/50 rounded-xl p-6 space-y-4">
                    <h4 className="font-display text-xl text-gold">Rate This Movie</h4>
                    
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setUserRating(star)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star 
                            className={cn(
                              "w-8 h-8 transition-colors",
                              (hoverRating || userRating) >= star 
                                ? "fill-gold text-gold" 
                                : "text-muted-foreground"
                            )}
                          />
                        </button>
                      ))}
                    </div>

                    <Textarea
                      placeholder="Write your review (optional)..."
                      value={userReview}
                      onChange={(e) => setUserReview(e.target.value)}
                      className="bg-card border-border"
                    />

                    <Button 
                      variant="gold" 
                      onClick={handleSubmitReview}
                      disabled={userRating === 0}
                    >
                      Submit Rating
                    </Button>
                  </div>

                  {/* Reviews */}
                  <div className="space-y-4">
                    <h4 className="font-display text-xl text-gold">User Reviews</h4>
                    
                    {selectedMovie.reviews.length === 0 ? (
                      <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
                    ) : (
                      selectedMovie.reviews.map((review) => (
                        <div key={review.id} className="bg-secondary/30 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{review.user}</span>
                              <div className="flex items-center gap-1 text-gold text-sm">
                                <Star className="w-4 h-4 fill-gold" />
                                {review.rating}
                              </div>
                            </div>
                            <span className="text-muted-foreground text-sm">{review.date}</span>
                          </div>
                          <p className="text-foreground/80">{review.review}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
