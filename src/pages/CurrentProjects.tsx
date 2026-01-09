import { Clock, Users, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import currentProjectsHero from "@/assets/current-projects-hero.jpg";

const projects = [
  {
    name: "Healthcare Analytics Migration",
    deadline: "January 31, 2026",
    team: ["JW", "AC", "MG"],
    progress: 78,
    description: "Migrating healthcare client data to Analytics Suite with real-time dashboards.",
    type: "Migration",
  },
  {
    name: "SAP ERP Integration",
    deadline: "February 14, 2026",
    team: ["EZ", "RM", "PS"],
    progress: 45,
    description: "Building unified API gateway for SAP ERP system integration.",
    type: "Integration",
  },
  {
    name: "Financial KPI Dashboard",
    deadline: "January 25, 2026",
    team: ["PS", "HM", "SL"],
    progress: 90,
    description: "Implementing real-time financial analytics using Analytics Foundation.",
    type: "Analytics",
  },
  {
    name: "CRM Data Migration",
    deadline: "February 28, 2026",
    team: ["LK", "DK"],
    progress: 35,
    description: "Migrating legacy CRM data to cloud-native infrastructure.",
    type: "Migration",
  },
];

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
        <div className="max-w-3xl space-y-4">
          {projects.map((project, index) => (
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
                    <span className="text-2xl font-bold text-primary">{project.progress}%</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 mb-4">{project.description}</p>
                <Progress value={project.progress} className="h-2 mb-4" />
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
          ))}
        </div>
      </div>
    </div>
  );
}