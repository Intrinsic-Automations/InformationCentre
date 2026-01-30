import { FolderKanban, Package, Flag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExecutionTimeline } from "@/components/project-execution/ExecutionTimeline";
import { executionTimelineData } from "@/components/project-execution/ExecutionTimelineData";
import projectExecutionHero from "@/assets/projects-insights-hero.jpg";

export default function ProjectExecution() {
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
    </div>
  );
}
