import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Layout } from "@/components/Layout";
import { Loader2, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, register, isLoggingIn, isRegistering, user } = useAuth();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      login({ username, password });
    } else {
      register({ 
        username, 
        password,
        phoneNumber: "9" + Math.floor(100000000 + Math.random() * 900000000).toString(),
        deviceId: "web-client"
      });
    }
  };

  const isLoading = isLoggingIn || isRegistering;

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-2"
        >
          <div className="w-20 h-20 bg-gradient-to-tr from-primary to-accent rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-primary/20 mb-6">
            <Gamepad2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
            Win<span className="text-primary">Play</span>
          </h1>
          <p className="text-muted-foreground text-lg">Play games, earn real rewards.</p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-sm"
        >
          <div className="glass-card p-8 rounded-3xl space-y-6">
            <div className="flex p-1 bg-muted/50 rounded-xl mb-6">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  isLogin ? "bg-white text-primary shadow-sm" : "text-muted-foreground"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  !isLogin ? "bg-white text-primary shadow-sm" : "text-muted-foreground"
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  placeholder="Enter your username"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isLogin ? (
                  "Welcome Back"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
