
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/use-auth";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Wallet from "@/pages/Wallet";
import Admin from "@/pages/Admin";
import Games from "@/pages/Games";
import ProQuiz from "@/pages/games/ProQuiz";
import MemoryGame from "@/pages/games/MemoryGame";
import TriviaGame from "@/pages/games/TriviaGame";
import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ path, component: Component }: { path: string; component: React.ComponentType<any> }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return <Route path={path} component={Component} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={Auth} />
      <ProtectedRoute path="/" component={Home} />
      <ProtectedRoute path="/games" component={Games} />
      <ProtectedRoute path="/games/pro-quiz" component={ProQuiz} />
      <ProtectedRoute path="/games/memory" component={MemoryGame} />
      <ProtectedRoute path="/games/trivia" component={TriviaGame} />
      <ProtectedRoute path="/wallet" component={Wallet} />
      <ProtectedRoute path="/profile" component={Profile} />
      <ProtectedRoute path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
