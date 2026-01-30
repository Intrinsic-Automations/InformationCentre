import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Package, 
  Flag,
  ChevronRight,
  CheckCircle2,
  Layers,
  Target,
  Settings,
  Rocket,
  LogOut
} from "lucide-react";
import { executionTimelineData, type TimelineItem } from "./ExecutionTimelineData";
import { ExecutionItemDetailDialog } from "./ExecutionItemDetailDialog";

const phaseIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "discovery-plan": Target,
  "prepare-requirements": Layers,
  "explore-design": Settings,
  "realise-implementation": Rocket,
  "deploy-exit": LogOut,
};

export function ExecutionTimeline() {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleItemClick = (item: TimelineItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-8">
        {executionTimelineData.map((phase, phaseIndex) => {
          const PhaseIcon = phaseIcons[phase.id] || Target;
          
          return (
            <div key={phase.id} className="relative">
              {/* Phase Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${phase.color} text-white shadow-lg`}>
                  <PhaseIcon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-foreground">{phase.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {phase.items.length} items • {phase.items.filter(i => i.isDeliverable).length} deliverables
                  </p>
                </div>
              </div>

              {/* Phase Items */}
              <div className="ml-5 border-l-2 border-border pl-8 space-y-2">
                {phase.items.map((item, itemIndex) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="w-full text-left group"
                  >
                    <div className="relative">
                      {/* Connector dot */}
                      <div className={`absolute -left-[2.35rem] top-3 h-3 w-3 rounded-full border-2 border-background ${
                        item.isDeliverable ? 'bg-emerald-500' : 'bg-muted-foreground/40'
                      }`} />
                      
                      {/* Item Card */}
                      <Card className="bg-muted/20 border-border/30 transition-all duration-200 group-hover:bg-muted/40 group-hover:border-primary/30 group-hover:shadow-md">
                        <CardContent className="py-3 px-4">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                              <span className="font-medium text-sm text-foreground truncate">
                                {item.title}
                              </span>
                              {item.isDeliverable && (
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 shrink-0">
                                  <Package className="h-3 w-3 mr-1" />
                                  Deliverable
                                </Badge>
                              )}
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </button>
                ))}

                {/* Gate Review Milestone */}
                {phase.gateReview && (
                  <div className="relative pt-4">
                    {/* Milestone connector */}
                    <div className="absolute -left-[2.35rem] top-7 h-4 w-4 rounded-full bg-amber-500 border-2 border-background shadow-lg" />
                    
                    <Card className="bg-amber-500/10 border-amber-500/30 shadow-md">
                      <CardContent className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white">
                            <Flag className="h-4 w-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-amber-700 dark:text-amber-400">
                              {phase.gateReview.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {phase.gateReview.description}
                            </p>
                          </div>
                          <Badge className="bg-amber-500 text-white ml-auto shrink-0">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Milestone
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* Connector to next phase */}
              {phaseIndex < executionTimelineData.length - 1 && (
                <div className="ml-5 h-6 border-l-2 border-dashed border-border/50" />
              )}
            </div>
          );
        })}
      </div>

      <ExecutionItemDetailDialog
        item={selectedItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
