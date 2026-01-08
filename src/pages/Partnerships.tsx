import { Handshake, ExternalLink } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const partnerships = [
  {
    partner: "TechCorp Solutions",
    type: "Technology",
    status: "Active",
    description: "Strategic partnership for cloud infrastructure and DevOps solutions.",
    since: "2023",
  },
  {
    partner: "GlobalConsult Inc",
    type: "Consulting",
    status: "Active",
    description: "Collaboration on enterprise digital transformation projects.",
    since: "2022",
  },
  {
    partner: "DataFlow Analytics",
    type: "Data",
    status: "Pending",
    description: "Exploring partnership for advanced analytics and BI solutions.",
    since: "2024",
  },
];

export default function Partnerships() {
  return (
    <PageLayout
      title="Partnerships"
      description="Explore our strategic partnerships and collaborations."
      icon={<Handshake className="h-5 w-5" />}
    >
      <div className="max-w-3xl space-y-4">
        {partnerships.map((partner, index) => (
          <Card key={index} className="bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{partner.partner}</CardTitle>
                  <CardDescription>Partner since {partner.since}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={partner.status === "Active" ? "default" : "secondary"}>
                    {partner.status}
                  </Badge>
                  <Badge variant="outline">{partner.type}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex items-end justify-between gap-4">
              <p className="text-sm text-foreground/80">{partner.description}</p>
              <Button variant="ghost" size="sm" className="gap-2 shrink-0">
                Details <ExternalLink className="h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
