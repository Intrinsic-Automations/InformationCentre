import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Package, 
  Flag,
  ChevronDown,
  Layers,
  Target,
  Settings,
  Rocket,
  LogOut,
  Users,
  ClipboardCheck
} from "lucide-react";
import { executionTimelineData, type TimelineItem } from "./ExecutionTimelineData";
import { ExecutionItemDetailDialog } from "./ExecutionItemDetailDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
      <Accordion type="multiple" defaultValue={executionTimelineData.map(p => p.id)} className="space-y-3">
        {executionTimelineData.map((phase) => {
          const PhaseIcon = phaseIcons[phase.id] || Target;
          const deliverableCount = phase.items.filter(i => i.isDeliverable).length;
          
          return (
            <AccordionItem 
              key={phase.id} 
              value={phase.id}
              className="border rounded-xl overflow-hidden bg-card"
            >
              <AccordionTrigger className={`${phase.color} px-4 py-3 hover:no-underline [&[data-state=open]>svg]:rotate-180`}>
                <div className="flex items-center gap-4 flex-1 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm shrink-0">
                    <PhaseIcon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-base">{phase.title}</h3>
                    <p className="text-sm text-white/80">
                      {phase.items.length} items • {deliverableCount} deliverables
                    </p>
                  </div>
                  {phase.gateReview && (
                    <Badge className="bg-amber-500 text-white border-0 shrink-0">
                      <Flag className="h-3 w-3 mr-1" />
                      {phase.gateReview.title}
                    </Badge>
                  )}
                </div>
                <ChevronDown className="h-5 w-5 text-white shrink-0 transition-transform duration-200 ml-2" />
              </AccordionTrigger>
              
              <AccordionContent className="p-0">
                {/* Key Meetings and Tasks Section */}
                {phase.keyMeetingsAndTasks && phase.keyMeetingsAndTasks.length > 0 && (
                  <div className="px-4 pt-4">
                    <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-400">
                          Key Meetings & Tasks
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {phase.keyMeetingsAndTasks.map((item, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium ${
                              item.type === 'meeting'
                                ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
                                : 'bg-violet-500/20 text-violet-700 dark:text-violet-300'
                            }`}
                          >
                            {item.type === 'meeting' ? (
                              <Users className="h-3 w-3" />
                            ) : (
                              <ClipboardCheck className="h-3 w-3" />
                            )}
                            {item.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-4">
                  {phase.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item)}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 hover:border-primary/30 transition-all duration-200 text-left group"
                    >
                      {/* Deliverable indicator */}
                      <div className={`h-3 w-3 rounded-full shrink-0 mt-0.5 ${
                        item.isDeliverable ? 'bg-emerald-500' : 'bg-muted-foreground/30'
                      }`} />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {item.title}
                          </span>
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0 opacity-50" />
                        </div>
                        {item.isDeliverable && (
                          <div className="flex items-center gap-1 mt-1">
                            <Package className="h-3 w-3 text-emerald-500" />
                            <span className="text-xs text-emerald-600 dark:text-emerald-400">Customer Deliverable</span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Gate Review Footer */}
                {phase.gateReview && (
                  <div className="px-4 pb-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-white shrink-0">
                        <Flag className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-amber-700 dark:text-amber-400">
                          {phase.gateReview.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {phase.gateReview.description}
                        </p>
                      </div>
                      <Badge className="bg-amber-500 text-white border-0">Milestone</Badge>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <ExecutionItemDetailDialog
        item={selectedItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
