import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useWithdrawals } from "@/hooks/use-withdrawals";
import { motion } from "framer-motion";
import { Loader2, ArrowUpRight, History } from "lucide-react";

export default function Wallet() {
  const { user } = useAuth();
  const { withdrawals, createWithdrawal, isCreating } = useWithdrawals();
  const [method, setMethod] = useState<'paypal' | 'upi' | 'bank'>('paypal');
  const [details, setDetails] = useState('');
  const [amount, setAmount] = useState(100);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createWithdrawal({
      method,
      details: JSON.stringify({ account: details }),
      amountPoints: Number(amount)
    });
    setDetails('');
    setAmount(100);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-display">Wallet</h1>
          <p className="text-muted-foreground">Manage your earnings</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-r from-secondary to-primary p-6 rounded-3xl text-white shadow-lg">
          <p className="opacity-80 font-medium">Available Balance</p>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-4xl font-bold">{user.points}</h2>
            <span className="text-sm opacity-80">pts</span>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
            <p className="text-sm font-medium">Estimated Value</p>
            <p className="text-xl font-bold">${(user.points * 1.5 / 1000).toFixed(2)}</p>
          </div>
        </div>

        {/* Withdraw Form */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5 text-primary" /> Request Withdrawal
          </h3>
          
          <form onSubmit={handleSubmit} className="glass-card p-6 rounded-2xl space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Method</label>
              <div className="flex gap-2">
                {(['paypal', 'upi', 'bank'] as const).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold capitalize transition-colors border-2 ${
                      method === m 
                        ? 'border-primary bg-primary/10 text-primary' 
                        : 'border-transparent bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {method === 'paypal' ? 'PayPal Email' : method === 'upi' ? 'UPI ID' : 'Bank Details'}
              </label>
              <input
                type="text"
                required
                value={details}
                onChange={e => setDetails(e.target.value)}
                className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="Enter account details"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Amount (Points)</label>
              <input
                type="number"
                min="100"
                max={user.points}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              />
              <p className="text-xs text-muted-foreground text-right">Min: 100 pts</p>
            </div>

            <button
              type="submit"
              disabled={isCreating || user.points < 100 || amount > user.points}
              className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Withdraw'}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-muted-foreground" /> Recent History
          </h3>
          
          <div className="space-y-3">
            {withdrawals?.length === 0 && (
              <p className="text-center text-muted-foreground py-4">No withdrawals yet.</p>
            )}
            
            {withdrawals?.map((w) => (
              <motion.div 
                key={w.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 rounded-xl flex justify-between items-center"
              >
                <div>
                  <div className="font-bold capitalize">{w.method}</div>
                  <div className="text-xs text-muted-foreground">{new Date(w.createdAt!).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{w.amountPoints} pts</div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    w.status === 'approved' ? 'bg-green-100 text-green-700' :
                    w.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {w.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
