import { Wrench, Code, ExternalLink } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const integrations = [
  {
    name: "REST API Documentation",
    description: "Complete API reference for all integration endpoints.",
    status: "Latest",
    version: "v3.2",
  },
  {
    name: "Webhook Configuration Guide",
    description: "Set up and manage webhooks for real-time data sync.",
    status: "Latest",
    version: "v2.1",
  },
  {
    name: "SSO Integration Kit",
    description: "Single Sign-On integration resources and code samples.",
    status: "Updated",
    version: "v1.5",
  },
];

export default function Integration() {
  return (
    <PageLayout
      title="Integration"
      description="API documentation and integration resources."
      icon={<Wrench className="h-5 w-5" />}
    >
      <div className="max-w-3xl space-y-4">
        {integrations.map((integration, index) => (
          <Card key={index} className="bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <Code className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <CardDescription>{integration.description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="default">{integration.status}</Badge>
                <span className="text-xs text-muted-foreground">{integration.version}</span>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                View Docs <ExternalLink className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
