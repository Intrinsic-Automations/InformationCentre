import { useState, useMemo } from "react";
import { 
  TrendingUp,
  Search,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import winPlanHero from "@/assets/win-plan-hero.jpg";
import { useCustomers } from "@/hooks/useWinPlanData";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { OpportunityTimelineCard } from "@/components/opportunities/OpportunityTimelineCard";

interface Opportunity {
  id: string;
  opportunity_name: string;
  customer_id: string;
  stage: string | null;
  estimated_value: number | null;
  probability: number | null;
  expected_close_date: string | null;
  status: string | null;
  opportunity_owner: string | null;
}

const stageOptions = [
  { value: "all", label: "All Stages" },
  { value: "prospecting", label: "Lead/Plow" },
  { value: "proposal", label: "Solution Proposed" },
  { value: "negotiation", label: "Formal Approval" },
  { value: "closing", label: "Quotation" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
];

const Opportunities = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch all opportunities
  const { data: allOpportunities, isLoading: isLoadingOpportunities } = useQuery({
    queryKey: ["all-opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Opportunity[];
    },
  });

  // Fetch all customers for mapping
  const { data: customers, isLoading: isLoadingCustomers } = useCustomers();

  // Create a customer lookup map
  const customerMap = useMemo(() => {
    const map = new Map<string, string>();
    customers?.forEach((c) => {
      map.set(c.id, c.company_name);
    });
    return map;
  }, [customers]);

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
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["all-opportunities"] });
      
      // Snapshot the previous value
      const previousOpportunities = queryClient.getQueryData<Opportunity[]>(["all-opportunities"]);
      
      // Optimistically update the cache in place (same order)
      queryClient.setQueryData<Opportunity[]>(["all-opportunities"], (old) => {
        if (!old) return old;
        return old.map((opp) =>
          opp.id === opportunityId ? { ...opp, stage: newStage } : opp
        );
      });
      
      return { previousOpportunities };
    },
    onSuccess: () => {
      toast.success("Stage updated successfully");
    },
    onError: (error, _, context) => {
      // Rollback on error
      if (context?.previousOpportunities) {
        queryClient.setQueryData(["all-opportunities"], context.previousOpportunities);
      }
      console.error("Error updating stage:", error);
      toast.error("Failed to update stage");
    },
    onSettled: () => {
      setUpdatingId(null);
    },
  });

  const handleStageChange = (opportunityId: string, newStage: string) => {
    updateStageMutation.mutate({ opportunityId, newStage });
  };

  // Filter opportunities
  const filteredOpportunities = useMemo(() => {
    if (!allOpportunities) return [];
    
    return allOpportunities.filter((opp) => {
      const customerName = customerMap.get(opp.customer_id) || "";
      const matchesSearch = 
        opp.opportunity_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opp.opportunity_owner?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      
      const matchesStage = stageFilter === "all" || opp.stage === stageFilter;
      
      return matchesSearch && matchesStage;
    });
  }, [allOpportunities, searchQuery, stageFilter, customerMap]);

  const isLoading = isLoadingOpportunities || isLoadingCustomers;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={winPlanHero}
          alt="Opportunities banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Opportunities</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Header with search and filter */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Sales Pipeline
              </h2>
              <p className="text-sm text-muted-foreground">
                Track each opportunity through the sales timeline
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by stage" />
                </SelectTrigger>
                <SelectContent>
                  {stageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Opportunities List */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No opportunities found</p>
            <p className="text-sm">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityTimelineCard
                key={opportunity.id}
                opportunity={opportunity}
                customerName={customerMap.get(opportunity.customer_id) || "Unknown"}
                onStageChange={handleStageChange}
                isUpdating={updatingId === opportunity.id}
              />
            ))}
          </div>
        )}

        {/* Results count */}
        {!isLoading && filteredOpportunities.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Showing {filteredOpportunities.length} of {allOpportunities?.length || 0} opportunities
          </div>
        )}
      </div>
    </div>
  );
};

export default Opportunities;
