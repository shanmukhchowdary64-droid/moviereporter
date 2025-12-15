import { Link } from "react-router-dom";
import { Film, Facebook, Twitter, Instagram, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <Film className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display text-2xl text-gradient-gold tracking-wider">
                MOVIE REPORTER
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your ultimate destination for movie reviews, celebrity news, and entertainment updates from around the world.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="hover:text-gold">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-gold">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-gold">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-gold">
                <Youtube className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-xl mb-4 text-gold">Quick Links</h3>
            <ul className="space-y-2">
              {["Movies", "News", "Blogs", "Celebrities", "Polls"].map((link) => (
                <li key={link}>
                  <Link 
                    to={`/${link.toLowerCase()}`}
                    className="text-muted-foreground hover:text-gold transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Movies World */}
          <div>
            <h3 className="font-display text-xl mb-4 text-gold">Movies World</h3>
            <ul className="space-y-2">
              {[
                { label: "Top Box Office", href: "/top-box-office" },
                { label: "Upcoming Releases", href: "/upcoming-releases" },
                { label: "OTT Releases", href: "/ott-releases" },
                { label: "Weekly Magazine", href: "/weekly-magazine" },
                { label: "Award Winners", href: "/award-winners" },
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href}
                    className="text-muted-foreground hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display text-xl mb-4 text-gold">Stay Updated</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 h-10 px-4 bg-secondary border border-border rounded-lg focus:outline-none focus:border-gold text-foreground placeholder:text-muted-foreground text-sm"
              />
              <Button variant="gold" size="icon">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 Movie Reporter. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-gold">About</Link>
            <Link to="/copyright" className="hover:text-gold">Copyright Policy</Link>
            <Link to="/promotion" className="hover:text-gold">Advertise</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
