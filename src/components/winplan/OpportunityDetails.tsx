import {
  Target,
  Lightbulb,
  AlertTriangle,
  Ban,
  MessageSquare,
  Presentation,
  Phone,
  Mail,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import type { Opportunity, OpportunityInteraction } from "@/hooks/useWinPlanData";
import { format } from "date-fns";

interface OpportunityDetailsProps {
  opportunity: Opportunity | undefined;
  interactions: OpportunityInteraction[] | undefined;
  isLoadingInteractions: boolean;
}

const interactionTypeIcons: Record<string, React.ReactNode> = {
  conversation: <MessageSquare className="h-4 w-4" />,
  presentation: <Presentation className="h-4 w-4" />,
  meeting: <Users className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  call: <Phone className="h-4 w-4" />,
};

const interactionTypeBadgeVariants: Record<string, "default" | "secondary" | "outline"> = {
  conversation: "secondary",
  presentation: "default",
  meeting: "default",
  email: "outline",
  call: "secondary",
};

export function OpportunityDetails({
  opportunity,
  interactions,
  isLoadingInteractions,
}: OpportunityDetailsProps) {
  if (!opportunity) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select an opportunity to view details
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Opportunity Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">{opportunity.opportunity_name}</CardTitle>
              <Badge variant="secondary" className="mt-1">
                {(opportunity.stage || "prospecting").replace("_", " ").toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Deal Summary */}
          {opportunity.deal_summary && (
            <div>
              <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Deal Summary
              </h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {opportunity.deal_summary}
              </p>
            </div>
          )}

          {/* Value Proposition */}
          {opportunity.value_proposition && (
            <div>
              <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Value Proposition
              </h4>
              <p className="text-sm text-muted-foreground bg-green-50 dark:bg-green-950/30 p-3 rounded-lg border border-green-200 dark:border-green-900">
                {opportunity.value_proposition}
              </p>
            </div>
          )}

          {/* Compelling Reasons */}
          {opportunity.compelling_reasons && (
            <div>
              <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                <ArrowRight className="h-4 w-4 text-blue-500" />
                Compelling Reasons to Act
              </h4>
              <p className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-900">
                {opportunity.compelling_reasons}
              </p>
            </div>
          )}

          <Separator />

          {/* Key Issues */}
          {opportunity.key_issues && (
            <div>
              <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Key Issues
              </h4>
              <p className="text-sm text-muted-foreground bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-900">
                {opportunity.key_issues}
              </p>
            </div>
          )}

          {/* Blockers */}
          {opportunity.blockers && (
            <div>
              <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                <Ban className="h-4 w-4 text-red-500" />
                Blockers
              </h4>
              <p className="text-sm text-muted-foreground bg-red-50 dark:bg-red-950/30 p-3 rounded-lg border border-red-200 dark:border-red-900">
                {opportunity.blockers}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interactions Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Interactions & Conversations
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingInteractions ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : interactions && interactions.length > 0 ? (
            <div className="relative space-y-4">
              {/* Timeline line */}
              <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-border" />

              {interactions.map((interaction, index) => (
                <div key={interaction.id} className="relative pl-10">
                  {/* Timeline dot */}
                  <div className="absolute left-2 top-2 h-5 w-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 hover:bg-muted transition-colors">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        {interactionTypeIcons[interaction.interaction_type] || interactionTypeIcons.conversation}
                        <Badge variant={interactionTypeBadgeVariants[interaction.interaction_type] || "secondary"}>
                          {interaction.interaction_type.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(interaction.interaction_date), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm mt-2 font-medium">{interaction.summary}</p>

                    {interaction.attendees && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {interaction.attendees}
                      </div>
                    )}

                    {interaction.presentation_shared && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs">
                        <Presentation className="h-3 w-3 text-primary" />
                        <span className="text-primary font-medium">
                          Shared: {interaction.presentation_shared}
                        </span>
                      </div>
                    )}

                    {interaction.outcome && (
                      <div className="mt-3 p-2 bg-background rounded border">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Outcome</p>
                        <p className="text-sm">{interaction.outcome}</p>
                      </div>
                    )}

                    {interaction.next_steps && (
                      <div className="mt-2 p-2 bg-primary/5 rounded border border-primary/20">
                        <p className="text-xs font-medium text-primary mb-1">Next Steps</p>
                        <p className="text-sm">{interaction.next_steps}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No interactions recorded yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
