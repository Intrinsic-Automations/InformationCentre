import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Flag,
  ChevronDown,
  Target,
  Layers,
  Settings,
  Rocket,
  LogOut,
  FolderKanban,
  Package,
  AlertCircle,
  ClipboardCheck,
  ArrowLeft,
  FileText,
  Users,
  Plus,
  Trash2,
  MessageSquare,
  Pencil,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExecutionItemDetailDialog } from "@/components/project-execution/ExecutionItemDetailDialog";
import type { TimelineItem } from "@/components/project-execution/ExecutionTimelineData";
import { useLifecycleItems } from "@/hooks/useLifecycleItems";
import { useRoles } from "@/hooks/useRoles";
import { LifecycleItemFormDialog } from "./LifecycleItemFormDialog";
import { AddMeetingTaskDialog } from "./AddMeetingTaskDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const irgtItem: TimelineItem = {
  id: "irgt-review-process",
  title: "IRGT Review Process",
  description: "The Internal Review and Governance Team (IRGT) review process is a mandatory governance checkpoint that ensures all projects meet quality standards, compliance requirements, and organizational guidelines before proceeding.",
  isDeliverable: false,
  hasTemplate: true,
  responsibleRole: "IRGT Committee / Project Governance Board",
  inputs: ["Project One-Pager / Business Case", "Resource and Cost Estimates", "Risk Assessment Documentation", "Stakeholder Sign-off Forms", "High-Level Project Plan"],
  outputs: ["IRGT Approval Documentation", "Governance Sign-off Certificate", "Conditional Approval Notes (if applicable)", "Risk Mitigation Action Items"],
};

const phases = [
  { id: "discovery-plan", title: "Discovery / Plan", color: "bg-blue-500", gate: { title: "Gate 1 Review", description: "Review and approval checkpoint before proceeding to Prepare/Requirements phase." } },
  { id: "prepare-requirements", title: "Prepare / Requirements", color: "bg-violet-500", gate: { title: "Gate 2 Review", description: "Review and approval checkpoint before proceeding to Explore/Design phase." } },
  { id: "explore-design", title: "Explore / Design", color: "bg-purple-500", gate: { title: "Gate 3 Review", description: "Review and approval checkpoint before proceeding to Realise/Implementation phase." } },
  { id: "realise-implementation", title: "Realise / Implementation", color: "bg-orange-500", gate: { title: "Gate 4 Review", description: "Review and approval checkpoint before proceeding to Deploy/Exit phase." } },
  { id: "deploy-exit", title: "Deploy / Exit", color: "bg-emerald-500", gate: { title: "Gate 5 Review", description: "Final review and project closure approval." } },
];

const phaseIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "discovery-plan": Target,
  "prepare-requirements": Layers,
  "explore-design": Settings,
  "realise-implementation": Rocket,
  "deploy-exit": LogOut,
};

interface MethodPageProps {
  methodSlug: string;
  title: string;
  heroImage: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function MethodPage({ methodSlug, title, heroImage, icon: Icon }: MethodPageProps) {
  const navigate = useNavigate();
  const { isAdminOrModerator } = useRoles();
  const {
    items,
    meetingsTasks,
    isLoading,
    itemsByPhase,
    meetingTasksByPhase,
    addItem,
    updateItem,
    deleteItem,
    addMeetingTask,
    updateMeetingTask,
    deleteMeetingTask,
  } = useLifecycleItems(methodSlug);

  const [irgtDialogOpen, setIrgtDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedIsMeetingTask, setSelectedIsMeetingTask] = useState(false);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [activePhaseId, setActivePhaseId] = useState("");
  const [addMeetingDialogOpen, setAddMeetingDialogOpen] = useState(false);
  const [activeMeetingPhaseId, setActiveMeetingPhaseId] = useState("");
  const [editMeetingTask, setEditMeetingTask] = useState<any>(null);
  const [feedbackUrl, setFeedbackUrl] = useState("");
  const [feedbackEditOpen, setFeedbackEditOpen] = useState(false);
  const [feedbackEditUrl, setFeedbackEditUrl] = useState("");
  const { profile } = useAuth();

  useEffect(() => {
    const fetchFeedbackUrl = async () => {
      const { data } = await supabase
        .from("method_feedback_links")
        .select("feedback_url")
        .eq("method_slug", methodSlug)
        .maybeSingle();
      if (data?.feedback_url) setFeedbackUrl(data.feedback_url);
    };
    fetchFeedbackUrl();
  }, [methodSlug]);

  const saveFeedbackUrl = async () => {
    const { data: existing } = await supabase
      .from("method_feedback_links")
      .select("id")
      .eq("method_slug", methodSlug)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("method_feedback_links")
        .update({ feedback_url: feedbackEditUrl, updated_by: profile?.id })
        .eq("method_slug", methodSlug);
    } else {
      await supabase
        .from("method_feedback_links")
        .insert({ method_slug: methodSlug, feedback_url: feedbackEditUrl, updated_by: profile?.id });
    }
    setFeedbackUrl(feedbackEditUrl);
    setFeedbackEditOpen(false);
    toast.success("Feedback link updated");
  };

