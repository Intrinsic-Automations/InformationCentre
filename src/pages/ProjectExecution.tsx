import { useState } from "react";
import { FolderKanban, Package, Flag, AlertCircle, ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExecutionTimeline } from "@/components/project-execution/ExecutionTimeline";
import { executionTimelineData } from "@/components/project-execution/ExecutionTimelineData";
import { ExecutionItemDetailDialog } from "@/components/project-execution/ExecutionItemDetailDialog";
import type { TimelineItem } from "@/components/project-execution/ExecutionTimelineData";
import projectExecutionHero from "@/assets/projects-insights-hero.jpg";

// IRGT Review item definition
const irgtItem: TimelineItem = {
  id: "irgt-review-process",
  title: "IRGT Review Process",
  description: "The Internal Review and Governance Team (IRGT) review process is a mandatory governance checkpoint that ensures all projects meet quality standards, compliance requirements, and organizational guidelines before proceeding. This review validates project documentation, risk assessments, resource allocations, and alignment with strategic objectives.",
  isDeliverable: false,
  hasTemplate: true,
  responsibleRole: "IRGT Committee / Project Governance Board",
  inputs: [
    "Project One-Pager / Business Case",
    "Resource and Cost Estimates",
    "Risk Assessment Documentation",
    "Stakeholder Sign-off Forms",
    "High-Level Project Plan",
  ],
  outputs: [
    "IRGT Approval Documentation",
    "Governance Sign-off Certificate",
    "Conditional Approval Notes (if applicable)",
    "Risk Mitigation Action Items",
  ],
};

export default function ProjectExecution() {
  const [irgtDialogOpen, setIrgtDialogOpen] = useState(false);

  // Calculate stats
  const totalItems = executionTimelineData.reduce((acc, phase) => acc + phase.items.length, 0);
  const totalDeliverables = executionTimelineData.reduce(
    (acc, phase) => acc + phase.items.filter(item => item.isDeliverable).length, 
    0
  );
  const totalMilestones = executionTimelineData.filter(phase => phase.gateReview).length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={projectExecutionHero}
          alt="Project Execution banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <FolderKanban className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Project Execution</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Mandatory IRGT Notice */}
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
                    <span className="underline underline-offset-2 group-hover:no-underline">
                      IRGT Review Process
                    </span>
                    <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                      Required
                    </Badge>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats and Legend Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Stats Cards */}
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

            {/* Legend */}
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
                      <Flag className="h-3 w-3 mr-1" />
                      Gate
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Project Lifecycle</h2>
              <p className="text-sm text-muted-foreground">
                Click any item to view details, templates, and documents
              </p>
            </div>
          </div>

          {/* Timeline - Full Width */}
          <ExecutionTimeline />
        </div>
      </div>

      {/* IRGT Detail Dialog */}
      <ExecutionItemDetailDialog
        item={irgtDialogOpen ? irgtItem : null}
        open={irgtDialogOpen}
        onOpenChange={setIrgtDialogOpen}
      />
    </div>
  );
}
