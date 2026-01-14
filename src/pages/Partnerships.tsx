import { useState } from "react";
import { Handshake, ExternalLink, Building2, Calendar, FileText, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import partnershipsHero from "@/assets/partnerships-hero.jpg";

interface Partnership {
  partner: string;
  type: string;
  status: string;
  description: string;
  since: string;
  contact?: string;
  email?: string;
  keyBenefits?: string[];
  focusAreas?: string[];
}

const partnerships: Partnership[] = [
  {
    partner: "TechCorp Solutions",
    type: "Technology",
    status: "Active",
    description: "Strategic partnership for cloud infrastructure and DevOps solutions.",
    since: "2023",
    contact: "John Smith",
    email: "john.smith@techcorp.com",
    keyBenefits: [
      "Access to enterprise cloud infrastructure",
      "Shared DevOps expertise and tooling",
      "Joint go-to-market opportunities",
    ],
    focusAreas: ["Cloud Migration", "Infrastructure as Code", "CI/CD Pipelines"],
  },
  {
    partner: "GlobalConsult Inc",
    type: "Consulting",
    status: "Active",
    description: "Collaboration on enterprise digital transformation projects.",
    since: "2022",
    contact: "Sarah Johnson",
    email: "s.johnson@globalconsult.com",
    keyBenefits: [
      "Extended consulting reach",
      "Complementary service offerings",
      "Shared client portfolio",
    ],
    focusAreas: ["Digital Transformation", "Change Management", "Process Optimization"],
  },
  {
    partner: "DataFlow Analytics",
    type: "Data",
    status: "Pending",
    description: "Exploring partnership for advanced analytics and BI solutions.",
    since: "2024",
    contact: "Michael Chen",
    email: "m.chen@dataflow.io",
    keyBenefits: [
      "Advanced analytics capabilities",
      "Machine learning integration",
      "Real-time data processing",
    ],
    focusAreas: ["Business Intelligence", "Predictive Analytics", "Data Visualization"],
  },
];

export default function Partnerships() {
  const [selectedPartnership, setSelectedPartnership] = useState<Partnership | null>(null);

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-2 shrink-0"
                  onClick={() => setSelectedPartnership(partner)}
                >
                  Details <ExternalLink className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Partnership Details Dialog */}
      <Dialog open={!!selectedPartnership} onOpenChange={(open) => !open && setSelectedPartnership(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle>{selectedPartnership?.partner}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <Calendar className="h-3 w-3" />
                  Partner since {selectedPartnership?.since}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Badge variant={selectedPartnership?.status === "Active" ? "default" : "secondary"}>
                {selectedPartnership?.status}
              </Badge>
              <Badge variant="outline">{selectedPartnership?.type}</Badge>
            </div>

            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">Overview</h4>
              <p className="text-sm text-muted-foreground">{selectedPartnership?.description}</p>
            </div>

            <Separator />

            {selectedPartnership?.contact && (
              <div className="flex items-start gap-3">
                <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-foreground">Primary Contact</h4>
                  <p className="text-sm text-muted-foreground">{selectedPartnership.contact}</p>
                  {selectedPartnership.email && (
                    <a 
                      href={`mailto:${selectedPartnership.email}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {selectedPartnership.email}
                    </a>
                  )}
                </div>
              </div>
            )}

            {selectedPartnership?.keyBenefits && (
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Key Benefits</h4>
                  <ul className="space-y-1">
                    {selectedPartnership.keyBenefits.map((benefit, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {selectedPartnership?.focusAreas && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Focus Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPartnership.focusAreas.map((area, i) => (
                    <Badge key={i} variant="secondary">{area}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
