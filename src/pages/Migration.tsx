import { ArrowRightLeft, Circle, CheckCircle2 } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";

const timelineSteps = [
  { title: "Kick off", subItems: [] },
  { title: "Discovery Workshop", subItems: ["Requirements", "Data Profiling"] },
  { title: "High Level Design", subItems: [] },
  { title: "Low Level Design", subItems: [] },
  { title: "Customer Sign Off", subItems: [] },
  { title: "Development", subItems: [] },
  { title: "Unit Testing", subItems: [] },
  { title: "Testing", subItems: [] },
  { title: "Delivery", subItems: ["Deployment Support", "Training for customer"] },
  { title: "SIT + VAT", subItems: [] },
  { title: "Fixes and Enhancements", subItems: [] },
  { title: "Production Delivery (Go Live)", subItems: ["Validation", "Sign off"] },
  { title: "Identify Product Gaps", subItems: ["Support"] },
  { title: "Project Closure Document", subItems: [] },
];

export default function Migration() {
  return (
    <PageLayout
      title="Migration"
      description="Solution end-to-end process timeline."
      icon={<ArrowRightLeft className="h-5 w-5" />}
    >
      <Card className="bg-card max-w-2xl">
        <CardContent className="pt-6">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

            <div className="space-y-6">
              {timelineSteps.map((step, index) => (
                <div key={index} className="relative pl-12">
                  {/* Circle marker */}
                  <div className="absolute left-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Circle className="h-3 w-3 fill-current" />
                  </div>

                  {/* Content */}
                  <div className="pt-1">
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
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
    </PageLayout>
  );
}
