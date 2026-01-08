import { Building2, ExternalLink, Globe } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sites = [
  {
    name: "Corporate Website",
    url: "www.company.com",
    description: "Main corporate website with company information and news.",
    category: "Public",
  },
  {
    name: "Customer Portal",
    url: "portal.company.com",
    description: "Customer-facing portal for account management and support.",
    category: "Customer",
  },
  {
    name: "Developer Hub",
    url: "developers.company.com",
    description: "API documentation and developer resources.",
    category: "Technical",
  },
  {
    name: "Careers Site",
    url: "careers.company.com",
    description: "Job openings and company culture information.",
    category: "Public",
  },
];

export default function CompanySites() {
  return (
    <PageLayout
      title="Company Sites"
      description="Quick access to all company websites and portals."
      icon={<Building2 className="h-5 w-5" />}
    >
      <div className="grid gap-4 md:grid-cols-2">
        {sites.map((site, index) => (
          <Card key={index} className="bg-card hover:bg-card/80 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{site.name}</CardTitle>
                  <CardDescription>{site.url}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-end justify-between gap-4">
              <p className="text-sm text-foreground/80">{site.description}</p>
              <Button variant="outline" size="sm" className="gap-2 shrink-0">
                Visit <ExternalLink className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
