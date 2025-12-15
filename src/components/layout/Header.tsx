import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, Globe, ChevronDown, User, Film, Newspaper, Vote, Trophy, BookOpen, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { 
    label: "Movies World", 
    icon: Film,
    children: [
      { label: "Celebrity Profiles", href: "/celebrities" },
      { label: "Movies Info", href: "/movies-info" },
      { label: "Top Box Office", href: "/top-box-office" },
      { label: "Upcoming Releases", href: "/upcoming-releases" },
      { label: "OTT Releases", href: "/ott-releases" },
    ]
  },
  { label: "Movie Reviews", href: "/movies", icon: Film },
  { label: "News", href: "/news", icon: Newspaper },
  { label: "Blogs", href: "/blogs", icon: BookOpen },
  { label: "Polls", href: "/polls", icon: Vote },
  { label: "Weekly Magazine", href: "/weekly-magazine", icon: BookOpen },
  { 
    label: "Awards", 
    icon: Trophy,
    children: [
      { label: "Vote Enroll", href: "/vote-enroll" },
      { label: "Award Winners", href: "/award-winners" },
    ]
  },
  { 
    label: "About", 
    icon: Info,
    children: [
      { label: "About Us", href: "/about" },
      { label: "Help For Us", href: "/help" },
      { label: "Contact for Promotion", href: "/promotion" },
      { label: "Copyright Policy", href: "/copyright" },
    ]
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
              <Film className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-display text-2xl md:text-3xl text-gradient-gold tracking-wider">
              MOVIE REPORTER
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              item.children ? (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-1 text-foreground/80 hover:text-gold">
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-card border-border min-w-[200px]">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.href} asChild>
                        <Link 
                          to={child.href}
                          className={cn(
                            "cursor-pointer hover:text-gold",
                            location.pathname === child.href && "text-gold"
                          )}
                        >
                          {child.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link key={item.href} to={item.href!}>
                  <Button 
                    variant="ghost" 
                    className={cn(
                      "text-foreground/80 hover:text-gold",
                      location.pathname === item.href && "text-gold"
                    )}
                  >
                    {item.label}
                  </Button>
                </Link>
              )
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSearchOpen(!searchOpen)}>
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Globe className="w-5 h-5" />
            </Button>
            <Link to="/login">
              <Button variant="gold" size="sm" className="hidden md:flex">
                <User className="w-4 h-4" />
                Login
              </Button>
            </Link>
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="py-4 border-t border-border/50 animate-fade-in">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search movies, celebrities, news..."
                className="w-full h-12 pl-12 pr-4 bg-secondary border border-border rounded-xl focus:outline-none focus:border-gold text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-fade-in">
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {navItems.map((item) => (
              item.children ? (
                <div key={item.label} className="space-y-1">
                  <div className="px-4 py-2 text-sm font-semibold text-muted-foreground">
                    {item.label}
                  </div>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "block px-6 py-2 rounded-lg hover:bg-secondary",
                        location.pathname === child.href && "text-gold bg-secondary"
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.href}
                  to={item.href!}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-2 rounded-lg hover:bg-secondary",
                    location.pathname === item.href && "text-gold bg-secondary"
                  )}
                >
                  {item.label}
                </Link>
              )
            ))}
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="gold" className="w-full mt-4">
                <User className="w-4 h-4" />
                Login
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
