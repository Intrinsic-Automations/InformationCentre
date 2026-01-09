import { 
  Clock, 
  Users, 
  ArrowRight,
  Rocket,
  Search,
  PenTool,
  Code,
  TestTube,
  FlaskConical,
  Package,
  Wrench,
  PackageCheck
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import currentProjectsHero from "@/assets/current-projects-hero.jpg";

const stages = [
  { id: "kickoff", label: "Kick Off", icon: Rocket, color: "bg-emerald-500" },
  { id: "discovery", label: "Discovery", icon: Search, color: "bg-blue-500" },
  { id: "design", label: "Design", icon: PenTool, color: "bg-violet-500" },
  { id: "development", label: "Development", icon: Code, color: "bg-orange-500" },
  { id: "testing", label: "Testing", icon: TestTube, color: "bg-amber-500" },
  { id: "sit_vat", label: "SIT + VAT", icon: FlaskConical, color: "bg-yellow-500" },
  { id: "delivery", label: "Delivery", icon: Package, color: "bg-lime-500" },
  { id: "fixes", label: "Fixes", icon: Wrench, color: "bg-teal-500" },
  { id: "golive", label: "Go Live", icon: PackageCheck, color: "bg-cyan-500" },
];

const projects = [
  {
    name: "Healthcare Analytics Migration",
    deadline: "January 31, 2026",
    team: ["JW", "AC", "MG"],
    currentStage: "sit_vat",
    description: "Migrating healthcare client data to Analytics Suite with real-time dashboards.",
    type: "Migration",
  },
  {
    name: "SAP ERP Integration",
    deadline: "February 14, 2026",
    team: ["EZ", "RM", "PS"],
    currentStage: "development",
    description: "Building unified API gateway for SAP ERP system integration.",
    type: "Integration",
  },
  {
    name: "Financial KPI Dashboard",
    deadline: "January 25, 2026",
    team: ["PS", "HM", "SL"],
    currentStage: "delivery",
    description: "Implementing real-time financial analytics using Analytics Foundation.",
    type: "Analytics",
  },
  {
    name: "CRM Data Migration",
    deadline: "February 28, 2026",
    team: ["LK", "DK"],
    currentStage: "design",
    description: "Migrating legacy CRM data to cloud-native infrastructure.",
    type: "Migration",
  },
];

function getStageProgress(currentStage: string) {
  const stageIndex = stages.findIndex(s => s.id === currentStage);
  return stageIndex >= 0 ? ((stageIndex + 1) / stages.length) * 100 : 0;
}

function getCurrentStageInfo(currentStage: string) {
  return stages.find(s => s.id === currentStage) || stages[0];
}

export default function CurrentProjects() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={currentProjectsHero}
          alt="Current Projects banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Current Projects</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl space-y-4">
          {projects.map((project, index) => {
            const stageInfo = getCurrentStageInfo(project.currentStage);
            const progress = getStageProgress(project.currentStage);
            const StageIcon = stageInfo.icon;
            const currentStageIndex = stages.findIndex(s => s.id === project.currentStage);
            
            return (
              <Card key={index} className="bg-card">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>Due {project.deadline}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={
                        project.type === "Migration" ? "border-orange-500/50 text-orange-600" :
                        project.type === "Integration" ? "border-blue-500/50 text-blue-600" :
                        "border-green-500/50 text-green-600"
                      }>
                        {project.type}
                      </Badge>
                      <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${stageInfo.color} text-white text-xs font-medium`}>
                        <StageIcon className="h-3 w-3" />
                        {stageInfo.label}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 mb-4">{project.description}</p>
                  
                  {/* Stage Progress Timeline */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">Project Stage Progress</span>
                      <span className="text-xs font-medium text-primary">{Math.round(progress)}% Complete</span>
                    </div>
                    <div className="flex gap-1">
                      {stages.map((stage, stageIndex) => {
                        const isCompleted = stageIndex < currentStageIndex;
                        const isCurrent = stageIndex === currentStageIndex;
                        const Icon = stage.icon;
                        
                        return (
                          <div 
                            key={stage.id} 
                            className="flex-1 group relative"
                            title={stage.label}
                          >
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                isCompleted 
                                  ? stage.color
                                  : isCurrent 
                                    ? `${stage.color} animate-pulse`
                                    : 'bg-muted'
                              }`}
                            />
                            {isCurrent && (
                              <div className={`absolute -top-6 left-1/2 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full ${stage.color} text-white shadow-md`}>
                                <Icon className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground">Kick Off</span>
                      <span className="text-[10px] text-muted-foreground">Go Live</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="flex -space-x-2">
                        {project.team.map((member, i) => (
                          <Avatar key={i} className="h-6 w-6 border-2 border-background">
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                              {member}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-2">
                      Details <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}