import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronDown } from "lucide-react";

const categories = ["All", "Tollywood", "Bollywood", "Kollywood", "Hollywood", "Pan India", "Sports", "Technology", "Politics"];

const newsData = [
  {
    id: "n1",
    title: "Shah Rukh Khan Announces New Pan-India Project with SS Rajamouli",
    excerpt: "The King of Bollywood teams up with the legendary director for what promises to be the biggest Indian film ever made.",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
    author: "Rahul Sharma",
    date: "Dec 14, 2024",
    category: "Bollywood",
  },
  {
    id: "n2",
    title: "Prabhas Signs Three More Films After Kalki Success",
    excerpt: "The pan-India superstar is in high demand after the massive success of Kalki 2898 AD.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
    author: "Priya Singh",
    date: "Dec 13, 2024",
    category: "Tollywood",
  },
  {
    id: "n3",
    title: "Oscar Buzz: Indian Films Making Waves at Academy",
    excerpt: "Several Indian films are generating significant Oscar buzz for the upcoming awards season.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
    author: "Sarah Johnson",
    date: "Dec 11, 2024",
    category: "Hollywood",
  },
  {
    id: "n4",
    title: "Vijay's Final Film Announcement Creates Social Media Frenzy",
    excerpt: "Thalapathy Vijay announces his last film before entering politics, breaking all pre-release records.",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80",
    author: "Kumar Raj",
    date: "Dec 10, 2024",
    category: "Kollywood",
  },
  {
    id: "n5",
    title: "Netflix Announces Major Expansion into Indian Regional Cinema",
    excerpt: "The streaming giant plans to invest $2 billion in Indian content over the next three years.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    author: "Amit Kumar",
    date: "Dec 9, 2024",
    category: "Technology",
  },
  {
    id: "n6",
    title: "Allu Arjun's Pushpa 2 Creates History at Box Office",
    excerpt: "The sequel breaks all records with unprecedented opening weekend collections.",
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&q=80",
    author: "Deepa Rao",
    date: "Dec 8, 2024",
    category: "Tollywood",
  },
];

export default function News() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleNews, setVisibleNews] = useState(6);

  const filteredNews = newsData.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Latest News"
            subtitle="Stay updated with the latest entertainment news"
          />

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px] bg-card border-border">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.slice(0, visibleNews).map((news, index) => (
              <div 
                key={news.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ArticleCard {...news} type="news" />
              </div>
            ))}
          </div>

          {visibleNews < filteredNews.length && (
            <div className="flex justify-center mt-8">
              <Button 
                variant="cinema" 
                size="lg"
                onClick={() => setVisibleNews(prev => prev + 6)}
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
