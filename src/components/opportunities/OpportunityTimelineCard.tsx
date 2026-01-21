import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Target, 
  Building2, 
  DollarSign, 
  Calendar, 
  Presentation,
  Handshake,
  Quote,
  Trophy,
  XCircle,
  ChevronRight,
  Check
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Sales timeline stages - matching the Sales Timeline page
const timelineStages = [
  { id: "lead", dbStages: ["prospecting", "qualification"], title: "Lead/Plow", shortTitle: "Plow", icon: Target, color: "bg-blue-500" },
  { id: "solution_proposed", dbStages: ["proposal"], title: "Solution Proposed/SOW", shortTitle: "SOW", icon: Presentation, color: "bg-violet-500" },
  { id: "formal_approval", dbStages: ["negotiation"], title: "Formal Approval/Grow", shortTitle: "Grow", icon: Handshake, color: "bg-purple-500" },
  { id: "quotation", dbStages: ["closing"], title: "Quotation/Harvest", shortTitle: "Harvest", icon: Quote, color: "bg-orange-500" },
  { id: "won", dbStages: ["won"], title: "Won", shortTitle: "Won", icon: Trophy, color: "bg-emerald-500" },
  { id: "lost", dbStages: ["lost"], title: "Lost", shortTitle: "Lost", icon: XCircle, color: "bg-red-500" },
];

// Map timeline stage to db stage
const timelineToDbStage: Record<string, string> = {
  lead: "prospecting",
  solution_proposed: "proposal",
  formal_approval: "negotiation",
  quotation: "closing",
  won: "won",
  lost: "lost",
};

// Get current timeline stage from db stage
const getTimelineStageIndex = (dbStage: string | null): number => {
  const stage = dbStage || "prospecting";
  const index = timelineStages.findIndex(ts => ts.dbStages.includes(stage));
  return index >= 0 ? index : 0;
};

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

interface OpportunityTimelineCardProps {
  opportunity: Opportunity;
  customerName: string;
  onStageChange: (opportunityId: string, newStage: string) => void;
  isUpdating?: boolean;
}

const formatCurrency = (value: number | null | undefined) => {
  if (!value) return null;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function OpportunityTimelineCard({ 
  opportunity, 
  customerName, 
  onStageChange,
  isUpdating 
}: OpportunityTimelineCardProps) {
  const navigate = useNavigate();
  const currentStageIndex = getTimelineStageIndex(opportunity.stage);
  const isLost = opportunity.stage === "lost";
  const isWon = opportunity.stage === "won";

  const handleStageClick = (stageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newDbStage = timelineToDbStage[stageId];
    if (newDbStage && newDbStage !== opportunity.stage) {
      onStageChange(opportunity.id, newDbStage);
    }
  };

  const handleCardClick = () => {
    navigate(`/opportunities/${opportunity.id}`);
  };

  return (
    <Card 
      className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/30 animate-fade-in"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">{opportunity.opportunity_name}</h3>
              {opportunity.probability !== null && opportunity.probability !== undefined && (
                <Badge variant="outline" className="text-xs shrink-0">
                  {opportunity.probability}%
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {customerName}
              </span>
              {formatCurrency(opportunity.estimated_value) && (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <DollarSign className="h-3.5 w-3.5" />
                  {formatCurrency(opportunity.estimated_value)}
                </span>
              )}
              {opportunity.expected_close_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {format(new Date(opportunity.expected_close_date), "MMM d, yyyy")}
                </span>
              )}
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 ml-2" />
        </div>

        {/* Timeline Progress */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between relative">
            {/* Progress line background */}
            <div className="absolute top-4 left-4 right-4 h-1 bg-muted rounded-full" />
            
            {/* Progress line filled */}
            {!isLost && (
              <div 
                className={cn(
                  "absolute top-4 left-4 h-1 rounded-full transition-all duration-500",
                  isWon ? "bg-gradient-to-r from-blue-500 via-purple-500 via-orange-500 to-emerald-500" : "bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"
                )}
                style={{ 
                  width: `calc(${(currentStageIndex / (timelineStages.length - 2)) * 100}% - 2rem)`,
                  maxWidth: 'calc(100% - 2rem)'
                }}
              />
            )}

            {/* Stage markers - exclude Lost for normal flow */}
            <TooltipProvider delayDuration={0}>
              {timelineStages.slice(0, -1).map((stage, index) => {
                const Icon = stage.icon;
                const isPast = index < currentStageIndex && !isLost;
                const isCurrent = index === currentStageIndex && !isLost;
                const isFuture = index > currentStageIndex || isLost;
                
                return (
                  <Tooltip key={stage.id}>
                    <TooltipTrigger asChild>
                      <button
                        className={cn(
                          "relative z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200",
                          isPast && `${stage.color} text-white shadow-md`,
                          isCurrent && `${stage.color} text-white shadow-lg ring-2 ring-offset-2 ring-offset-background ring-primary scale-110`,
                          isFuture && "bg-muted text-muted-foreground hover:bg-muted/80",
                          !isUpdating && "hover:scale-110",
                          isUpdating && "opacity-50 cursor-wait"
                        )}
                        onClick={(e) => handleStageClick(stage.id, e)}
                        disabled={isUpdating}
                      >
                        {isPast ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      <p className="font-medium">{stage.title}</p>
                      <p className="text-muted-foreground">Click to set stage</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>

          {/* Stage labels */}
          <div className="flex items-center justify-between mt-2">
            {timelineStages.slice(0, -1).map((stage, index) => {
              const isCurrent = index === currentStageIndex && !isLost;
              return (
                <span 
                  key={stage.id} 
                  className={cn(
                    "text-[10px] text-center w-8 leading-tight",
                    isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                  )}
                >
                  {stage.shortTitle}
                </span>
              );
            })}
          </div>

          {/* Lost/Won indicator */}
          {(isLost || isWon) && (
            <div className={cn(
              "mt-3 flex items-center justify-center gap-2 py-1.5 px-3 rounded-full text-sm font-medium",
              isWon && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
              isLost && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}>
              {isWon ? <Trophy className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <span>{isWon ? "Deal Won" : "Deal Lost"}</span>
            </div>
          )}

          {/* Mark as Won/Lost buttons */}
          {!isWon && !isLost && (
            <div className="flex items-center justify-end gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={(e) => handleStageClick("lost", e)}
                disabled={isUpdating}
              >
                <XCircle className="h-3 w-3 mr-1" />
                Mark Lost
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                onClick={(e) => handleStageClick("won", e)}
                disabled={isUpdating}
              >
                <Trophy className="h-3 w-3 mr-1" />
                Mark Won
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
