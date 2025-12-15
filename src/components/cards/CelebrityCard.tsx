import { Link } from "react-router-dom";
import { User } from "lucide-react";

interface CelebrityCardProps {
  id: string;
  name: string;
  image: string;
  role: string;
}

export function CelebrityCard({ id, name, image, role }: CelebrityCardProps) {
  return (
    <Link 
      to={`/celebrity/${id}`}
      className="group block text-center"
    >
      <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 border-border group-hover:border-gold transition-all duration-300 mx-auto max-w-[180px] hover-lift">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
          <span className="text-gold text-sm font-medium">View Profile</span>
        </div>
      </div>
      
      <div className="mt-4 space-y-1">
        <h3 className="font-display text-lg text-foreground group-hover:text-gold transition-colors">
          {name}
        </h3>
        <p className="text-muted-foreground text-sm">{role}</p>
      </div>
    </Link>
  );
}
