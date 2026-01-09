import { Wrench, CheckCircle2, RotateCcw, Download, Rocket, Search, FileText, PenTool, Server, Code, TestTube, Cog, FlaskConical, Users, CloudUpload, RefreshCw } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";

const timelineSteps = [
  { title: "Kick off", subItems: [], icon: Rocket, color: "bg-emerald-500" },
  { title: "Discovery", subItems: ["Questionnaire", "Requirements", "ROM", "Estimates"], id: "discovery", icon: Search, color: "bg-blue-500" },
  { title: "SOW", subItems: [], icon: FileText, color: "bg-cyan-500" },
  { title: "High Level Design", subItems: [], icon: PenTool, color: "bg-purple-500" },
  { title: "Environment Set up", subItems: [], icon: Server, color: "bg-orange-500" },
  { title: "Low Level Design", subItems: [], icon: Code, color: "bg-pink-500" },
  { title: "Development", subItems: [], icon: Cog, color: "bg-yellow-500" },
  { title: "Testing Design", subItems: ["Test plan", "Test Script", "Test Data"], icon: TestTube, color: "bg-teal-500" },
  { title: "Implementation", subItems: ["Solution Development", "Unit Testing"], icon: FlaskConical, color: "bg-rose-500" },
  { title: "Integration Testing", subItems: [], icon: Server, color: "bg-violet-500" },
  { title: "UAT", subItems: ["CN's", "Deployment Guide", "User Guide"], icon: Users, color: "bg-amber-500" },
  { title: "Production Deployment", subItems: [], icon: CloudUpload, color: "bg-green-500" },
  { title: "Change Requests", subItems: [], linksTo: "discovery", icon: RefreshCw, color: "bg-indigo-500" },
];

const templates = [
  "Project One-Pager",
  "Questionnaire",
  "Requirements Document",
  "Solution Outline",
  "RACI",
  "IPP Plan",
  "Risk and Issues",
  "Burn Rate Monitor",
  "Data Mapping",
  "Data Profiling",
  "High Level Design",
  "Low Level Design",
  "Infrastructure Architecture Design",
  "User Stories",
  "Test Plan",
  "Test Script",
  "Implementation Document",
  "User Guide",
  "Deployment Guide",
  "Change Request Document",
  "Project Closure Document",
];

export default function Integration() {
  return (
    <PageLayout
      title="Integration"
      description="Solution end-to-end process timeline."
      icon={<Wrench className="h-5 w-5" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Solution Timeline</h2>
            <div className="relative">
              {/* Gradient vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 via-purple-500 to-indigo-500 rounded-full" />

              <div className="space-y-4">
                {timelineSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={index}
                      className="relative pl-14 group animate-fade-in"
                      id={step.id}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Icon marker */}
                      <div className={`absolute left-0 flex h-10 w-10 items-center justify-center rounded-xl ${step.color} text-white shadow-lg transition-transform duration-200 group-hover:scale-110`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Content card */}
                      <div className="bg-muted/30 rounded-lg p-3 border border-border/30 transition-all duration-200 group-hover:bg-muted/50 group-hover:border-primary/30 group-hover:shadow-md">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          {step.title}
                          {step.linksTo && (
                            <a href={`#${step.linksTo}`} className="text-primary hover:text-primary/80 transition-colors">
                              <RotateCcw className="h-4 w-4" />
                            </a>
                          )}
                        </h3>
                        {step.subItems.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {step.subItems.map((subItem, subIndex) => (
                              <li key={subIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-3 w-3 text-primary" />
                                {subItem}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card h-fit">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Integration Templates</h2>
            <ul className="space-y-2">
              {templates.map((template, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="flex items-center justify-between gap-2 text-sm text-foreground hover:text-primary transition-colors py-1 group"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                      {template}
                    </span>
                    <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
