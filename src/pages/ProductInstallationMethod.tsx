import { Package, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import installationHero from "@/assets/installation-method-hero.jpg";

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

export default function ProductInstallationMethod() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img src={installationHero} alt="Product Installation Method banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <Button variant="ghost" size="sm" className="mr-3 text-secondary-foreground hover:bg-secondary/40" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" />Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Package className="h-4 w-4" />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Product Installation Method</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Project Lifecycle</h2>
            <p className="text-sm text-muted-foreground">Product Installation methodology phases — items, deliverables, and tasks to be added</p>
          </div>

          <Accordion type="multiple" defaultValue={phases.map(p => p.id)} className="space-y-3">
            {phases.map((phase) => {
              const PhaseIcon = phaseIcons[phase.id] || Target;
              return (
                <AccordionItem key={phase.id} value={phase.id} className="border rounded-xl overflow-hidden bg-card">
                  <AccordionTrigger className={`${phase.color} px-4 py-3 hover:no-underline [&[data-state=open]>svg]:rotate-180`}>
                    <div className="flex items-center gap-4 flex-1 text-white">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm shrink-0">
                        <PhaseIcon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-bold text-base">{phase.title}</h3>
                        <p className="text-sm text-white/80">0 items • 0 deliverables</p>
                      </div>
                      <Badge className="bg-amber-500 text-white border-0 shrink-0">
                        <Flag className="h-3 w-3 mr-1" />{phase.gate.title}
                      </Badge>
                    </div>
                    <ChevronDown className="h-5 w-5 text-white shrink-0 transition-transform duration-200 ml-2" />
                  </AccordionTrigger>
                  <AccordionContent className="p-0">
                    <div className="p-6 text-center text-muted-foreground">
                      <p className="text-sm italic">No items, deliverables, or tasks have been added to this phase yet.</p>
                    </div>
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
    </div>
  );
}
