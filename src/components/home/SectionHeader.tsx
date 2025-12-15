import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
}

export function SectionHeader({ title, subtitle, viewAllLink, viewAllText = "View All" }: SectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <div>
        <h2 className="font-display text-4xl md:text-5xl text-gradient-gold">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground mt-2">{subtitle}</p>
        )}
      </div>
      {viewAllLink && (
        <Link to={viewAllLink}>
          <Button variant="gold-outline" className="gap-2">
            {viewAllText}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}
