import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";

const blogsData = [
  {
    id: "b1",
    title: "The Rise of Indian Cinema on Global Stage",
    excerpt: "How Indian films are breaking barriers and capturing international audiences like never before.",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80",
    author: "Amit Kumar",
    date: "Dec 12, 2024",
  },
  {
    id: "b2",
    title: "Why Pan-India Films Are the Future of Indian Cinema",
    excerpt: "An analysis of how multi-lingual releases are reshaping the entertainment landscape.",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
    author: "Priya Singh",
    date: "Dec 10, 2024",
  },
  {
    id: "b3",
    title: "The Evolution of VFX in Indian Movies",
    excerpt: "From Mughal-e-Azam to Kalki 2898 AD - tracing the technological journey of Indian cinema.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
    author: "Rahul Tech",
    date: "Dec 8, 2024",
  },
  {
    id: "b4",
    title: "Method Acting: How Indian Actors Are Transforming",
    excerpt: "The dedication and transformation stories behind some of India's most iconic performances.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
    author: "Cinema Critic",
    date: "Dec 6, 2024",
  },
  {
    id: "b5",
    title: "The Impact of OTT Platforms on Traditional Cinema",
    excerpt: "How streaming services are changing the way we consume entertainment.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    author: "Digital Era",
    date: "Dec 4, 2024",
  },
  {
    id: "b6",
    title: "Behind the Scenes: Music Composition in Films",
    excerpt: "Exploring the art and science of creating memorable film scores and soundtracks.",
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&q=80",
    author: "Music Maestro",
    date: "Dec 2, 2024",
  },
];

export default function Blogs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleBlogs, setVisibleBlogs] = useState(6);

  const filteredBlogs = blogsData.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Blogs"
            subtitle="In-depth articles and insights about the film industry"
          />

          {/* Search */}
          <div className="max-w-md mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
          </div>

          {/* Blogs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.slice(0, visibleBlogs).map((blog, index) => (
              <div 
                key={blog.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ArticleCard {...blog} type="blog" />
              </div>
            ))}
          </div>

          {visibleBlogs < filteredBlogs.length && (
            <div className="flex justify-center mt-8">
              <Button 
                variant="cinema" 
                size="lg"
                onClick={() => setVisibleBlogs(prev => prev + 6)}
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
