import { BottomNav } from "./BottomNav";
import { useAuth } from "@/hooks/use-auth";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="max-w-md mx-auto min-h-screen bg-background shadow-2xl shadow-black/5 overflow-hidden relative">
        {/* Decorative background blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[30%] bg-accent/20 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 p-4 md:p-6">
          {children}
        </div>
      </main>
      {user && <BottomNav />}
    </div>
  );
}
