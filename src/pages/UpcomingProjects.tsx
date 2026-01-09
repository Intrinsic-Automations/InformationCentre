import { Calendar, Users, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import upcomingProjectsHero from "@/assets/upcoming-projects-hero.jpg";

const projects = [
  {
    name: "Healthcare Analytics Migration",
    startDate: "February 1, 2026",
    team: ["JW", "EZ", "MG"],
    priority: "High",
    description: "Full data migration from legacy healthcare reporting system to Analytics Suite.",
    type: "Migration",
  },
  {
    name: "CRM Integration - Phase 2",
    startDate: "February 15, 2026",
    team: ["AC", "PS", "LK"],
    priority: "High",
    description: "Integration of Salesforce CRM with internal project management tools.",
    type: "Integration",
  },
  {
    name: "Financial Analytics Dashboard",
    startDate: "March 1, 2026",
    team: ["RM", "SL"],
    priority: "Medium",
    description: "Implementation of real-time financial KPI dashboards using Analytics Foundation.",
    type: "Analytics",
  },
  {
    name: "ERP System Integration",
    startDate: "March 15, 2026",
    team: ["HM", "DK", "JW"],
    priority: "High",
    description: "End-to-end integration of SAP ERP with existing business intelligence platforms.",
    type: "Integration",
  },
  {
    name: "Legacy Database Migration",
    startDate: "April 1, 2026",
    team: ["EZ", "AC"],
    priority: "Medium",
    description: "Migration of Oracle database to cloud-native analytics infrastructure.",
    type: "Migration",
  },
];

export default function UpcomingProjects() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={upcomingProjectsHero}
          alt="Upcoming Projects banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Upcoming Projects</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project, index) => (
            <Card key={index} className="bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>Starts {project.startDate}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={
                      project.type === "Migration" ? "border-orange-500/50 text-orange-600" :
                      project.type === "Integration" ? "border-blue-500/50 text-blue-600" :
                      "border-green-500/50 text-green-600"
                    }>
                      {project.type}
                    </Badge>
                    <Badge variant={project.priority === "High" ? "default" : "secondary"}>
                      {project.priority}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 mb-4">{project.description}</p>
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