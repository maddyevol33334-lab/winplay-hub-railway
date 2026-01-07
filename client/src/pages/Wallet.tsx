
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { useWithdrawals } from "@/hooks/use-withdrawals";
import { motion } from "framer-motion";
import { Loader2, ArrowUpRight, History, Wallet as WalletIcon, CreditCard, Landmark, QrCode } from "lucide-react";
import { USD_TO_INR } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Wallet() {
  const { user } = useAuth();
  const { withdrawals, createWithdrawal, isCreating } = useWithdrawals();
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');
  const [method, setMethod] = useState<'paypal' | 'upi' | 'bank'>('paypal');
  const [details, setDetails] = useState('');
  const [amount, setAmount] = useState(100);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createWithdrawal({
      currency,
      method,
      details: JSON.stringify({ account: details }),
      amountPoints: Number(amount),
      amountUsd: (Number(amount) * 1.5 / 1000).toFixed(2),
      amountInr: (Number(amount) * 1.5 / 1000 * USD_TO_INR).toFixed(2)
    });
    setDetails('');
    setAmount(100);
  };

  const usdValue = (user.points * 1.5 / 1000).toFixed(2);
  const inrValue = (Number(usdValue) * USD_TO_INR).toFixed(2);

  return (
    <Layout>
      <div className="max-w-md mx-auto space-y-8 pb-20">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Wallet</h1>
            <p className="text-sm text-muted-foreground">Cash out your hard work</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-2xl">
            <WalletIcon className="w-6 h-6 text-primary" />
          </div>
        </header>

        {/* Balance Display */}
        <Card className="border-0 bg-primary text-primary-foreground shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <WalletIcon size={120} />
          </div>
          <CardHeader className="relative z-10 pb-2">
            <p className="text-sm font-medium opacity-80">Total Balance</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-5xl font-bold">{user.points}</h2>
              <span className="text-xl font-medium opacity-80">pts</span>
            </div>
          </CardHeader>
          <CardContent className="relative z-10 grid grid-cols-2 gap-4 mt-4 pt-6 border-t border-primary-foreground/10 bg-black/5">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">USD Equivalent</p>
              <p className="text-2xl font-bold">${usdValue}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold tracking-wider opacity-60">INR Equivalent</p>
              <p className="text-2xl font-bold">₹{inrValue}</p>
            </div>
          </CardContent>
        </Card>

        {/* Withdrawal Request */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Redeem Points</h3>
            <Badge variant="outline" className="text-[10px] px-2">Min. 100 pts</Badge>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Select Currency</Label>
              <Tabs value={currency} onValueChange={(val) => {
                setCurrency(val as 'USD' | 'INR');
                if (val === 'INR' && method === 'paypal') setMethod('upi');
                if (val === 'USD') setMethod('paypal');
              }}>
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="USD">Global (USD)</TabsTrigger>
                  <TabsTrigger value="INR">India (INR)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-3">
              <Label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Withdrawal Method</Label>
              <div className="grid grid-cols-2 gap-3">
                {currency === 'USD' ? (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="col-span-2 py-6 border-primary bg-primary/5 text-primary"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    PayPal
                  </Button>
                ) : (
                  <>
                    <Button 
                      type="button" 
                      variant={method === 'upi' ? 'default' : 'outline'}
                      className="py-6"
                      onClick={() => setMethod('upi')}
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      UPI
                    </Button>
                    <Button 
                      type="button" 
                      variant={method === 'bank' ? 'default' : 'outline'}
                      className="py-6"
                      onClick={() => setMethod('bank')}
                    >
                      <Landmark className="w-4 h-4 mr-2" />
                      Bank
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details" className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                {method === 'paypal' ? 'PayPal Email Address' : method === 'upi' ? 'UPI ID (example@okaxis)' : 'Bank Details (A/C No + IFSC Code)'}
              </Label>
              <Input
                id="details"
                required
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder={method === 'paypal' ? 'email@example.com' : method === 'upi' ? 'username@upi' : '0000 1111 2222, IFSC: SBIN00...'}
                className="py-6"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="amount" className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Amount in Points</Label>
                <span className="text-[10px] font-bold text-primary">Max: {user.points} pts</span>
              </div>
              <Input
                id="amount"
                type="number"
                min="100"
                max={user.points}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="py-6 font-bold text-lg"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full py-7 text-lg font-bold shadow-lg"
              disabled={isCreating || user.points < 100 || amount > user.points}
            >
              {isCreating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ArrowUpRight className="w-5 h-5 mr-2" />}
              Request Withdrawal
            </Button>
          </form>
        </div>

        {/* History */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-bold">Transaction History</h3>
          </div>
          
          <div className="grid gap-3">
            {withdrawals?.length === 0 && (
              <Card className="border-dashed border-2">
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>No transactions yet.</p>
                  <p className="text-xs">Your successful withdrawals will appear here.</p>
                </CardContent>
              </Card>
            )}
            
            {withdrawals?.map((w) => (
              <Card key={w.id} className="overflow-hidden border-0 bg-muted/30">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-xl">
                      {w.method === 'paypal' ? <CreditCard size={18} /> : w.method === 'upi' ? <QrCode size={18} /> : <Landmark size={18} />}
                    </div>
                    <div>
                      <p className="font-bold text-sm capitalize">{w.method}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(w.createdAt!).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{w.amountPoints} pts</p>
                    <p className="text-[10px] font-medium text-muted-foreground">
                      {w.currency === 'USD' ? `$${w.amountUsd}` : `₹${w.amountInr}`}
                    </p>
                    <Badge 
                      variant="secondary" 
                      className={`text-[9px] h-4 mt-1 uppercase font-black tracking-tighter ${
                        w.status === 'approved' ? 'bg-green-100 text-green-700' :
                        w.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {w.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
