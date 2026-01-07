
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useGame } from "@/hooks/use-game";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Trophy, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Helper to shuffle questions
const shuffle = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const ALL_QUESTIONS = [
  { q: "What is the capital of France?", options: ["London", "Berlin", "Paris", "Madrid"], answer: 2 },
  { q: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1 },
  { q: "What is 2 + 2 x 2?", options: ["6", "8", "4", "10"], answer: 0 },
  { q: "Which element has the chemical symbol 'O'?", options: ["Gold", "Oxygen", "Osmium", "Iron"], answer: 1 },
  { q: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3 },
  { q: "Who painted the Mona Lisa?", options: ["Picasso", "Van Gogh", "Da Vinci", "Dali"], answer: 2 },
  { q: "What is the currency of Japan?", options: ["Won", "Yuan", "Ringgit", "Yen"], answer: 3 },
  { q: "Which animal is the largest mammal?", options: ["Elephant", "Blue Whale", "Giraffe", "Shark"], answer: 1 },
  { q: "What is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Stone"], answer: 2 },
  { q: "How many colors are in a rainbow?", options: ["5", "6", "7", "8"], answer: 2 },
];

export default function TriviaGame() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { earnPoints, isEarning } = useGame();

  useEffect(() => {
    // Pick 5 random questions
    setQuestions(shuffle(ALL_QUESTIONS).slice(0, 5));
  }, []);

  const handleAnswer = (index: number) => {
    if (isAnswered || !questions[currentQ]) return;
    
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === questions[currentQ].answer;
    if (isCorrect) setScore(s => s + 1);

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(c => c + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        const finalScore = isCorrect ? score + 1 : score;
        setShowResult(true);
        if (finalScore >= 4) {
          earnPoints({ type: "game_trivia", score: finalScore });
        }
      }
    }, 1500);
  };

  if (questions.length === 0) return null;

  return (
    <Layout>
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/games">
            <Button size="icon" variant="ghost">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Hard Trivia</h1>
            <p className="text-sm text-muted-foreground">Work hard for points</p>
          </div>
        </div>

        {!showResult ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Progress</span>
                <span>{currentQ + 1} / {questions.length}</span>
              </div>
              <Progress value={((currentQ + 1) / questions.length) * 100} />
            </div>

            <Card className="p-6 min-h-[160px] flex items-center justify-center text-center">
              <h2 className="text-xl font-semibold leading-relaxed">
                {questions[currentQ].q}
              </h2>
            </Card>

            <div className="grid gap-3">
              {questions[currentQ].options.map((opt: string, i: number) => {
                let variant: "outline" | "default" | "secondary" = "outline";
                let className = "justify-start text-left h-auto p-4 transition-all";
                
                if (isAnswered) {
                  if (i === questions[currentQ].answer) {
                    className += " border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400";
                  } else if (i === selectedOption) {
                    className += " border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400";
                  } else {
                    className += " opacity-40";
                  }
                }

                return (
                  <Button
                    key={i}
                    variant={variant}
                    disabled={isAnswered}
                    onClick={() => handleAnswer(i)}
                    className={className}
                  >
                    <span className="mr-3 text-xs opacity-50">{String.fromCharCode(65 + i)}.</span>
                    <span className="flex-1">{opt}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8 py-8"
          >
            <div className="relative inline-block">
              <div className={`p-6 rounded-full ${score >= 4 ? 'bg-yellow-100' : 'bg-zinc-100'} inline-block`}>
                {score >= 4 ? <Trophy className="w-12 h-12 text-yellow-600" /> : <Brain className="w-12 h-12 text-zinc-400" />}
              </div>
              {score >= 4 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold p-1 rounded-full px-2"
                >
                  WINNER
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-bold">
                {score >= 4 ? "Excellent Job!" : "Keep Trying!"}
              </h2>
              <p className="text-muted-foreground">
                You scored {score} out of {questions.length}
              </p>
            </div>

            <Card className={`p-6 border-2 ${score >= 4 ? 'border-green-500/50 bg-green-50/50 dark:bg-green-950/10' : 'border-zinc-200 bg-zinc-50/50 dark:bg-zinc-950/10'}`}>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>Reward Requirement</span>
                  <span>4 / 5 Correct</span>
                </div>
                {score >= 4 ? (
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-bold">Reward Unlocked</span>
                    <span className="text-2xl font-bold text-green-600">+15 pts</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-zinc-500">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Hard work is needed for rewards</span>
                  </div>
                )}
              </div>
            </Card>

            <div className="flex gap-4">
              <Link href="/games" className="flex-1">
                <Button variant="outline" className="w-full">
                  More Games
                </Button>
              </Link>
              <Button 
                className="flex-1"
                onClick={() => {
                  setQuestions(shuffle(ALL_QUESTIONS).slice(0, 5));
                  setCurrentQ(0);
                  setScore(0);
                  setShowResult(false);
                  setSelectedOption(null);
                  setIsAnswered(false);
                }}
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