  const totalItems = items.length;
  const totalDeliverables = items.filter((i) => i.is_deliverable).length;
  const totalMilestones = phases.filter((p) => p.gate).length;

  const handleItemClick = (item: any) => {
    const timelineItem: TimelineItem = {
      id: item.id,
      title: item.title,
      description: item.description || "",
      isDeliverable: item.is_deliverable,
      hasTemplate: item.has_template,
      responsibleRole: item.responsible_role || [],
      inputs: item.inputs || [],
      outputs: item.outputs || [],
    };
    setSelectedItem(timelineItem);
    setSelectedIsMeetingTask(false);
    setDetailDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="sticky top-0 z-30 shrink-0 relative h-8 md:h-9 overflow-hidden">
        <img src={heroImage} alt={`${title} banner`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center justify-between px-6 md:px-12">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="mr-3 text-secondary-foreground hover:bg-secondary/40" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-1" />Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
                <Icon className="h-4 w-4" />
              </div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">{title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {feedbackUrl && (
              <Button
                size="sm"
                variant="secondary"
                className="gap-1 h-6 px-2 text-xs"
                onClick={() => window.open(feedbackUrl, "_blank")}
              >
                <MessageSquare className="h-3 w-3" />
                Feedback
              </Button>
            )}
            {isAdminOrModerator && (
              <Button
                size="sm"
                variant="ghost"
                className="text-secondary-foreground hover:bg-secondary/40"
                onClick={() => {
                  setFeedbackEditUrl(feedbackUrl);
                  setFeedbackEditOpen(true);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 md:p-4">
        <div className="space-y-3">
          {/* IRGT Notice */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
            <p className="text-xs text-foreground">
              All projects must follow the IRGT review process.
            </p>
            <button
              onClick={() => setIrgtDialogOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors shrink-0"
            >
              <ClipboardCheck className="h-3 w-3" />
              <span className="underline underline-offset-2">IRGT Review Process</span>
              <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 border-primary/30 text-primary">Required</Badge>
            </button>
          </div>

          {/* Stats and Legend - compact inline row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border bg-card text-xs">
              <FolderKanban className="h-3 w-3 text-primary" />
              <span className="font-bold text-foreground">{totalItems}</span>
              <span className="text-muted-foreground">Items</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border bg-card text-xs">
              <Package className="h-3 w-3 text-emerald-500" />
              <span className="font-bold text-foreground">{totalDeliverables}</span>
              <span className="text-muted-foreground">Deliverables</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border bg-card text-xs">
              <Flag className="h-3 w-3 text-amber-500" />
              <span className="font-bold text-foreground">{totalMilestones}</span>
              <span className="text-muted-foreground">Gates</span>
            </div>
            <div className="border-l border-border h-4 mx-1" />
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-medium">Legend:</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" />Customer</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-muted-foreground/40" />Internal</span>
              <Badge className="bg-amber-500 text-white text-[10px] px-1.5 py-0 h-4"><Flag className="h-2.5 w-2.5 mr-0.5" />Gate</Badge>
            </div>
          </div>

          {/* Timeline Header */}
          <div>
            <h2 className="text-lg font-semibold text-foreground">Project Lifecycle</h2>
            <p className="text-sm text-muted-foreground">Click any item to view details, templates, and documents</p>
          </div>

          <Accordion type="multiple" defaultValue={[]} className="space-y-3">
            {phases.map((phase) => {
              const PhaseIcon = phaseIcons[phase.id] || Target;
              const phaseItems = itemsByPhase(phase.id);
              const phaseMeetings = meetingTasksByPhase(phase.id);
              const deliverableCount = phaseItems.filter((i) => i.is_deliverable).length;

              return (
                <AccordionItem key={phase.id} value={phase.id} className="border rounded-xl overflow-hidden bg-card">
                  <AccordionTrigger className={`${phase.color} px-4 py-3 hover:no-underline [&[data-state=open]>svg]:rotate-180`}>
                    <div className="flex items-center gap-4 flex-1 text-white">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm shrink-0">
                        <PhaseIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-bold text-base">{phase.title}</h3>
                        <p className="text-sm text-white/80">
                          {phaseItems.length} items • {deliverableCount} deliverables
                        </p>
                      </div>
                      <Badge className="bg-amber-500 text-white border-0 shrink-0">
                        <Flag className="h-3 w-3 mr-1" />{phase.gate.title}
                      </Badge>
                    </div>
                    <ChevronDown className="h-5 w-5 text-white shrink-0 transition-transform duration-200 ml-2" />
                  </AccordionTrigger>
                  <AccordionContent className="p-0">
                    {/* Key Meetings and Tasks */}
                    {(phaseMeetings.length > 0 || isAdminOrModerator) && (
                      <div className="px-4 pt-4">
                        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-400">Key Meetings & Tasks</h4>
                            </div>
                            {isAdminOrModerator && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => {
                                  setEditMeetingTask(null);
                                  setActiveMeetingPhaseId(phase.id);
                                  setAddMeetingDialogOpen(true);
                                }}
                              >
                                <Plus className="h-3 w-3 mr-1" />Add
                              </Button>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {phaseMeetings.map((mt) => (
                              <div
                                key={mt.id}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all duration-200 hover:scale-105 ${
                                  mt.type === "meeting"
                                    ? "bg-blue-500/20 text-blue-700 dark:text-blue-300 hover:bg-blue-500/30"
                                    : "bg-violet-500/20 text-violet-700 dark:text-violet-300 hover:bg-violet-500/30"
                                }`}
                                onClick={() => {
                                  const timelineItem: TimelineItem = {
                                    id: mt.id,
                                    title: mt.title,
                                    description: mt.description || "",
                                    isDeliverable: false,
                                    hasTemplate: false,
                                    responsibleRole: mt.responsible_role || [],
                                    inputs: mt.inputs || [],
                                    outputs: mt.outputs || [],
                                  };
                                  setSelectedItem(timelineItem);
                                  setSelectedIsMeetingTask(true);
                                  setDetailDialogOpen(true);
                                }}
                              >
                                {mt.type === "meeting" ? <Users className="h-3 w-3" /> : <ClipboardCheck className="h-3 w-3" />}
                                {mt.title}
                                {isAdminOrModerator && (
                                  <div className="flex items-center gap-0.5 ml-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditMeetingTask(mt);
                                        setActiveMeetingPhaseId(phase.id);
                                        setAddMeetingDialogOpen(true);
                                      }}
                                      className="hover:text-primary"
                                    >
                                      <Settings className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteMeetingTask.mutate(mt.id, {
                                          onSuccess: () => toast.success("Removed"),
                                          onError: () => toast.error("Failed to remove"),
                                        });
                                      }}
                                      className="hover:text-destructive"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                            {phaseMeetings.length === 0 && (
                              <p className="text-xs text-muted-foreground italic">No meetings or tasks added yet</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Items Grid */}
                    {phaseItems.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4">
                        {phaseItems.map((item) => (
                          <div key={item.id} className="relative group">
                            <button
                              onClick={() => handleItemClick(item)}
                              className="w-full flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 hover:border-primary/30 transition-all duration-200 text-left"
                            >
                              <div className={`h-3 w-3 rounded-full shrink-0 mt-0.5 ${item.is_deliverable ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2">
                                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors pr-12">{item.title}</span>
                                </div>
                                {item.is_deliverable ? (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Package className="h-3 w-3 text-emerald-500" />
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400">Customer Deliverable</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1 mt-1">
                                    <FileText className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">Internal Deliverable</span>
                                  </div>
                                )}
                              </div>
                            </button>
                            {isAdminOrModerator && (
                              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    setEditItem(item);
                                    setActivePhaseId(phase.id);
                                    setAddItemDialogOpen(true);
                                  }}
                                >
                                  <Settings className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-destructive"
                                  onClick={() => {
                                    deleteItem.mutate(item.id, {
                                      onSuccess: () => toast.success("Item deleted"),
                                      onError: () => toast.error("Failed to delete"),
                                    });
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-muted-foreground">
                        <p className="text-sm italic">No items have been added to this phase yet.</p>
                      </div>
                    )}

                    {/* Add Item Button */}
                    {isAdminOrModerator && (
                      <div className="px-4 pb-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2 border-dashed"
                          onClick={() => {
                            setEditItem(null);
                            setActivePhaseId(phase.id);
                            setAddItemDialogOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                          Add Item to {phase.title}
                        </Button>
                      </div>
                    )}

                    {/* Gate Review Footer */}
                    <div className="px-4 pb-4">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white shrink-0">
                          <Flag className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-amber-700 dark:text-amber-400">{phase.gate.title}</h4>
                          <p className="text-xs text-muted-foreground">{phase.gate.description}</p>
                        </div>
                        <Badge className="bg-amber-500 text-white border-0">Milestone</Badge>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>

      {/* Dialogs */}
      <ExecutionItemDetailDialog
        item={irgtDialogOpen ? irgtItem : selectedItem}
        open={irgtDialogOpen || detailDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIrgtDialogOpen(false);
            setDetailDialogOpen(false);
          }
        }}
        hideDocuments={selectedIsMeetingTask && !irgtDialogOpen}
      />

      {addItemDialogOpen && (
        <LifecycleItemFormDialog
          open={addItemDialogOpen}
          onOpenChange={(open) => {
            setAddItemDialogOpen(open);
            if (!open) setEditItem(null);
          }}
          item={editItem}
          phaseId={activePhaseId}
          methodSlug={methodSlug}
          existingItemsCount={itemsByPhase(activePhaseId).length}
          isPending={addItem.isPending || updateItem.isPending}
          onSave={(data) => {
            addItem.mutate(data, {
              onSuccess: () => {
                toast.success("Item added");
                setAddItemDialogOpen(false);
              },
              onError: () => toast.error("Failed to add item"),
            });
          }}
          onUpdate={(data) => {
            updateItem.mutate(data, {
              onSuccess: () => {
                toast.success("Item updated");
                setAddItemDialogOpen(false);
                setEditItem(null);
              },
              onError: () => toast.error("Failed to update item"),
            });
          }}
        />
      )}

      {addMeetingDialogOpen && (
        <AddMeetingTaskDialog
          open={addMeetingDialogOpen}
          onOpenChange={(open) => {
            setAddMeetingDialogOpen(open);
            if (!open) setEditMeetingTask(null);
          }}
          phaseId={activeMeetingPhaseId}
          methodSlug={methodSlug}
          existingCount={meetingTasksByPhase(activeMeetingPhaseId).length}
          isPending={addMeetingTask.isPending || updateMeetingTask.isPending}
          item={editMeetingTask}
          onSave={(data) => {
            addMeetingTask.mutate(data, {
              onSuccess: () => {
                toast.success("Added");
                setAddMeetingDialogOpen(false);
              },
              onError: () => toast.error("Failed to add"),
            });
          }}
          onUpdate={(data) => {
            updateMeetingTask.mutate(data, {
              onSuccess: () => {
                toast.success("Updated");
                setAddMeetingDialogOpen(false);
                setEditMeetingTask(null);
              },
              onError: () => toast.error("Failed to update"),
            });
          }}
        />
      )}

      {/* Feedback URL Edit Dialog */}
      <Dialog open={feedbackEditOpen} onOpenChange={setFeedbackEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Feedback Link</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="feedback-url">Feedback URL</Label>
              <Input
                id="feedback-url"
                placeholder="https://forms.example.com/feedback"
                value={feedbackEditUrl}
                onChange={(e) => setFeedbackEditUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter the URL where users will be directed when clicking the Feedback button. Leave empty to hide the button.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackEditOpen(false)}>Cancel</Button>
            <Button onClick={saveFeedbackUrl}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
