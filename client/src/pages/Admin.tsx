import { useAuth } from "@/hooks/use-auth";
import { useAdmin } from "@/hooks/use-admin";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CheckCircle, XCircle, Ban, Unlock } from "lucide-react";
import { useLocation } from "wouter";

export default function Admin() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { 
    users, withdrawals, isLoadingUsers, isLoadingWithdrawals,
    blockUser, updateWithdrawal 
  } = useAdmin();

  if (user && user.role !== 'admin') {
    setLocation("/");
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-display">Admin Panel</h1>
          <p className="text-muted-foreground">Manage users and payouts</p>
        </div>

        <Tabs defaultValue="withdrawals" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 p-1 bg-muted/50 rounded-xl">
            <TabsTrigger value="withdrawals" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Withdrawals</TabsTrigger>
            <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="withdrawals" className="space-y-4">
            {isLoadingWithdrawals ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
            ) : withdrawals?.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No pending withdrawals.</p>
            ) : (
              withdrawals?.map((w) => (
                <div key={w.id} className="bg-card p-4 rounded-xl border border-border shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold">ID: #{w.id} - {w.method.toUpperCase()}</div>
                      <div className="text-sm text-muted-foreground text-wrap break-all max-w-[200px]">
                        {(() => {
                          try {
                            const d = JSON.parse(w.details);
                            return d.account;
                          } catch { return w.details; }
                        })()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{w.amountPoints} pts</div>
                      <div className="text-xs text-muted-foreground">{w.amountUsd}</div>
                    </div>
                  </div>
                  
                  {w.status === 'pending' && (
                    <div className="flex gap-2 pt-2 border-t border-border">
                      <button
                        onClick={() => updateWithdrawal({ id: w.id, status: 'approved' })}
                        className="flex-1 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-bold flex items-center justify-center gap-1 hover:bg-green-100"
                      >
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button
                        onClick={() => updateWithdrawal({ id: w.id, status: 'rejected' })}
                        className="flex-1 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-bold flex items-center justify-center gap-1 hover:bg-red-100"
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  )}
                  {w.status !== 'pending' && (
                    <div className={`text-center py-2 rounded-lg text-sm font-bold capitalize ${
                      w.status === 'approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {w.status}
                    </div>
                  )}
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            {isLoadingUsers ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
            ) : (
              users?.map((u) => (
                <div key={u.id} className="bg-card p-4 rounded-xl border border-border flex justify-between items-center">
                  <div>
                    <div className="font-bold">{u.username}</div>
                    <div className="text-sm text-muted-foreground">Points: {u.points}</div>
                  </div>
                  <button
                    onClick={() => blockUser({ id: u.id, isBlocked: !u.isBlocked })}
                    className={`p-2 rounded-lg transition-colors ${
                      u.isBlocked ? 'bg-red-100 text-red-600' : 'bg-muted text-muted-foreground hover:bg-red-100 hover:text-red-600'
                    }`}
                  >
                    {u.isBlocked ? <Unlock size={20} /> : <Ban size={20} />}
                  </button>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
