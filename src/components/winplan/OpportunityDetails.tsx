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
  Building2,
  User,
  PoundSterling,
  CalendarClock,
  Crown,
  UserCheck,
  ListTodo,
  Circle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Opportunity, OpportunityInteraction, OpportunityStakeholder, OpportunityActionStep } from "@/hooks/useWinPlanData";
import { format } from "date-fns";

interface OpportunityDetailsProps {
  opportunity: Opportunity | undefined;
  interactions: OpportunityInteraction[] | undefined;
  stakeholders: OpportunityStakeholder[] | undefined;
  actionSteps: OpportunityActionStep[] | undefined;
  isLoadingInteractions: boolean;
  isLoadingStakeholders: boolean;
  isLoadingActionSteps: boolean;
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

const formatCurrency = (value: number | null) => {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const ragStatusConfig = {
  red: { label: "Red", bgClass: "bg-red-100 dark:bg-red-950/50", textClass: "text-red-700 dark:text-red-400", dotClass: "bg-red-500" },
  amber: { label: "Amber", bgClass: "bg-amber-100 dark:bg-amber-950/50", textClass: "text-amber-700 dark:text-amber-400", dotClass: "bg-amber-500" },
  green: { label: "Green", bgClass: "bg-green-100 dark:bg-green-950/50", textClass: "text-green-700 dark:text-green-400", dotClass: "bg-green-500" },
};

export function OpportunityDetails({
  opportunity,
  interactions,
  stakeholders,
  actionSteps,
  isLoadingInteractions,
  isLoadingStakeholders,
  isLoadingActionSteps,
}: OpportunityDetailsProps) {
  if (!opportunity) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select an opportunity to view details
      </div>
    );
  }

  const totalValue = (opportunity.services_value || 0) + (opportunity.software_sales || 0);

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
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Building2 className="h-3 w-3" />
                Industry
              </div>
              <p className="font-medium text-sm">{opportunity.industry || "—"}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Crown className="h-3 w-3" />
                Exec Owner
              </div>
              <p className="font-medium text-sm">{opportunity.exec_owner || "—"}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <User className="h-3 w-3" />
                Opportunity Owner
              </div>
              <p className="font-medium text-sm">{opportunity.opportunity_owner || "—"}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <CalendarClock className="h-3 w-3" />
                Quarter to Close
              </div>
              <p className="font-medium text-sm">{opportunity.quarter_to_close || "—"}</p>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-900">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <PoundSterling className="h-3 w-3" />
                Services
              </div>
              <p className="font-semibold text-lg text-blue-700 dark:text-blue-400">
                {formatCurrency(opportunity.services_value)}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 border border-purple-200 dark:border-purple-900">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <PoundSterling className="h-3 w-3" />
                Software Sales
              </div>
              <p className="font-semibold text-lg text-purple-700 dark:text-purple-400">
                {formatCurrency(opportunity.software_sales)}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-green-200 dark:border-green-900">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <PoundSterling className="h-3 w-3" />
                Total Value
              </div>
              <p className="font-semibold text-lg text-green-700 dark:text-green-400">
                {formatCurrency(totalValue)}
              </p>
            </div>
          </div>

          <Separator />

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

      {/* Key Stakeholders & Decision Makers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Key Stakeholders & Decision Makers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingStakeholders ? (
            <Skeleton className="h-32 w-full" />
          ) : stakeholders && stakeholders.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Relationship Owner</TableHead>
                    <TableHead>Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stakeholders.map((stakeholder) => (
                    <TableRow key={stakeholder.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {stakeholder.name}
                          {stakeholder.is_decision_maker && (
                            <Badge variant="default" className="text-xs">
                              Decision Maker
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{stakeholder.role}</TableCell>
                      <TableCell>{stakeholder.relationship_owner || "—"}</TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                        {stakeholder.comments || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No stakeholders recorded yet
            </p>
          )}
        </CardContent>
      </Card>

      {/* Next Action Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            Next Action Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingActionSteps ? (
            <Skeleton className="h-32 w-full" />
          ) : actionSteps && actionSteps.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>RAG Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {actionSteps.map((step) => {
                    const ragConfig = ragStatusConfig[step.rag_status];
                    return (
                      <TableRow key={step.id} className={step.is_completed ? "opacity-60" : ""}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {step.is_completed ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className={step.is_completed ? "line-through" : ""}>
                              {step.action_description}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{step.owner}</TableCell>
                        <TableCell>
                          {step.due_date ? format(new Date(step.due_date), "MMM d, yyyy") : "—"}
                        </TableCell>
                        <TableCell>
                          <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${ragConfig.bgClass} ${ragConfig.textClass}`}>
                            <span className={`h-2 w-2 rounded-full ${ragConfig.dotClass}`} />
                            {ragConfig.label}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No action steps recorded yet
            </p>
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
