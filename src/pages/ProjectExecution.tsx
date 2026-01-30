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
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-card">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FolderKanban className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalItems}</p>
                    <p className="text-xs text-muted-foreground">Total Items</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                    <Package className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalDeliverables}</p>
                    <p className="text-xs text-muted-foreground">Deliverables</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <Flag className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{totalMilestones}</p>
                    <p className="text-xs text-muted-foreground">Gate Reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Legend */}
          <Card className="bg-card">
            <CardContent className="py-3">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="text-muted-foreground font-medium">Legend:</span>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  <span className="text-muted-foreground">Customer Deliverable</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-muted-foreground/40" />
                  <span className="text-muted-foreground">Internal Document</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-500 text-white text-xs">
                    <Flag className="h-3 w-3 mr-1" />
                    Milestone
                  </Badge>
                  <span className="text-muted-foreground">Gate Review</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-xl">Execution Timeline</CardTitle>
              <p className="text-sm text-muted-foreground">
                Click on any item to view template details, responsible roles, and document downloads.
              </p>
            </CardHeader>
            <CardContent>
              <ExecutionTimeline />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
