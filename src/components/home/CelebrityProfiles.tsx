import { CelebrityCard } from "@/components/cards/CelebrityCard";
import { SectionHeader } from "./SectionHeader";

const celebrities = [
  {
    id: "c1",
    name: "Prabhas",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    role: "Actor",
  },
  {
    id: "c2",
    name: "Deepika Padukone",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    role: "Actress",
  },
  {
    id: "c3",
    name: "Shah Rukh Khan",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    role: "Actor",
  },
  {
    id: "c4",
    name: "Alia Bhatt",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    role: "Actress",
  },
  {
    id: "c5",
    name: "Jr NTR",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    role: "Actor",
  },
  {
    id: "c6",
    name: "Samantha Ruth Prabhu",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    role: "Actress",
  },
  {
    id: "c7",
    name: "Vijay",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    role: "Actor",
  },
  {
    id: "c8",
    name: "Rashmika Mandanna",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    role: "Actress",
  },
];

export function CelebrityProfiles() {
  return (
    <section className="py-16 bg-card/30">
      <div className="container mx-auto px-4">
        <SectionHeader 
          title="Celebrity Profiles"
          subtitle="Know more about your favorite stars"
          viewAllLink="/celebrities"
        />
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6">
          {celebrities.map((celebrity, index) => (
            <div 
              key={celebrity.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CelebrityCard {...celebrity} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
