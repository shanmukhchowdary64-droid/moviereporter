import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  category?: string;
  type: "news" | "blog";
}

export function ArticleCard({ id, title, excerpt, image, author, date, category, type }: ArticleCardProps) {
  return (
    <Link 
      to={`/${type}/${id}`}
      className="group block bg-card rounded-xl overflow-hidden border border-border hover:border-gold/50 transition-all hover-lift"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        {category && (
          <Badge className="absolute top-4 left-4 bg-gold text-primary-foreground">
            {category}
          </Badge>
        )}
      </div>
      
      <div className="p-5 space-y-3">
        <h3 className="font-display text-xl text-foreground group-hover:text-gold transition-colors line-clamp-2">
          {title}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-2">
          {excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {author}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {date}
            </div>
          </div>
          
          <span className="text-gold flex items-center gap-1 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Read more
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
