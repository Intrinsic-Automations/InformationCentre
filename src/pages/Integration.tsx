import { Wrench, Circle, CheckCircle2, RotateCcw } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";

const timelineSteps = [
  { title: "Kick off", subItems: [] },
  { title: "Discovery", subItems: ["Questionnaire", "Requirements", "ROM", "Estimates"], id: "discovery" },
  { title: "SOW", subItems: [] },
  { title: "High Level Design", subItems: [] },
  { title: "Environment Set up", subItems: [] },
  { title: "Low Level Design", subItems: [] },
  { title: "Development", subItems: [] },
  { title: "Testing Design", subItems: ["Test plan", "Test Script", "Test Data"] },
  { title: "Implementation", subItems: ["Solution Development", "Unit Testing"] },
  { title: "Integration Testing", subItems: [] },
  { title: "UAT", subItems: ["CN's", "Deployment Guide", "User Guide"] },
  { title: "Production Deployment", subItems: [] },
  { title: "Change Requests", subItems: [], linksTo: "discovery" },
];

export default function Integration() {
  return (
    <PageLayout
      title="Integration"
      description="Solution end-to-end process timeline."
      icon={<Wrench className="h-5 w-5" />}
    >
      <div className="max-w-2xl">
        <Card className="bg-card">
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Solution Timeline</h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

              <div className="space-y-6">
                {timelineSteps.map((step, index) => (
                  <div key={index} className="relative pl-12" id={step.id}>
                    {/* Circle marker */}
                    <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Circle className="h-3 w-3 fill-current" />
                    </div>

                    {/* Content */}
                    <div className="pt-1">
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
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
