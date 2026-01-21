import { useNavigate } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Opportunity } from "@/hooks/useWinPlanData";
import { OpportunityTimelineCard } from "@/components/opportunities/OpportunityTimelineCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface OpportunityListProps {
  opportunities: Opportunity[] | undefined;
  isLoading: boolean;
  selectedOpportunityId: string | null;
  onSelectOpportunity: (opportunityId: string) => void;
}

export function OpportunityList({
  opportunities,
  isLoading,
}: OpportunityListProps) {
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Update opportunity stage mutation with optimistic updates
  const updateStageMutation = useMutation({
    mutationFn: async ({ opportunityId, newStage }: { opportunityId: string; newStage: string }) => {
      const { error } = await supabase
        .from("opportunities")
        .update({ stage: newStage, updated_at: new Date().toISOString() })
        .eq("id", opportunityId);
      if (error) throw error;
    },
    onMutate: async ({ opportunityId, newStage }) => {
      setUpdatingId(opportunityId);
      
      // Find the customer_id from the opportunity being updated
      const opp = opportunities?.find(o => o.id === opportunityId);
      const customerId = opp?.customer_id;
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["opportunities", customerId] });
      
      // Snapshot the previous value
      const previousOpportunities = queryClient.getQueryData<Opportunity[]>(["opportunities", customerId]);
      
      // Optimistically update the cache in place (same order)
      queryClient.setQueryData<Opportunity[]>(["opportunities", customerId], (old) => {
        if (!old) return old;
        return old.map((opp) =>
          opp.id === opportunityId ? { ...opp, stage: newStage } : opp
        );
      });
      
      return { previousOpportunities, customerId };
    },
    onSuccess: () => {
      toast.success("Stage updated successfully");
    },
    onError: (error, _, context) => {
      // Rollback on error
      if (context?.previousOpportunities && context?.customerId) {
        queryClient.setQueryData(["opportunities", context.customerId], context.previousOpportunities);
      }
      console.error("Error updating stage:", error);
      toast.error("Failed to update stage");
    },
    onSettled: (_, __, ___, context) => {
      setUpdatingId(null);
      // Invalidate to ensure consistency
      if (context?.customerId) {
        queryClient.invalidateQueries({ queryKey: ["opportunities", context.customerId] });
      }
      queryClient.invalidateQueries({ queryKey: ["all-opportunities"] });
    },
  });

  const handleStageChange = (opportunityId: string, newStage: string) => {
    updateStageMutation.mutate({ opportunityId, newStage });
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (!opportunities?.length) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">No opportunities for this customer</p>
        <p className="text-sm">Add an opportunity to get started</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {opportunities.map((opp) => (
        <OpportunityTimelineCard
          key={opp.id}
          opportunity={{
            id: opp.id,
            opportunity_name: opp.opportunity_name,
            customer_id: opp.customer_id,
            stage: opp.stage,
            estimated_value: opp.estimated_value,
            probability: opp.probability,
            expected_close_date: opp.expected_close_date,
            status: opp.status,
            opportunity_owner: opp.opportunity_owner,
          }}
          customerName="" // Customer name not needed here as we're already in customer context
          onStageChange={handleStageChange}
          isUpdating={updatingId === opp.id}
        />
      ))}
    </div>
  );
}