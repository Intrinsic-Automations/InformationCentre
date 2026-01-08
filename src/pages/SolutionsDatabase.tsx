import { Database, Search, Filter } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const solutions = [
  {
    name: "Cloud Migration Suite",
    category: "Migration",
    tags: ["AWS", "Azure", "GCP"],
    description: "End-to-end cloud migration toolkit for enterprise workloads.",
  },
  {
    name: "API Integration Framework",
    category: "Integration",
    tags: ["REST", "GraphQL", "SOAP"],
    description: "Unified framework for building and managing API integrations.",
  },
  {
    name: "Analytics Platform",
    category: "Data",
    tags: ["BI", "Reporting", "Dashboards"],
    description: "Comprehensive analytics and business intelligence platform.",
  },
  {
    name: "Security Compliance Kit",
    category: "Security",
    tags: ["SOC2", "GDPR", "HIPAA"],
    description: "Tools and templates for maintaining security compliance.",
  },
];

export default function SolutionsDatabase() {
  return (
    <PageLayout
      title="Solutions Database"
      description="Browse and search our library of solutions and tools."
      icon={<Database className="h-5 w-5" />}
    >
      <div className="max-w-4xl space-y-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search solutions..." className="pl-10" />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {solutions.map((solution, index) => (
            <Card key={index} className="bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{solution.name}</CardTitle>
                    <CardDescription>{solution.category}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 mb-3">{solution.description}</p>
                <div className="flex flex-wrap gap-1">
                  {solution.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
