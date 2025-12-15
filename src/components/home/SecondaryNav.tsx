import { Link } from "react-router-dom";
import { Film, Star, Calendar, Tv, Users, Newspaper, BookOpen, Trophy, Vote } from "lucide-react";

const quickLinks = [
  { label: "Movies", href: "/movies", icon: Film },
  { label: "Top Box Office", href: "/top-box-office", icon: Star },
  { label: "Upcoming", href: "/upcoming-releases", icon: Calendar },
  { label: "OTT Releases", href: "/ott-releases", icon: Tv },
  { label: "Celebrities", href: "/celebrities", icon: Users },
  { label: "News", href: "/news", icon: Newspaper },
  { label: "Blogs", href: "/blogs", icon: BookOpen },
  { label: "Vote Enroll", href: "/vote-enroll", icon: Vote },
  { label: "Awards", href: "/award-winners", icon: Trophy },
];

export function SecondaryNav() {
  return (
    <nav className="bg-card/50 backdrop-blur-sm border-y border-border sticky top-16 md:top-20 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground/70 hover:text-gold hover:bg-secondary/50 transition-all whitespace-nowrap"
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
