import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Auth from "@/pages/Auth";
import Home from "@/pages/Home";
import Games from "@/pages/Games";
import TapGame from "@/pages/games/TapGame";
import TriviaGame from "@/pages/games/TriviaGame";
import MemoryGame from "@/pages/games/MemoryGame";
import Wallet from "@/pages/Wallet";
import Profile from "@/pages/Profile";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component, adminOnly = false }: { component: React.ComponentType, adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <NotFound />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={Auth} />
      
      <Route path="/">
        <ProtectedRoute component={Home} />
      </Route>
      
      <Route path="/games">
        <ProtectedRoute component={Games} />
      </Route>
      <Route path="/games/tap">
        <ProtectedRoute component={TapGame} />
      </Route>
      <Route path="/games/trivia">
        <ProtectedRoute component={TriviaGame} />
      </Route>
      <Route path="/games/memory">
        <ProtectedRoute component={MemoryGame} />
      </Route>

      <Route path="/wallet">
        <ProtectedRoute component={Wallet} />
      </Route>
      
      <Route path="/profile">
        <ProtectedRoute component={Profile} />
      </Route>

      <Route path="/admin">
        <ProtectedRoute component={Admin} adminOnly />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
