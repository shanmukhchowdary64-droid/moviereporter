import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/home/SectionHeader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Clock, Users, CheckCircle } from "lucide-react";

const pollsData = [
  {
    id: "p1",
    question: "Which movie are you most excited for in 2025?",
    options: [
      { id: "o1", text: "Spirit (Prabhas)", votes: 45000, image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=200&q=80" },
      { id: "o2", text: "War 2 (Hrithik)", votes: 38000, image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&q=80" },
      { id: "o3", text: "Coolie (Rajinikanth)", votes: 42000, image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=200&q=80" },
      { id: "o4", text: "NTR31", votes: 35000, image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=200&q=80" },
    ],
    totalVotes: 160000,
    endsAt: "2024-12-31",
    isActive: true,
  },
  {
    id: "p2",
    question: "Best Performance of 2024?",
    options: [
      { id: "o1", text: "Prabhas - Kalki", votes: 55000 },
      { id: "o2", text: "Allu Arjun - Pushpa 2", votes: 62000 },
      { id: "o3", text: "Rajinikanth - Vettaiyan", votes: 28000 },
      { id: "o4", text: "Sivakarthikeyan - Amaran", votes: 35000 },
    ],
    totalVotes: 180000,
    endsAt: "2024-12-25",
    isActive: true,
  },
  {
    id: "p3",
    question: "Favorite Director of 2024?",
    options: [
      { id: "o1", text: "SS Rajamouli", votes: 48000 },
      { id: "o2", text: "Sukumar", votes: 52000 },
      { id: "o3", text: "Nag Ashwin", votes: 45000 },
      { id: "o4", text: "Lokesh Kanagaraj", votes: 40000 },
    ],
    totalVotes: 185000,
    endsAt: "2024-12-20",
    isActive: true,
  },
];

export default function Polls() {
  const [votedPolls, setVotedPolls] = useState<Record<string, string>>({});

  const handleVote = (pollId: string, optionId: string) => {
    setVotedPolls(prev => ({ ...prev, [pollId]: optionId }));
  };

  const getPercentage = (votes: number, total: number) => {
    return Math.round((votes / total) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 md:pt-24 pb-16">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Live Polls"
            subtitle="Vote and see what others think"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pollsData.map((poll, index) => {
              const hasVoted = !!votedPolls[poll.id];
              const votedOption = votedPolls[poll.id];

              return (
                <div 
                  key={poll.id}
                  className="bg-card border border-border rounded-2xl p-6 animate-fade-in-up hover:border-gold/50 transition-all"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="font-display text-2xl text-foreground">
                      {poll.question}
                    </h3>
                    {poll.isActive && (
                      <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        Live
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {poll.options.map((option) => {
                      const percentage = getPercentage(option.votes, poll.totalVotes);
                      const isSelected = votedOption === option.id;

                      return (
                        <button
                          key={option.id}
                          onClick={() => !hasVoted && handleVote(poll.id, option.id)}
                          disabled={hasVoted}
                          className={cn(
                            "w-full p-4 rounded-xl border transition-all text-left relative overflow-hidden group",
                            hasVoted
                              ? "border-border cursor-default"
                              : "border-border hover:border-gold cursor-pointer",
                            isSelected && "border-gold bg-gold/10"
                          )}
                        >
                          {/* Progress background */}
                          {hasVoted && (
                            <div 
                              className="absolute inset-0 bg-gold/10 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          )}

                          <div className="relative flex items-center gap-4">
                            {option.image && (
                              <img 
                                src={option.image} 
                                alt={option.text}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className={cn(
                                  "font-medium",
                                  isSelected && "text-gold"
                                )}>
                                  {option.text}
                                </span>
                                {hasVoted && (
                                  <span className="text-gold font-bold">
                                    {percentage}%
                                  </span>
                                )}
                              </div>
                              {hasVoted && (
                                <div className="text-muted-foreground text-sm mt-1">
                                  {option.votes.toLocaleString()} votes
                                </div>
                              )}
                            </div>
                            {isSelected && (
                              <CheckCircle className="w-5 h-5 text-gold" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-border text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {poll.totalVotes.toLocaleString()} votes
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Ends {new Date(poll.endsAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
