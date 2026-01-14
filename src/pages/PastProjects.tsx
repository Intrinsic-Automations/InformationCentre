import { useState } from "react";
import { History, CheckCircle2, ArrowRight, FileDown, Info, Calendar, Wrench, AlertTriangle, Ticket, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import pastProjectsHero from "@/assets/past-projects-hero.jpg";

interface Project {
  name: string;
  completedDate: string;
  status: string;
  description: string;
  highlights: string;
  type: string;
  closure: {
    summary: string;
    challenges: string;
    tools: string;
    tickets: number;
  };
}

const projects = [
  {
    name: "Enterprise Analytics Migration",
    completedDate: "December 15, 2025",
    status: "Success",
    description: "Full migration of enterprise analytics platform with 500+ dashboards.",
    highlights: "30% performance improvement, zero data loss",
    type: "Migration",
    closure: {
      summary: "Successfully migrated 500+ dashboards and 2TB of data to cloud-native infrastructure.",
      challenges: "Data validation complexity, legacy system dependencies, tight timeline",
      tools: "Analytics Suite, Azure Data Factory, Power BI",
      tickets: 127,
    },
  },
  {
    name: "Salesforce CRM Integration",
    completedDate: "November 30, 2025",
    status: "Success",
    description: "Complete integration with Salesforce CRM for real-time sales analytics.",
    highlights: "Real-time sync, automated reporting",
    type: "Integration",
    closure: {
      summary: "Integrated Salesforce CRM with internal analytics platform enabling real-time sales insights.",
      challenges: "API rate limits, data mapping inconsistencies, SSO configuration",
      tools: "Salesforce API, MuleSoft, Analytics Foundation",
      tickets: 84,
    },
  },
  {
    name: "Global Analytics Dashboard",
    completedDate: "October 20, 2025",
    status: "Success",
    description: "Multi-region analytics dashboard supporting 5 global data centers.",
    highlights: "99.9% uptime, sub-second query response",
    type: "Analytics",
    closure: {
      summary: "Deployed multi-region dashboard with geo-distributed data processing and caching.",
      challenges: "Latency optimization, data consistency across regions, timezone handling",
      tools: "Analytics Advanced, Redis, CloudFront CDN",
      tickets: 156,
    },
  },
  {
    name: "Legacy System Migration",
    completedDate: "September 15, 2025",
    status: "Success",
    description: "Migration from Oracle to cloud-native analytics infrastructure.",
    highlights: "40% cost reduction, improved scalability",
    type: "Migration",
    closure: {
      summary: "Migrated Oracle-based reporting to modern cloud infrastructure with cost savings.",
      challenges: "Complex stored procedures, data transformation logic, user training",
      tools: "AWS RDS, Snowflake, dbt, Analytics Suite",
      tickets: 203,
    },
  },
];

export default function PastProjects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
        {/* Posting Guidelines */}
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Posting Guidelines</h3>
                <p className="text-sm text-muted-foreground">
                  Please upload a detailed overview of your project including key outcomes, challenges faced, and lessons learned. 
                  Don't forget to upload your <strong>End of Project Report</strong> documents to help the team learn from your experience.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
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
                
                {/* Project Closure Summary */}
                <div className="bg-muted/30 rounded-lg p-3 mb-4 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-foreground">Project Closure Summary</h4>
                    <a
                      href="#"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      <FileDown className="h-3.5 w-3.5" />
                      Download Full Document
                    </a>
                  </div>
                  <p className="text-xs text-foreground/70 mb-2">{project.closure.summary}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Challenges: </span>
                      <span className="text-foreground/80">{project.closure.challenges}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tools: </span>
                      <span className="text-foreground/80">{project.closure.tools}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tickets Raised: </span>
                      <span className="text-primary font-medium">{project.closure.tickets}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => setSelectedProject(project)}
                >
                  View Full Report <ArrowRight className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Full Report Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                    <div>
                      <DialogTitle className="text-xl">{selectedProject.name}</DialogTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Completed {selectedProject.completedDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className={
                      selectedProject.type === "Migration" ? "border-orange-500/50 text-orange-600" :
                      selectedProject.type === "Integration" ? "border-blue-500/50 text-blue-600" :
                      "border-green-500/50 text-green-600"
                    }>
                      {selectedProject.type}
                    </Badge>
                    <Badge variant="default">{selectedProject.status}</Badge>
                  </div>
                </div>
              </DialogHeader>

              <Separator className="my-4" />

              {/* Project Overview */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Project Overview</h3>
                  <p className="text-sm text-foreground/80">{selectedProject.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Key Highlights</h3>
                  <p className="text-sm text-primary font-medium">{selectedProject.highlights}</p>
                </div>

                <Separator />

                {/* Project Closure Report */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Project Closure Report</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                      <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <History className="h-4 w-4 text-primary" />
                        Executive Summary
                      </h4>
                      <p className="text-sm text-foreground/80">{selectedProject.closure.summary}</p>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                      <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        Challenges Faced
                      </h4>
                      <p className="text-sm text-foreground/80">{selectedProject.closure.challenges}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                          <Wrench className="h-4 w-4 text-blue-500" />
                          Tools & Technologies
                        </h4>
                        <p className="text-sm text-foreground/80">{selectedProject.closure.tools}</p>
                      </div>

                      <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-purple-500" />
                          Tickets Raised
                        </h4>
                        <p className="text-2xl font-bold text-primary">{selectedProject.closure.tickets}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Download Section */}
                <div className="flex items-center justify-between bg-primary/5 rounded-lg p-4 border border-primary/20">
                  <div>
                    <h4 className="text-sm font-medium text-foreground">Full Project Closure Document</h4>
                    <p className="text-xs text-muted-foreground">Download the complete project report with all details</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileDown className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}