import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Film, Users, Award, Newspaper, Star, Send } from "lucide-react";

const stats = [
  { icon: Film, label: "Movies Covered", value: "10,000+" },
  { icon: Users, label: "Active Users", value: "500K+" },
  { icon: Award, label: "Awards Tracked", value: "50+" },
  { icon: Newspaper, label: "Articles Published", value: "25,000+" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="font-display text-5xl md:text-7xl text-gradient-gold mb-6">
              About Movie Reporter
            </h1>
            <p className="text-xl text-muted-foreground">
              Your ultimate destination for movie reviews, celebrity news, and entertainment updates from around the world. We bring you the latest from Tollywood, Bollywood, Kollywood, Hollywood, and more.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className="bg-card border border-border rounded-2xl p-6 text-center hover:border-gold/50 transition-all animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <stat.icon className="w-8 h-8 text-gold mx-auto mb-4" />
                <div className="font-display text-3xl text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Mission */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h2 className="font-display text-4xl text-gradient-gold">Our Mission</h2>
              <p className="text-foreground/80 text-lg">
                At Movie Reporter, we believe in celebrating the magic of cinema. Our mission is to provide comprehensive, unbiased, and engaging coverage of the film industry across all languages and regions.
              </p>
              <p className="text-foreground/80 text-lg">
                We are dedicated to connecting movie lovers with the content they love, from breaking news and exclusive interviews to in-depth reviews and behind-the-scenes features.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-secondary rounded-lg px-4 py-2">
                  <Star className="w-4 h-4 text-gold inline mr-2" />
                  Unbiased Reviews
                </div>
                <div className="bg-secondary rounded-lg px-4 py-2">
                  <Star className="w-4 h-4 text-gold inline mr-2" />
                  Breaking News
                </div>
                <div className="bg-secondary rounded-lg px-4 py-2">
                  <Star className="w-4 h-4 text-gold inline mr-2" />
                  Exclusive Content
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80"
                alt="Cinema"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-2xl" />
            </div>
          </div>

          {/* Feedback Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="font-display text-3xl text-gradient-gold text-center mb-6">
                Send Us Feedback
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                We'd love to hear from you! Share your thoughts, suggestions, or report any issues.
              </p>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" placeholder="John Doe" className="bg-secondary border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" className="bg-secondary border-border" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What's this about?" className="bg-secondary border-border" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us what you think..." 
                    rows={5}
                    className="bg-secondary border-border"
                  />
                </div>

                <Button variant="gold" className="w-full" size="lg">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
