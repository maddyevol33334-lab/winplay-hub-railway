import { useAuth } from "@/hooks/use-auth";
import { useGame } from "@/hooks/use-game";
import { Layout } from "@/components/Layout";
import { Trophy, Play, Star, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const { earnPoints, isEarning } = useGame();
  const [adLoading, setAdLoading] = useState(false);

  const handleWatchAd = () => {
    setAdLoading(true);
    // Simulate 3s ad watch
    setTimeout(() => {
      earnPoints({ type: "ad_watch" });
      setAdLoading(false);
    }, 3000);
  };

  const handleDailyLogin = () => {
    earnPoints({ type: "daily_login" });
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="space-y-8 pb-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Hello, {user.username}!</h2>
            <p className="text-muted-foreground">Ready to win today?</p>
          </div>
          <Link href="/profile">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 text-primary font-bold cursor-pointer hover:bg-primary/20 transition-colors">
              {user.username[0].toUpperCase()}
            </div>
          </Link>
        </div>

        {/* Balance Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-gradient-to-br from-primary to-accent rounded-3xl p-8 text-white shadow-xl shadow-primary/25 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
          
          <div className="relative z-10">
            <p className="text-primary-foreground/80 font-medium mb-1">Total Balance</p>
            <h1 className="text-5xl font-display font-bold mb-2">{user.points}</h1>
            <p className="text-sm bg-white/20 inline-flex px-3 py-1 rounded-full backdrop-blur-sm">
              ≈ ${(user.points * 1.5 / 1000).toFixed(2)} USD
            </p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleWatchAd}
            disabled={adLoading || isEarning}
            className="glass-card p-6 rounded-2xl flex flex-col items-center gap-3 hover:border-primary/50 transition-all group relative overflow-hidden"
          >
            {adLoading && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-20">
                <div className="flex flex-col items-center text-white">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <span className="text-xs font-bold">Watching Ad...</span>
                </div>
              </div>
            )}
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
              <Play className="fill-current" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-foreground">Watch Ad</h3>
              <p className="text-xs text-muted-foreground">+50 Points</p>
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleDailyLogin}
            disabled={isEarning}
            className="glass-card p-6 rounded-2xl flex flex-col items-center gap-3 hover:border-primary/50 transition-all group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Calendar className="fill-current" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-foreground">Daily Login</h3>
              <p className="text-xs text-muted-foreground">+50 Points</p>
            </div>
          </motion.button>
        </div>

        {/* Featured Games */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Featured Games</h3>
            <Link href="/games" className="text-sm text-primary font-medium hover:underline">See All</Link>
          </div>

          <div className="space-y-4">
            <Link href="/games/pro-quiz">
              <div className="glass-card p-4 rounded-2xl flex items-center gap-4 hover:translate-x-1 transition-transform cursor-pointer mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Trophy />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg">Pro Quiz</h4>
                  <p className="text-sm text-muted-foreground">Hardcore trivia for big rewards!</p>
                </div>
                <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                  Play
                </div>
              </div>
            </Link>

            <Link href="/games/trivia">
              <div className="glass-card p-4 rounded-2xl flex items-center gap-4 hover:translate-x-1 transition-transform cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                  <Star />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg">Brain Trivia</h4>
                  <p className="text-sm text-muted-foreground">Test your knowledge</p>
                </div>
                <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                  Play
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
