import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ExternalLink, Share2, Film } from "lucide-react";
import { Link } from "react-router-dom";

const celebritiesData = [
  {
    id: "c1",
    name: "Prabhas",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    role: "Actor",
    industry: "Tollywood",
  },
  {
    id: "c2",
    name: "Deepika Padukone",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    role: "Actress",
    industry: "Bollywood",
  },
  {
    id: "c3",
    name: "Shah Rukh Khan",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    role: "Actor",
    industry: "Bollywood",
  },
  {
    id: "c4",
    name: "Alia Bhatt",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    role: "Actress",
    industry: "Bollywood",
  },
  {
    id: "c5",
    name: "Jr NTR",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    role: "Actor",
    industry: "Tollywood",
  },
  {
    id: "c6",
    name: "Samantha Ruth Prabhu",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    role: "Actress",
    industry: "Tollywood",
  },
  {
    id: "c7",
    name: "Vijay",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    role: "Actor",
    industry: "Kollywood",
  },
  {
    id: "c8",
    name: "Rashmika Mandanna",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    role: "Actress",
    industry: "Pan India",
  },
  {
    id: "c9",
    name: "Allu Arjun",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    role: "Actor",
    industry: "Tollywood",
  },
  {
    id: "c10",
    name: "Kiara Advani",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    role: "Actress",
    industry: "Bollywood",
  },
  {
    id: "c11",
    name: "Ram Charan",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    role: "Actor",
    industry: "Tollywood",
  },
  {
    id: "c12",
    name: "Pooja Hegde",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    role: "Actress",
    industry: "Pan India",
  },
  {
    id: "c13",
    name: "Rajinikanth",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    role: "Actor",
    industry: "Kollywood",
  },
  {
    id: "c14",
    name: "Kamal Haasan",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    role: "Actor",
    industry: "Kollywood",
  },
  {
    id: "c15",
    name: "Priyanka Chopra",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    role: "Actress",
    industry: "Hollywood",
  },
  {
    id: "c16",
    name: "Mahesh Babu",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    role: "Actor",
    industry: "Tollywood",
  },
];

export default function Celebrities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCelebs, setVisibleCelebs] = useState(16);

  const filteredCelebrities = celebritiesData.filter(celeb =>
    celeb.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Celebrity Profiles"
            subtitle="Discover your favorite stars"
          />

          {/* Search */}
          <div className="max-w-md mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search celebrities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Celebrities Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6">
            {filteredCelebrities.slice(0, visibleCelebs).map((celebrity, index) => (
              <div 
                key={celebrity.id}
                className="group text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link to={`/celebrity/${celebrity.id}`}>
                  <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 border-border group-hover:border-gold transition-all duration-300 mx-auto max-w-[150px] hover-lift">
                    <img
                      src={celebrity.image}
                      alt={celebrity.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                      <span className="text-gold text-xs font-medium">View More</span>
                    </div>
                  </div>
                </Link>
                
                <div className="mt-3 space-y-1">
                  <h3 className="font-display text-base text-foreground group-hover:text-gold transition-colors line-clamp-1">
                    {celebrity.name}
                  </h3>
                  <p className="text-muted-foreground text-xs">{celebrity.role}</p>
                  <p className="text-gold/70 text-xs">{celebrity.industry}</p>
                </div>
              </div>
            ))}
          </div>

          {visibleCelebs < filteredCelebrities.length && (
            <div className="flex justify-center mt-8">
              <Button 
                variant="cinema" 
                size="lg"
                onClick={() => setVisibleCelebs(prev => prev + 16)}
                className="gap-2"
              >
                Load More
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
