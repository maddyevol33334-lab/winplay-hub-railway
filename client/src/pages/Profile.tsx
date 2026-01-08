import { useAuth } from "@/hooks/use-auth";
import { useGame } from "@/hooks/use-game";
import { Layout } from "@/components/Layout";
import { LogOut, Shield, Gamepad2, User as UserIcon } from "lucide-react";
import { Link } from "wouter";

export default function Profile() {
  const { user, logout } = useAuth();
  const { activities } = useGame();

  if (!user) return null;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col items-center py-6">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-4xl text-white font-bold shadow-lg mb-4">
            {user.username[0].toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-sm text-muted-foreground mt-1">Phone Number</p>
          <p className="text-muted-foreground text-sm mt-4">Joined {new Date(user.createdAt!).toLocaleDateString()}</p>
          
          {user.role === 'admin' && (
            <Link href="/admin">
              <button className="mt-4 px-4 py-2 bg-slate-800 text-white text-sm rounded-full flex items-center gap-2 hover:bg-slate-700 transition-colors">
                <Shield size={16} /> Admin Panel
              </button>
            </Link>
          )}
        </div>

        <div className="glass-card rounded-2xl overflow-hidden divide-y divide-border">
          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <UserIcon size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium">User ID</p>
              <p className="text-sm text-muted-foreground">#{user.id}</p>
            </div>
          </div>
          
          <div className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent">
              <Gamepad2 size={20} />
            </div>
            <div className="flex-1">
              <p className="font-medium">Total Games Played</p>
              <p className="text-sm text-muted-foreground">
                {activities?.filter(a => a.type.startsWith('game')).length || 0}
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => logout()}
          className="w-full py-4 rounded-2xl bg-red-50 text-red-600 font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
        >
          <LogOut size={20} /> Sign Out
        </button>
      </div>
    </Layout>
  );
}
