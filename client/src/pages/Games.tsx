import { Layout } from "@/components/Layout";
import { Trophy, Star, Brain } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const games = [
  {
    id: "pro-quiz",
    title: "Pro Quiz",
    description: "10 Questions • 45s • High Reward",
    icon: Trophy,
    color: "from-red-500 to-orange-600",
    href: "/games/pro-quiz"
  },
  {
    id: "trivia",
    title: "Brain Trivia",
    description: "Test your knowledge",
    icon: Brain,
    color: "from-pink-500 to-rose-500",
    href: "/games/trivia"
  },
  {
    id: "memory",
    title: "Memory Match",
    description: "Find matching pairs",
    icon: Star,
    color: "from-amber-500 to-orange-500",
    href: "/games/memory"
  }
];

export default function Games() {
  return (
    <Layout>
      <div className="space-y-6 pb-8">
        <div>
          <h2 className="text-2xl font-bold">All Games</h2>
          <p className="text-muted-foreground">Choose a game and start earning</p>
        </div>

        <div className="grid gap-4">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={game.href}>
                <div className="glass-card p-4 rounded-2xl flex items-center gap-4 hover:translate-x-1 transition-transform cursor-pointer">
                  <div className={"w-16 h-16 bg-gradient-to-br " + game.color + " rounded-xl flex items-center justify-center text-white shadow-lg"}>
                    <game.icon />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{game.title}</h4>
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                  </div>
                  <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                    Play
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
