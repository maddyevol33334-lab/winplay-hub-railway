import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, type EarnPointsRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useGame() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const earnPointsMutation = useMutation({
    mutationFn: async (data: EarnPointsRequest) => {
      const res = await fetch(api.user.earn.path, {
        method: api.user.earn.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to earn points");
      }
      return api.user.earn.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.auth.me.path] });
      queryClient.invalidateQueries({ queryKey: [api.user.getActivities.path] });
      toast({
        title: "Points Earned!",
        description: `+${data.pointsAdded} points! New balance: ${data.newBalance}`,
        className: "bg-green-500 text-white border-none",
      });
    },
    onError: (error: Error) => {
      toast({ title: "Oops!", description: error.message, variant: "destructive" });
    },
  });

  const { data: activities, isLoading: isLoadingActivities } = useQuery({
    queryKey: [api.user.getActivities.path],
    queryFn: async () => {
      const res = await fetch(api.user.getActivities.path);
      if (!res.ok) throw new Error("Failed to fetch activities");
      return api.user.getActivities.responses[200].parse(await res.json());
    },
  });

  return {
    earnPoints: earnPointsMutation.mutate,
    isEarning: earnPointsMutation.isPending,
    activities,
    isLoadingActivities,
  };
}
