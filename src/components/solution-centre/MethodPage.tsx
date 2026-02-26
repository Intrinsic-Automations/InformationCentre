import { useState } from "react";
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
    deleteMeetingTask,
  } = useLifecycleItems(methodSlug);

  const [irgtDialogOpen, setIrgtDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [activePhaseId, setActivePhaseId] = useState("");
  const [addMeetingDialogOpen, setAddMeetingDialogOpen] = useState(false);
  const [activeMeetingPhaseId, setActiveMeetingPhaseId] = useState("");

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
      responsibleRole: item.responsible_role || "",
      inputs: item.inputs || [],
      outputs: item.outputs || [],
    };
    setSelectedItem(timelineItem);
    setDetailDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img src={heroImage} alt={`${title} banner`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
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
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* IRGT Notice */}
          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="py-4 px-5">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 shrink-0">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    It is mandatory that all projects follow the IRGT review process. Please download the required documentation before proceeding.
                  </p>
                  <button
                    onClick={() => setIrgtDialogOpen(true)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group"
                  >
                    <ClipboardCheck className="h-4 w-4" />
                    <span className="underline underline-offset-2 group-hover:no-underline">IRGT Review Process</span>
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">Required</Badge>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats and Legend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-card">
                <CardContent className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <FolderKanban className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">{totalItems}</p>
                      <p className="text-xs text-muted-foreground">Items</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardContent className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                      <Package className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">{totalDeliverables}</p>
                      <p className="text-xs text-muted-foreground">Deliverables</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card">
                <CardContent className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                      <Flag className="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">{totalMilestones}</p>
                      <p className="text-xs text-muted-foreground">Gates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="bg-card">
              <CardContent className="py-3 px-4 h-full flex items-center">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <span className="text-muted-foreground font-medium">Legend:</span>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    <span className="text-muted-foreground">Deliverable</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-muted-foreground/40" />
                    <span className="text-muted-foreground">Internal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-500 text-white text-xs px-2 py-0.5">
                      <Flag className="h-3 w-3 mr-1" />Gate
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline Header */}
          <div>
            <h2 className="text-lg font-semibold text-foreground">Project Lifecycle</h2>
            <p className="text-sm text-muted-foreground">Click any item to view details, templates, and documents</p>
          </div>

          <Accordion type="multiple" defaultValue={phases.map((p) => p.id)} className="space-y-3">
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
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium ${
                                  mt.type === "meeting"
                                    ? "bg-blue-500/20 text-blue-700 dark:text-blue-300"
                                    : "bg-violet-500/20 text-violet-700 dark:text-violet-300"
                                }`}
                              >
                                {mt.type === "meeting" ? <Users className="h-3 w-3" /> : <ClipboardCheck className="h-3 w-3" />}
                                {mt.title}
                                {isAdminOrModerator && (
                                  <button
                                    onClick={() => {
                                      deleteMeetingTask.mutate(mt.id, {
                                        onSuccess: () => toast.success("Removed"),
                                        onError: () => toast.error("Failed to remove"),
                                      });
                                    }}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
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
                                <div className="flex items-start justify-between gap-2">
                                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.title}</span>
                                  <FileText className="h-4 w-4 text-muted-foreground shrink-0 opacity-50" />
                                </div>
                                {item.is_deliverable && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Package className="h-3 w-3 text-emerald-500" />
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400">Customer Deliverable</span>
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
          onOpenChange={setAddMeetingDialogOpen}
          phaseId={activeMeetingPhaseId}
          methodSlug={methodSlug}
          existingCount={meetingTasksByPhase(activeMeetingPhaseId).length}
          isPending={addMeetingTask.isPending}
          onSave={(data) => {
            addMeetingTask.mutate(data, {
              onSuccess: () => {
                toast.success("Added");
                setAddMeetingDialogOpen(false);
              },
              onError: () => toast.error("Failed to add"),
            });
          }}
        />
      )}
    </div>
  );
}
