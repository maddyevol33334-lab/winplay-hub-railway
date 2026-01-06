import { Layout } from "@/components/Layout";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Hand, HelpCircle, Grid3X3 } from "lucide-react";

const games = [
  {
    id: "tap",
    title: "Tap Master",
    description: "How fast can you tap in 10 seconds? Score > 20 to win!",
    icon: Hand,
    color: "from-purple-500 to-indigo-500",
    reward: 30,
  },
  {
    id: "trivia",
    title: "Trivia Quiz",
    description: "Answer 3 questions correctly. Get 2/3 right to win!",
    icon: HelpCircle,
    color: "from-pink-500 to-rose-500",
    reward: 30,
  },
  {
    id: "memory",
    title: "Memory Match",
    description: "Find all matching pairs in the grid to win!",
    icon: Grid3X3,
    color: "from-emerald-500 to-teal-500",
    reward: 30,
  },
];

export default function Games() {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="text-center py-6">
          <h1 className="text-3xl font-bold mb-2">Game Center</h1>
          <p className="text-muted-foreground">Play games and earn points</p>
        </div>

        <div className="grid gap-6">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/games/${game.id}`}>
                <div className="group relative overflow-hidden rounded-3xl bg-card shadow-lg hover:shadow-xl transition-all border border-border cursor-pointer">
                  <div className={`h-32 bg-gradient-to-r ${game.color} p-6 flex items-center justify-center relative overflow-hidden`}>
                    <game.icon className="w-16 h-16 text-white/90 relative z-10 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {/* Decorative circles */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-xl" />
                    <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-black/10 rounded-full blur-xl" />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">{game.title}</h3>
                      <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">
                        +{game.reward} pts
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {game.description}
                    </p>
                    <div className="mt-4 w-full py-3 bg-muted/30 text-center rounded-xl font-semibold text-sm group-hover:bg-primary group-hover:text-white transition-colors">
                      Play Now
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
