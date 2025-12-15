import { Zap } from "lucide-react";

const tickerItems = [
  "🎬 Breaking: New Marvel movie breaks box office records with $500M opening weekend",
  "⭐ Exclusive Interview: Shah Rukh Khan talks about his upcoming pan-India project",
  "🏆 Oscar Nominations 2024 announced - See the complete list",
  "🎭 Cannes Film Festival dates revealed for 2024",
  "📺 Netflix announces major expansion into Indian regional cinema",
  "🎪 Tollywood blockbuster crosses ₹1000 Cr worldwide",
];

export function NewsTicker() {
  const duplicatedItems = [...tickerItems, ...tickerItems];

  return (
    <div className="bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 border-y border-gold/30 py-3 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gold text-primary-foreground px-3 py-1 rounded-full font-semibold text-sm shrink-0">
            <Zap className="w-4 h-4" />
            LATEST
          </div>
          <div className="overflow-hidden flex-1">
            <div className="flex gap-8 news-ticker whitespace-nowrap">
              {duplicatedItems.map((item, index) => (
                <span 
                  key={index}
                  className="text-foreground/90 hover:text-gold cursor-pointer transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
