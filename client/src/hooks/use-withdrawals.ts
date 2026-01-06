import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type InsertWithdrawal } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useWithdrawals() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: withdrawals, isLoading } = useQuery({
    queryKey: [api.withdrawals.list.path],
    queryFn: async () => {
      const res = await fetch(api.withdrawals.list.path);
      if (!res.ok) throw new Error("Failed to fetch withdrawals");
      return api.withdrawals.list.responses[200].parse(await res.json());
    },
  });

  const createWithdrawalMutation = useMutation({
    mutationFn: async (data: Omit<InsertWithdrawal, "status" | "createdAt" | "userId" | "amountUsd">) => {
      // Note: Frontend sends minimal data, backend calculates USD and attaches userId
      // But we need to match the route input schema
      const res = await fetch(api.withdrawals.create.path, {
        method: api.withdrawals.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to request withdrawal");
      }
      return api.withdrawals.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.withdrawals.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] }); // Update balance
      toast({ title: "Success", description: "Withdrawal request submitted!" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    },
  });

  return {
    withdrawals,
    isLoading,
    createWithdrawal: createWithdrawalMutation.mutate,
    isCreating: createWithdrawalMutation.isPending,
  };
}
