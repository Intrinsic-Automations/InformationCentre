import { useState } from "react";
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
  Plus,
  Pencil,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Opportunity, OpportunityInteraction, OpportunityStakeholder, OpportunityActionStep } from "@/hooks/useWinPlanData";
import {
  useCreateStakeholder,
  useCreateActionStep,
  useUpdateActionStep,
  useCreateInteraction,
  useUpdateOpportunity,
} from "@/hooks/useWinPlanData";
import { OpportunityForm, OpportunityFormData } from "./OpportunityForm";
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

const interactionTypeOptions = [
  { value: "meeting", label: "Meeting" },
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "presentation", label: "Presentation" },
  { value: "conversation", label: "Conversation" },
];

const getInitialOpportunityFormData = (opp?: Opportunity): OpportunityFormData => ({
  opportunity_name: opp?.opportunity_name || "",
  deal_summary: opp?.deal_summary || "",
  value_proposition: opp?.value_proposition || "",
  compelling_reasons: opp?.compelling_reasons || "",
  key_issues: opp?.key_issues || "",
  blockers: opp?.blockers || "",
  estimated_value: opp?.estimated_value?.toString() || "",
  stage: opp?.stage || "prospecting",
  probability: opp?.probability?.toString() || "",
  expected_close_date: opp?.expected_close_date || "",
  industry: opp?.industry || "",
  exec_owner: opp?.exec_owner || "",
  opportunity_owner: opp?.opportunity_owner || "",
  quarter_to_close: opp?.quarter_to_close || "",
  services_value: opp?.services_value?.toString() || "",
  software_sales: opp?.software_sales?.toString() || "",
});

