import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useGame } from "@/hooks/use-game";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ArrowLeft, Timer, Zap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ALL_QUESTIONS = [
  { q: "Which programming language is known as the 'mother of all languages'?", options: ["C", "Fortran", "Assembly", "B"], answer: 0 },
  { q: "What does 'HTTP' stand for?", options: ["HyperText Transfer Protocol", "Hyperlink Text Transfer Package", "High Tension Transfer Protocol", "HyperText Technical Process"], answer: 0 },
  { q: "Which of these is NOT a NoSQL database?", options: ["MongoDB", "Redis", "PostgreSQL", "Cassandra"], answer: 2 },
  { q: "What is the time complexity of a binary search on a sorted array?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], answer: 1 },
  { q: "Who is considered the first computer programmer?", options: ["Alan Turing", "Ada Lovelace", "Grace Hopper", "Bill Gates"], answer: 1 },
  { q: "What year was the first iPhone released?", options: ["2005", "2006", "2007", "2008"], answer: 2 },
  { q: "Which company developed the React library?", options: ["Google", "Microsoft", "Meta", "Amazon"], answer: 2 },
  { q: "What is the main purpose of DNS?", options: ["Data Network Security", "Domain Name System", "Digital Network Service", "Dynamic Node Selection"], answer: 1 },
  { q: "In web development, what does 'CSS' stand for?", options: ["Creative Style Sheets", "Computer Style System", "Cascading Style Sheets", "Color Style Syntax"], answer: 2 },
  { q: "Which protocol is used for sending emails?", options: ["FTP", "SMTP", "HTTP", "SNMP"], answer: 1 },
  { q: "What is the largest unit of digital storage among these?", options: ["Terabyte", "Petabyte", "Gigabyte", "Exabyte"], answer: 3 },
  { q: "Which data structure follows the LIFO principle?", options: ["Queue", "Stack", "Linked List", "Tree"], answer: 1 },
  { q: "What does 'URL' stand for?", options: ["Uniform Resource Locator", "Universal Reference Link", "Unique Radio Line", "User Resource Level"], answer: 0 },
  { q: "Which of these is a front-end framework?", options: ["Express", "Django", "Vue", "Laravel"], answer: 2 },
  { q: "What is the default port for HTTP?", options: ["443", "21", "80", "8080"], answer: 2 }
];

const shuffle = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function ProQuiz() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const { earnPoints } = useGame();

  useEffect(() => {
    setQuestions(shuffle(ALL_QUESTIONS).slice(0, 10));
  }, []);

  useEffect(() => {
    if (showResult || timeLeft <= 0) {
       if (timeLeft <= 0 && !showResult) setShowResult(true);
       return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showResult]);

  const handleAnswer = (index: number) => {
    if (isAnswered || showResult) return;
    
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === questions[currentQ].answer;
    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      setScore(s => Math.max(0, s - 1));
      setStreak(0);
    }

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ(c => c + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        setShowResult(true);
        const finalScore = isCorrect ? score + 1 : score;
        if (finalScore >= 8) {
           earnPoints({ type: "game_trivia", score: finalScore });
        }
      }
    }, 1000);
  };

  if (questions.length === 0) return null;

  return (
    <Layout>
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/games">
              <Button size="icon" variant="ghost">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Pro Quiz</h1>
          </div>
          <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
            <Timer className={`w-4 h-4 ${timeLeft < 10 ? "text-red-500 animate-pulse" : "text-zinc-500"}`} />
            <span className={`font-mono font-bold ${timeLeft < 10 ? "text-red-500" : ""}`}>{timeLeft}s</span>
          </div>
        </div>

        {!showResult ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center px-1">
               <div className="flex gap-2">
                 {Array.from({length: 3}).map((_, i) => (
                   <Zap key={i} className={`w-5 h-5 ${streak > i ? "text-yellow-500 fill-yellow-500" : "text-zinc-200"}`} />
                 ))}
               </div>
               <span className="text-sm font-bold">Score: {score}</span>
            </div>

            <div className="space-y-2">
              <Progress value={((currentQ + 1) / questions.length) * 100} className="h-2" />
              <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold opacity-50">
                <span>Question {currentQ + 1}</span>
                <span>Hard Mode</span>
              </div>
            </div>

            <Card className="p-6 min-h-[160px] flex items-center justify-center text-center border-2 border-primary/10">
              <h2 className="text-xl font-bold leading-relaxed">
                {questions[currentQ].q}
              </h2>
            </Card>

            <div className="grid gap-3">
              {questions[currentQ].options.map((opt: string, i: number) => {
                let className = "justify-start text-left h-auto p-4 transition-all border-2";
                if (isAnswered) {
                  if (i === questions[currentQ].answer) className += " border-green-500 bg-green-50 text-green-700";
                  else if (i === selectedOption) className += " border-red-500 bg-red-50 text-red-700";
                  else className += " opacity-40";
                }
                return (
                  <Button key={i} variant="outline" disabled={isAnswered} onClick={() => handleAnswer(i)} className={className}>
                    <span className="mr-3 opacity-50 font-bold">{String.fromCharCode(65 + i)}</span>
                    <span className="flex-1">{opt}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-6 py-8">
            <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-full inline-block">
              <Trophy className="w-12 h-12 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Round Over</h2>
              <p className="text-muted-foreground font-medium">Final Score: {score}</p>
              <p className="text-sm">You answered {score} correctly</p>
            </div>
            <Card className="p-6 border-2 border-red-500/20">
               <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm">
                   <span>Points Earned</span>
                   <span className="font-bold text-green-600">+{score >= 8 ? 30 : 0} pts</span>
                 </div>
                 {score < 8 && <p className="text-xs text-red-500">Need 8/10 to unlock reward!</p>}
               </div>
            </Card>
            <Button className="w-full h-12 text-lg font-bold" onClick={() => window.location.reload()}>Play Again</Button>
            <Link href="/games" className="block text-sm font-medium text-muted-foreground hover:text-primary">Back to Games</Link>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
