import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useAdmin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: [api.admin.users.path],
    queryFn: async () => {
      const res = await fetch(api.admin.users.path);
      if (!res.ok) throw new Error("Failed to fetch users");
      return api.admin.users.responses[200].parse(await res.json());
    },
  });

  const { data: withdrawals, isLoading: isLoadingWithdrawals } = useQuery({
    queryKey: [api.admin.withdrawals.path],
    queryFn: async () => {
      const res = await fetch(api.admin.withdrawals.path);
      if (!res.ok) throw new Error("Failed to fetch withdrawals");
      return api.admin.withdrawals.responses[200].parse(await res.json());
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: async ({ id, isBlocked }: { id: number; isBlocked: boolean }) => {
      const url = buildUrl(api.admin.blockUser.path, { id });
      const res = await fetch(url, {
        method: api.admin.blockUser.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBlocked }),
      });
      if (!res.ok) throw new Error("Failed to update user status");
      return api.admin.blockUser.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.admin.users.path] });
      toast({ title: "Updated", description: "User status updated successfully" });
    },
  });

  const updateWithdrawalMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'approved' | 'rejected' }) => {
      const url = buildUrl(api.admin.approveWithdrawal.path, { id });
      const res = await fetch(url, {
        method: api.admin.approveWithdrawal.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update withdrawal");
      return api.admin.approveWithdrawal.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.admin.withdrawals.path] });
      toast({ title: "Processed", description: "Withdrawal processed successfully" });
    },
  });

  return {
    users,
    withdrawals,
    isLoadingUsers,
    isLoadingWithdrawals,
    blockUser: blockUserMutation.mutate,
    updateWithdrawal: updateWithdrawalMutation.mutate,
  };
}
