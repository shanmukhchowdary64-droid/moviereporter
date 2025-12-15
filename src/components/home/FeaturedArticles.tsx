import { useState } from "react";
import { ArticleCard } from "@/components/cards/ArticleCard";
import { SectionHeader } from "./SectionHeader";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const articles = [
  {
    id: "1",
    title: "Shah Rukh Khan Announces New Pan-India Project with SS Rajamouli",
    excerpt: "The King of Bollywood teams up with the legendary director for what promises to be the biggest Indian film ever made.",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
    author: "Rahul Sharma",
    date: "Dec 14, 2024",
    category: "Bollywood",
    type: "news" as const,
  },
  {
    id: "2",
    title: "Prabhas Signs Three More Films After Kalki Success",
    excerpt: "The pan-India superstar is in high demand after the massive success of Kalki 2898 AD.",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
    author: "Priya Singh",
    date: "Dec 13, 2024",
    category: "Tollywood",
    type: "news" as const,
  },
  {
    id: "3",
    title: "The Rise of Indian Cinema on Global Stage",
    excerpt: "How Indian films are breaking barriers and capturing international audiences like never before.",
    image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80",
    author: "Amit Kumar",
    date: "Dec 12, 2024",
    category: "Industry",
    type: "blog" as const,
  },
  {
    id: "4",
    title: "Oscar Buzz: Indian Films Making Waves at Academy",
    excerpt: "Several Indian films are generating significant Oscar buzz for the upcoming awards season.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
    author: "Sarah Johnson",
    date: "Dec 11, 2024",
    category: "Awards",
    type: "news" as const,
  },
];

export function FeaturedArticles() {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="py-16 bg-card/30">
      <div className="container mx-auto px-4">
        <SectionHeader 
          title="Featured Articles"
          subtitle="Stay updated with the latest news and insights"
          viewAllLink="/news"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article, index) => (
            <div 
              key={article.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ArticleCard {...article} />
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
              Load More Articles
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
