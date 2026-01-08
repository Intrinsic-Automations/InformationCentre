import { ArrowRightLeft, FileText, Download } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const resources = [
  {
    title: "Migration Planning Guide",
    description: "Comprehensive guide for planning and executing data migrations.",
    type: "PDF",
    updated: "January 2024",
  },
  {
    title: "Legacy System Assessment Template",
    description: "Template for assessing current systems before migration.",
    type: "XLSX",
    updated: "December 2023",
  },
  {
    title: "Data Mapping Toolkit",
    description: "Tools and templates for mapping data between systems.",
    type: "ZIP",
    updated: "January 2024",
  },
];

export default function Migration() {
  return (
    <PageLayout
      title="Migration"
      description="Resources and tools for system migrations."
      icon={<ArrowRightLeft className="h-5 w-5" />}
    >
      <div className="max-w-3xl space-y-4">
        {resources.map((resource, index) => (
          <Card key={index} className="bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{resource.type}</Badge>
                <span className="text-xs text-muted-foreground">Updated {resource.updated}</span>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" /> Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
