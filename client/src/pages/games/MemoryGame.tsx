import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useGame } from "@/hooks/use-game";
import { motion } from "framer-motion";
import { Link } from "wouter";

const ICONS = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const { earnPoints } = useGame();

  useEffect(() => {
    // Init game
    const deck = [...ICONS, ...ICONS]
      .sort(() => Math.random() - 0.5)
      .map((icon, i) => ({ id: i, icon, isFlipped: false, isMatched: false }));
    setCards(deck);
  }, []);

  const handleCardClick = (id: number) => {
    if (flipped.length === 2) return;
    if (cards[id].isMatched || cards[id].isFlipped) return;

    // Flip card
    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);
    
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        // Match
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setCards(newCards);
        setFlipped([]);
        setMatchedCount(c => c + 1);
        
        if (matchedCount + 1 === ICONS.length) {
          setTimeout(() => {
            setGameWon(true);
            earnPoints({ type: "game_memory" });
          }, 500);
        }
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlipped([]);
        }, 1000);
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-display">Memory Match</h1>
          <p className="text-muted-foreground">Find all pairs to win!</p>
        </div>

        {!gameWon ? (
          <div className="grid grid-cols-4 gap-3 w-full max-w-sm aspect-square">
            {cards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleCardClick(i)}
                className="relative cursor-pointer h-full"
                style={{ perspective: 1000 }}
              >
                {/* Front (Hidden) */}
                <div 
                  className="absolute inset-0 bg-primary/10 border-2 border-primary/20 rounded-xl flex items-center justify-center text-2xl font-bold text-primary"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
                >
                  ?
                </div>
                {/* Back (Revealed) */}
                <div 
                  className={`absolute inset-0 rounded-xl flex items-center justify-center text-3xl shadow-md border-2 ${card.isMatched ? "bg-green-100 border-green-400" : "bg-white border-primary"}`}
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  {card.icon}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-card p-8 rounded-3xl shadow-xl border border-border text-center space-y-6"
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold">You Won!</h2>
            <div className="py-2 px-4 bg-green-100 text-green-700 rounded-lg font-bold">
              Reward Earned! +30 pts
            </div>
            <Link href="/games" className="block w-full">
              <button className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90">
                Back to Games
              </button>
            </Link>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
