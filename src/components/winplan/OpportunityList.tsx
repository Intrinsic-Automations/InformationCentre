import { Target, DollarSign, Calendar, ChevronRight, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { Opportunity } from "@/hooks/useWinPlanData";
import { format } from "date-fns";

interface OpportunityListProps {
  opportunities: Opportunity[] | undefined;
  isLoading: boolean;
  selectedOpportunityId: string | null;
  onSelectOpportunity: (opportunityId: string) => void;
}

const stageColors: Record<string, string> = {
  prospecting: "bg-slate-500",
  qualification: "bg-blue-500",
  proposal: "bg-amber-500",
  negotiation: "bg-purple-500",
  closed_won: "bg-green-500",
  closed_lost: "bg-red-500",
};

const stageBadgeVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  prospecting: "secondary",
  qualification: "outline",
  proposal: "default",
  negotiation: "default",
  closed_won: "default",
  closed_lost: "destructive",
};

export function OpportunityList({
  opportunities,
  isLoading,
  selectedOpportunityId,
  onSelectOpportunity,
}: OpportunityListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!opportunities?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No opportunities for this customer
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {opportunities.map((opp) => (
        <Card
          key={opp.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedOpportunityId === opp.id
              ? "ring-2 ring-primary bg-primary/5"
              : "hover:bg-accent/50"
          }`}
          onClick={() => onSelectOpportunity(opp.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Target className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-foreground truncate">
                      {opp.opportunity_name}
                    </h3>
                    <Badge variant={stageBadgeVariants[opp.stage || "prospecting"]}>
                      {(opp.stage || "prospecting").replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  
                  {opp.deal_summary && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {opp.deal_summary}
                    </p>
                  )}

                  <div className="mt-3 flex items-center gap-4 flex-wrap text-sm">
                    {opp.estimated_value && (
                      <div className="flex items-center gap-1 text-green-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            minimumFractionDigits: 0,
                          }).format(opp.estimated_value)}
                        </span>
                      </div>
                    )}
                    {opp.expected_close_date && (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(opp.expected_close_date), "MMM d, yyyy")}</span>
                      </div>
                    )}
                    {opp.probability !== null && (
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <Progress value={opp.probability} className="w-16 h-2" />
                        <span className="text-xs text-muted-foreground">{opp.probability}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0 ml-2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
