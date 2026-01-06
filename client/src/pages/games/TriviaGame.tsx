import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useGame } from "@/hooks/use-game";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Link } from "wouter";

const QUESTIONS = [
  {
    q: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    answer: 2
  },
  {
    q: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    answer: 1
  },
  {
    q: "What is 2 + 2 x 2?",
    options: ["6", "8", "4", "10"],
    answer: 0
  }
];

export default function TriviaGame() {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { earnPoints } = useGame();

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === QUESTIONS[currentQ].answer;
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (currentQ < QUESTIONS.length - 1) {
        setCurrentQ(c => c + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        const finalScore = isCorrect ? score + 1 : score;
        setShowResult(true);
        if (finalScore >= 2) {
          earnPoints({ type: "game_trivia", score: finalScore });
        }
      }
    }, 1500);
  };

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold font-display">Brain Trivia</h1>
          <p className="text-muted-foreground">Score 2/3 to win reward!</p>
        </div>

        {!showResult ? (
          <div className="w-full max-w-md space-y-6">
            <div className="flex justify-between text-sm font-medium text-muted-foreground">
              <span>Question {currentQ + 1}/{QUESTIONS.length}</span>
              <span>Score: {score}</span>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-lg min-h-[120px] flex items-center justify-center text-center">
              <h2 className="text-xl font-semibold">{QUESTIONS[currentQ].q}</h2>
            </div>

            <div className="space-y-3">
              {QUESTIONS[currentQ].options.map((opt, i) => {
                let statusClass = "bg-white border-border hover:border-primary/50";
                if (isAnswered) {
                  if (i === QUESTIONS[currentQ].answer) statusClass = "bg-green-100 border-green-500 text-green-700";
                  else if (i === selectedOption) statusClass = "bg-red-100 border-red-500 text-red-700";
                  else statusClass = "opacity-50";
                }

                return (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(i)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all flex justify-between items-center ${statusClass}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && i === QUESTIONS[currentQ].answer && <Check size={20} />}
                    {isAnswered && i === selectedOption && i !== QUESTIONS[currentQ].answer && <X size={20} />}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.9 }} 
            animate={{ scale: 1 }}
            className="w-full max-w-sm bg-card p-8 rounded-3xl shadow-xl border border-border text-center space-y-6"
          >
            <div className="space-y-2">
              <div className="text-5xl mb-4">{score >= 2 ? "🏆" : "📚"}</div>
              <h2 className="text-2xl font-bold">Game Over!</h2>
              <p className="text-muted-foreground">You scored {score} out of {QUESTIONS.length}</p>
            </div>
            
            {score >= 2 ? (
              <div className="py-2 px-4 bg-green-100 text-green-700 rounded-lg font-bold">
                Reward Earned! +30 pts
              </div>
            ) : (
              <div className="py-2 px-4 bg-orange-100 text-orange-700 rounded-lg font-bold">
                No reward. Try again!
              </div>
            )}

            <div className="flex gap-3">
              <Link href="/games" className="w-full">
                <button className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90">
                  Back to Games
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
