import { Lightbulb, BookOpen, Wrench, Target, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import projectsInsightsHero from "@/assets/projects-insights-hero.jpg";

const strategies = [
  {
    title: "Agile Sprint Planning for Large Migrations",
    category: "Strategy",
    description: "Break down complex migrations into 2-week sprints with clear deliverables. Use daily standups to identify blockers early and maintain momentum.",
    tags: ["Agile", "Migration", "Planning"],
    icon: Target,
  },
  {
    title: "Effective Stakeholder Communication",
    category: "Strategy",
    description: "Schedule weekly status updates with stakeholders using a consistent format. Include progress metrics, risks, and next steps to keep everyone aligned.",
    tags: ["Communication", "Stakeholders", "Reporting"],
    icon: Target,
  },
  {
    title: "Risk Mitigation in Integration Projects",
    category: "Strategy",
    description: "Identify integration points early and create fallback plans. Test in staging environments before production deployment to minimize disruption.",
    tags: ["Risk Management", "Integration", "Testing"],
    icon: Target,
  },
];

const softwareTips = [
  {
    title: "Mastering JIRA Workflows",
    category: "Software Tip",
    description: "Configure custom workflows to match your team's process. Use automation rules to auto-assign tickets and send notifications for status changes.",
    tags: ["JIRA", "Automation", "Workflows"],
    icon: Wrench,
  },
  {
    title: "Confluence Documentation Best Practices",
    category: "Software Tip",
    description: "Use templates for consistent documentation. Link pages to JIRA tickets for traceability and enable page watching for key stakeholders.",
    tags: ["Confluence", "Documentation", "Templates"],
    icon: BookOpen,
  },
  {
    title: "Slack Integration for Project Updates",
    category: "Software Tip",
    description: "Set up channel integrations to receive automated updates from JIRA, GitHub, and other tools. Use threads to keep conversations organized.",
    tags: ["Slack", "Integrations", "Communication"],
    icon: Wrench,
  },
];

export default function ProjectsInsights() {
  return (
    <div className="flex flex-col h-full">
      {/* Hero Banner with Title */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={projectsInsightsHero}
          alt="Projects Insights banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Lightbulb className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary-foreground">Projects Insights</h1>
              <p className="text-sm md:text-base text-secondary-foreground/80 mt-1">
                Actionable strategies and practical software tips from our projects.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl space-y-8">
          {/* Actionable Strategies Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Actionable Strategies</h2>
            </div>
            <div className="space-y-4">
              {strategies.map((item, index) => (
                <Card key={index} className="bg-card hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription>{item.category}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/80 mb-3">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" className="gap-2">
                        Learn More <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Practical Software Tips Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Practical Software Tips</h2>
            </div>
            <div className="space-y-4">
              {softwareTips.map((item, index) => (
                <Card key={index} className="bg-card hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <CardDescription>{item.category}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/80 mb-3">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" className="gap-2">
                        View Guide <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
