import { Building2, ExternalLink, Monitor, Receipt, Clock, Key, Users, Handshake, Globe, CalendarDays } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sites = [
  {
    name: "IT-Hub",
    url: "ithub.company.com",
    description: "Central IT service desk for support tickets, hardware requests, and technical assistance.",
    category: "Internal",
    icon: Monitor,
  },
  {
    name: "Expensify",
    url: "expensify.com",
    description: "Submit and manage expense reports, receipts, and reimbursement claims.",
    category: "Finance",
    icon: Receipt,
  },
  {
    name: "OpenAir",
    url: "openair.company.com",
    description: "Time tracking, project management, and resource allocation platform.",
    category: "Projects",
    icon: Clock,
  },
  {
    name: "License Generator",
    url: "licenses.company.com",
    description: "Generate and manage software licenses for customer deployments.",
    category: "Internal",
    icon: Key,
  },
  {
    name: "Customer Portal",
    url: "portal.company.com",
    description: "Customer-facing portal for account management, support tickets, and documentation.",
    category: "Customer",
    icon: Users,
  },
  {
    name: "SI Partner Portal",
    url: "partners.company.com",
    description: "System Integrator partner resources, certifications, and deal registration.",
    category: "Partner",
    icon: Handshake,
  },
  {
    name: "Company Website",
    url: "www.company.com",
    description: "Main corporate website with company information, products, and news.",
    category: "Public",
    icon: Globe,
  },
  {
    name: "Leave Application",
    url: "leave.company.com",
    description: "Apply for leave, view balances, and manage time-off requests.",
    category: "HR",
    icon: CalendarDays,
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
                  <site.icon className="h-5 w-5" />
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
