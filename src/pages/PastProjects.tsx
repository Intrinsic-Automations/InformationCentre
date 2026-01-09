import { History, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import pastProjectsHero from "@/assets/past-projects-hero.jpg";

const projects = [
  {
    name: "Enterprise Analytics Migration",
    completedDate: "December 15, 2025",
    status: "Success",
    description: "Full migration of enterprise analytics platform with 500+ dashboards.",
    highlights: "30% performance improvement, zero data loss",
    type: "Migration",
  },
  {
    name: "Salesforce CRM Integration",
    completedDate: "November 30, 2025",
    status: "Success",
    description: "Complete integration with Salesforce CRM for real-time sales analytics.",
    highlights: "Real-time sync, automated reporting",
    type: "Integration",
  },
  {
    name: "Global Analytics Dashboard",
    completedDate: "October 20, 2025",
    status: "Success",
    description: "Multi-region analytics dashboard supporting 5 global data centers.",
    highlights: "99.9% uptime, sub-second query response",
    type: "Analytics",
  },
  {
    name: "Legacy System Migration",
    completedDate: "September 15, 2025",
    status: "Success",
    description: "Migration from Oracle to cloud-native analytics infrastructure.",
    highlights: "40% cost reduction, improved scalability",
    type: "Migration",
  },
];

export default function PastProjects() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={pastProjectsHero}
          alt="Past Projects banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <History className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Past Projects</h1>
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
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription>Completed {project.completedDate}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={
                      project.type === "Migration" ? "border-orange-500/50 text-orange-600" :
                      project.type === "Integration" ? "border-blue-500/50 text-blue-600" :
                      "border-green-500/50 text-green-600"
                    }>
                      {project.type}
                    </Badge>
                    <Badge variant="default">{project.status}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 mb-2">{project.description}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  <strong>Key Highlights:</strong> {project.highlights}
                </p>
                <Button variant="ghost" size="sm" className="gap-2">
                  View Report <ArrowRight className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}