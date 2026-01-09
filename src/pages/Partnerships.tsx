import { Handshake, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import partnershipsHero from "@/assets/partnerships-hero.jpg";

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
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={partnershipsHero}
          alt="Partnerships banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Handshake className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Partnerships</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
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
      </div>
    </div>
  );
}
