import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useGame } from "@/hooks/use-game";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw } from "lucide-react";
import { Link } from "wouter";

export default function TapGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const { earnPoints } = useGame();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else if (timeLeft === 0 && isPlaying) {
      endGame();
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const startGame = () => {
    setIsPlaying(true);
    setTimeLeft(10);
    setScore(0);
    setGameOver(false);
  };

  const handleTap = () => {
    if (isPlaying) {
      setScore((s) => s + 1);
    }
  };

  const endGame = () => {
    setIsPlaying(false);
    setGameOver(true);
    if (score >= 20) {
      earnPoints({ type: "game_tap", score });
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-display">Tap Master</h1>
          <p className="text-muted-foreground">Tap 20+ times in 10s to win!</p>
        </div>

        <div className="w-full max-w-xs aspect-square relative">
          {!isPlaying && !gameOver && (
            <button
              onClick={startGame}
              className="w-full h-full rounded-full bg-primary text-white text-2xl font-bold shadow-xl shadow-primary/30 flex flex-col items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-12 h-12" />
              START
            </button>
          )}

          {isPlaying && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleTap}
              className="w-full h-full rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white text-6xl font-black shadow-2xl shadow-orange-500/30 flex items-center justify-center border-8 border-white/20 select-none"
            >
              TAP!
            </motion.button>
          )}

          {gameOver && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full h-full rounded-3xl bg-card border border-border shadow-xl flex flex-col items-center justify-center gap-4 p-6 text-center"
            >
              <div>
                <h2 className="text-4xl font-bold mb-2">{score}</h2>
                <p className="text-muted-foreground">Taps</p>
              </div>
              
              <div className={`text-lg font-bold ${score >= 20 ? "text-green-500" : "text-red-500"}`}>
                {score >= 20 ? "YOU WON! 🎉" : "Try Again! 😅"}
              </div>

              <div className="flex gap-2 w-full">
                <button
                  onClick={startGame}
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} /> Retry
                </button>
                <Link href="/games" className="flex-1">
                  <button className="w-full py-3 rounded-xl bg-muted text-muted-foreground font-bold hover:bg-muted/80">
                    Exit
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>

        {isPlaying && (
          <div className="text-4xl font-mono font-bold text-primary">
            {timeLeft}s
          </div>
        )}
      </div>
    </Layout>
  );
}