export function OpportunityDetails({
  opportunity,
  interactions,
  stakeholders,
  actionSteps,
  isLoadingInteractions,
  isLoadingStakeholders,
  isLoadingActionSteps,
}: OpportunityDetailsProps) {
  // Dialog states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddStakeholderOpen, setIsAddStakeholderOpen] = useState(false);
  const [isAddActionOpen, setIsAddActionOpen] = useState(false);
  const [isAddInteractionOpen, setIsAddInteractionOpen] = useState(false);

  // Form states
  const [editFormData, setEditFormData] = useState<OpportunityFormData>(getInitialOpportunityFormData());
  const [stakeholderForm, setStakeholderForm] = useState({
    name: "",
    role: "",
    relationship_owner: "",
    comments: "",
    is_decision_maker: false,
  });
  const [actionForm, setActionForm] = useState({
    action_description: "",
    owner: "",
    due_date: "",
    rag_status: "green" as "red" | "amber" | "green",
  });
  const [interactionForm, setInteractionForm] = useState({
    interaction_type: "meeting",
    interaction_date: new Date().toISOString().split("T")[0],
    summary: "",
    attendees: "",
    presentation_shared: "",
    outcome: "",
    next_steps: "",
  });

  // Mutations
  const updateOpportunity = useUpdateOpportunity();
  const createStakeholder = useCreateStakeholder();
  const createActionStep = useCreateActionStep();
  const updateActionStep = useUpdateActionStep();
  const createInteraction = useCreateInteraction();

  if (!opportunity) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select an opportunity to view details
      </div>
    );
  }

  const totalValue = (opportunity.services_value || 0) + (opportunity.software_sales || 0);

  const handleEditOpportunity = () => {
    updateOpportunity.mutate(
      {
        id: opportunity.id,
        opportunity_name: editFormData.opportunity_name,
        deal_summary: editFormData.deal_summary || null,
        value_proposition: editFormData.value_proposition || null,
        compelling_reasons: editFormData.compelling_reasons || null,
        key_issues: editFormData.key_issues || null,
        blockers: editFormData.blockers || null,
        estimated_value: editFormData.estimated_value ? parseFloat(editFormData.estimated_value) : null,
        stage: editFormData.stage || null,
        probability: editFormData.probability ? parseInt(editFormData.probability) : null,
        expected_close_date: editFormData.expected_close_date || null,
        industry: editFormData.industry || null,
        exec_owner: editFormData.exec_owner || null,
        opportunity_owner: editFormData.opportunity_owner || null,
        quarter_to_close: editFormData.quarter_to_close || null,
        services_value: editFormData.services_value ? parseFloat(editFormData.services_value) : null,
        software_sales: editFormData.software_sales ? parseFloat(editFormData.software_sales) : null,
      },
      {
        onSuccess: () => {
          setIsEditOpen(false);
        },
      }
    );
  };

  const handleAddStakeholder = () => {
    createStakeholder.mutate(
      {
        opportunity_id: opportunity.id,
        name: stakeholderForm.name,
        role: stakeholderForm.role,
        relationship_owner: stakeholderForm.relationship_owner || null,
        comments: stakeholderForm.comments || null,
        is_decision_maker: stakeholderForm.is_decision_maker,
      },
      {
        onSuccess: () => {
          setIsAddStakeholderOpen(false);
          setStakeholderForm({ name: "", role: "", relationship_owner: "", comments: "", is_decision_maker: false });
        },
      }
    );
  };

  const handleAddAction = () => {
    createActionStep.mutate(
      {
        opportunity_id: opportunity.id,
        action_description: actionForm.action_description,
        owner: actionForm.owner,
        due_date: actionForm.due_date || null,
        rag_status: actionForm.rag_status,
        is_completed: false,
      },
      {
        onSuccess: () => {
          setIsAddActionOpen(false);
          setActionForm({ action_description: "", owner: "", due_date: "", rag_status: "green" });
        },
      }
    );
  };

  const handleToggleComplete = (step: OpportunityActionStep) => {
    updateActionStep.mutate({
      id: step.id,
      opportunityId: opportunity.id,
      is_completed: !step.is_completed,
    });
  };

  const handleChangeRagStatus = (step: OpportunityActionStep, newStatus: "red" | "amber" | "green") => {
    updateActionStep.mutate({
      id: step.id,
      opportunityId: opportunity.id,
      rag_status: newStatus,
    });
  };

  const handleAddInteraction = () => {
    createInteraction.mutate(
      {
        opportunity_id: opportunity.id,
        interaction_type: interactionForm.interaction_type,
        interaction_date: interactionForm.interaction_date,
        summary: interactionForm.summary,
        attendees: interactionForm.attendees || null,
        presentation_shared: interactionForm.presentation_shared || null,
        outcome: interactionForm.outcome || null,
        next_steps: interactionForm.next_steps || null,
      },
      {
        onSuccess: () => {
          setIsAddInteractionOpen(false);
          setInteractionForm({
            interaction_type: "meeting",
            interaction_date: new Date().toISOString().split("T")[0],
            summary: "",
            attendees: "",
            presentation_shared: "",
            outcome: "",
            next_steps: "",
          });
        },
      }
    );
  };

  const openEditDialog = () => {
    setEditFormData(getInitialOpportunityFormData(opportunity));
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Opportunity Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
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
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2" onClick={openEditDialog}>
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Opportunity</DialogTitle>
                  <DialogDescription>Update opportunity information.</DialogDescription>
                </DialogHeader>
                <OpportunityForm
                  formData={editFormData}
                  onFormDataChange={setEditFormData}
                  onSubmit={handleEditOpportunity}
                  onCancel={() => setIsEditOpen(false)}
                  isSubmitting={updateOpportunity.isPending}
                  isEditMode
                />
              </DialogContent>
            </Dialog>
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Key Stakeholders & Decision Makers
            </CardTitle>
            <Dialog open={isAddStakeholderOpen} onOpenChange={setIsAddStakeholderOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Stakeholder
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Stakeholder</DialogTitle>
                  <DialogDescription>Add a new stakeholder for this opportunity.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="stakeholder_name">Name *</Label>
                      <Input
                        id="stakeholder_name"
                        value={stakeholderForm.name}
                        onChange={(e) => setStakeholderForm({ ...stakeholderForm, name: e.target.value })}
                        placeholder="Stakeholder name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stakeholder_role">Role *</Label>
                      <Input
                        id="stakeholder_role"
                        value={stakeholderForm.role}
                        onChange={(e) => setStakeholderForm({ ...stakeholderForm, role: e.target.value })}
                        placeholder="e.g., CTO, Project Manager"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="relationship_owner">Relationship Owner</Label>
                    <Input
                      id="relationship_owner"
                      value={stakeholderForm.relationship_owner}
                      onChange={(e) => setStakeholderForm({ ...stakeholderForm, relationship_owner: e.target.value })}
                      placeholder="Who owns this relationship?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stakeholder_comments">Comments</Label>
                    <Textarea
                      id="stakeholder_comments"
                      value={stakeholderForm.comments}
                      onChange={(e) => setStakeholderForm({ ...stakeholderForm, comments: e.target.value })}
                      placeholder="Any notes about this stakeholder..."
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_decision_maker"
                      checked={stakeholderForm.is_decision_maker}
                      onCheckedChange={(checked) => setStakeholderForm({ ...stakeholderForm, is_decision_maker: !!checked })}
                    />
                    <Label htmlFor="is_decision_maker" className="cursor-pointer">This person is a decision maker</Label>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setIsAddStakeholderOpen(false)}>Cancel</Button>
                    <Button
                      onClick={handleAddStakeholder}
                      disabled={!stakeholderForm.name || !stakeholderForm.role || createStakeholder.isPending}
                    >
                      {createStakeholder.isPending ? "Adding..." : "Add Stakeholder"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              Next Action Steps
            </CardTitle>
            <Dialog open={isAddActionOpen} onOpenChange={setIsAddActionOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Action
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Action Step</DialogTitle>
                  <DialogDescription>Add a new action step for this opportunity.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="action_description">Action Description *</Label>
                    <Textarea
                      id="action_description"
                      value={actionForm.action_description}
                      onChange={(e) => setActionForm({ ...actionForm, action_description: e.target.value })}
                      placeholder="What needs to be done?"
                      rows={2}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="action_owner">Owner *</Label>
                      <Input
                        id="action_owner"
                        value={actionForm.owner}
                        onChange={(e) => setActionForm({ ...actionForm, owner: e.target.value })}
                        placeholder="Who is responsible?"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="action_due_date">Due Date</Label>
                      <Input
                        id="action_due_date"
                        type="date"
                        value={actionForm.due_date}
                        onChange={(e) => setActionForm({ ...actionForm, due_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>RAG Status</Label>
                    <div className="flex gap-2">
                      {(["green", "amber", "red"] as const).map((status) => {
                        const config = ragStatusConfig[status];
                        return (
                          <Button
                            key={status}
                            type="button"
                            variant={actionForm.rag_status === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => setActionForm({ ...actionForm, rag_status: status })}
                            className="gap-2"
                          >
                            <span className={`h-2 w-2 rounded-full ${config.dotClass}`} />
                            {config.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setIsAddActionOpen(false)}>Cancel</Button>
                    <Button
                      onClick={handleAddAction}
                      disabled={!actionForm.action_description || !actionForm.owner || createActionStep.isPending}
                    >
                      {createActionStep.isPending ? "Adding..." : "Add Action"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingActionSteps ? (
            <Skeleton className="h-32 w-full" />
          ) : actionSteps && actionSteps.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Done</TableHead>
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
                        <TableCell>
                          <Checkbox
                            checked={step.is_completed}
                            onCheckedChange={() => handleToggleComplete(step)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          <span className={step.is_completed ? "line-through" : ""}>
                            {step.action_description}
                          </span>
                        </TableCell>
                        <TableCell>{step.owner}</TableCell>
                        <TableCell>
                          {step.due_date ? format(new Date(step.due_date), "MMM d, yyyy") : "—"}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={step.rag_status}
                            onValueChange={(value: "red" | "amber" | "green") => handleChangeRagStatus(step, value)}
                          >
                            <SelectTrigger className="w-28">
                              <div className={`inline-flex items-center gap-1.5 text-xs font-medium ${ragConfig.textClass}`}>
                                <span className={`h-2 w-2 rounded-full ${ragConfig.dotClass}`} />
                                {ragConfig.label}
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              {(["green", "amber", "red"] as const).map((status) => {
                                const config = ragStatusConfig[status];
                                return (
                                  <SelectItem key={status} value={status}>
                                    <div className="flex items-center gap-2">
                                      <span className={`h-2 w-2 rounded-full ${config.dotClass}`} />
                                      {config.label}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Interactions & Conversations
            </CardTitle>
            <Dialog open={isAddInteractionOpen} onOpenChange={setIsAddInteractionOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Interaction
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Add Interaction</DialogTitle>
                  <DialogDescription>Record a new interaction with the customer.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="interaction_type">Type *</Label>
                      <Select
                        value={interactionForm.interaction_type}
                        onValueChange={(value) => setInteractionForm({ ...interactionForm, interaction_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {interactionTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interaction_date">Date *</Label>
                      <Input
                        id="interaction_date"
                        type="date"
                        value={interactionForm.interaction_date}
                        onChange={(e) => setInteractionForm({ ...interactionForm, interaction_date: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="summary">Summary *</Label>
                    <Textarea
                      id="summary"
                      value={interactionForm.summary}
                      onChange={(e) => setInteractionForm({ ...interactionForm, summary: e.target.value })}
                      placeholder="Brief summary of the interaction..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="attendees">Attendees</Label>
                    <Input
                      id="attendees"
                      value={interactionForm.attendees}
                      onChange={(e) => setInteractionForm({ ...interactionForm, attendees: e.target.value })}
                      placeholder="Who attended?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="presentation_shared">Presentation/Material Shared</Label>
                    <Input
                      id="presentation_shared"
                      value={interactionForm.presentation_shared}
                      onChange={(e) => setInteractionForm({ ...interactionForm, presentation_shared: e.target.value })}
                      placeholder="Any materials shared?"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outcome">Outcome</Label>
                    <Textarea
                      id="outcome"
                      value={interactionForm.outcome}
                      onChange={(e) => setInteractionForm({ ...interactionForm, outcome: e.target.value })}
                      placeholder="What was the outcome?"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="next_steps">Next Steps</Label>
                    <Textarea
                      id="next_steps"
                      value={interactionForm.next_steps}
                      onChange={(e) => setInteractionForm({ ...interactionForm, next_steps: e.target.value })}
                      placeholder="What are the next steps?"
                      rows={2}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => setIsAddInteractionOpen(false)}>Cancel</Button>
                    <Button
                      onClick={handleAddInteraction}
                      disabled={!interactionForm.summary || !interactionForm.interaction_date || createInteraction.isPending}
                    >
                      {createInteraction.isPending ? "Adding..." : "Add Interaction"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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

              {interactions.map((interaction) => (
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
