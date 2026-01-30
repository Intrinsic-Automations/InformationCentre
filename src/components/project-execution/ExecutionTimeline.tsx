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
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {executionTimelineData.map((phase, phaseIndex) => {
          const PhaseIcon = phaseIcons[phase.id] || Target;
          
          return (
            <div key={phase.id} className="flex flex-col">
              {/* Phase Header Card */}
              <div className={`${phase.color} rounded-t-xl p-4 text-white`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                    <PhaseIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base truncate">{phase.title}</h3>
                  </div>
                </div>
                <div className="flex gap-3 text-xs text-white/80">
                  <span>{phase.items.length} items</span>
                  <span>•</span>
                  <span>{phase.items.filter(i => i.isDeliverable).length} deliverables</span>
                </div>
              </div>

              {/* Phase Items */}
              <div className="flex-1 bg-card rounded-b-xl border border-t-0 border-border overflow-hidden">
                <div className="divide-y divide-border/50">
                  {phase.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className="w-full text-left group"
                    >
                      <div className="flex items-center gap-3 p-3 transition-all duration-200 hover:bg-muted/30">
                        {/* Deliverable indicator */}
                        <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                          item.isDeliverable ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                        }`} />
                        
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {item.title}
                          </span>
                        </div>
                        
                        {item.isDeliverable && (
                          <Package className="h-3.5 w-3.5 text-emerald-500 shrink-0 opacity-60" />
                        )}
                        
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary shrink-0 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Gate Review Milestone */}
                {phase.gateReview && (
                  <div className="p-3 bg-amber-500/10 border-t border-amber-500/20">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-white shrink-0">
                        <Flag className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-amber-700 dark:text-amber-400 truncate">
                          {phase.gateReview.title}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">
                          {phase.gateReview.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
