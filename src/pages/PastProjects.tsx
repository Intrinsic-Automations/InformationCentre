import { History, CheckCircle2, ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const projects = [
  {
    name: "Platform v2.0 Launch",
    completedDate: "December 15, 2023",
    status: "Success",
    description: "Major platform upgrade with new features and improved performance.",
    highlights: "30% performance improvement, 15 new features",
  },
  {
    name: "CRM Integration",
    completedDate: "November 30, 2023",
    status: "Success",
    description: "Full integration with major CRM platforms.",
    highlights: "Salesforce, HubSpot, and Zoho integrations",
  },
  {
    name: "Global Expansion - Phase 1",
    completedDate: "October 20, 2023",
    status: "Success",
    description: "Infrastructure setup for APAC and EMEA regions.",
    highlights: "5 new data centers, 99.9% uptime achieved",
  },
];

export default function PastProjects() {
  return (
    <PageLayout
      title="Past Projects"
      description="Completed projects and their outcomes."
      icon={<History className="h-5 w-5" />}
    >
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
                <Badge variant="default">{project.status}</Badge>
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
    </PageLayout>
  );
}
