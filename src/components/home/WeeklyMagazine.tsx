import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const magazineArticles = [
  {
    id: "m1",
    title: "The Making of Kalki 2898 AD: Behind the Scenes",
    excerpt: "An exclusive look into the VFX, stunts, and creative process behind India's most ambitious sci-fi project.",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
    date: "Dec 8-15, 2024",
    featured: true,
  },
  {
    id: "m2",
    title: "2024's Box Office Winners: A Year in Review",
    excerpt: "From Kalki to Pushpa 2, we look back at the films that dominated the box office this year.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    date: "Dec 8-15, 2024",
    featured: false,
  },
];

export function WeeklyMagazine() {
  return (
    <section className="py-16 bg-gradient-to-b from-card/50 to-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-6 h-6 text-gold" />
              <span className="text-gold font-semibold text-sm uppercase tracking-wider">This Week's Edition</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-gradient-gold">
              Weekly Magazine
            </h2>
            <p className="text-muted-foreground mt-2">
              In-depth features and exclusive stories
            </p>
          </div>
          <Link to="/weekly-magazine">
            <Button variant="gold" className="gap-2">
              View All Editions
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {magazineArticles.map((article, index) => (
            <Link 
              key={article.id}
              to={`/magazine/${article.id}`}
              className="group relative overflow-hidden rounded-2xl animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="aspect-[16/10] md:aspect-[16/9]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              
              {article.featured && (
                <div className="absolute top-4 left-4">
                  <span className="bg-gold text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Featured
                  </span>
                </div>
              )}
              
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                <div className="flex items-center gap-2 text-foreground/70 text-sm">
                  <Calendar className="w-4 h-4" />
                  {article.date}
                </div>
                
                <h3 className="font-display text-2xl md:text-3xl text-foreground group-hover:text-gold transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-foreground/80 line-clamp-2">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center gap-2 text-gold font-medium pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read Article
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
