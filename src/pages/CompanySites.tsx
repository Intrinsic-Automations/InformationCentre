import { Building2, ExternalLink, Monitor, Receipt, Clock, Key, Users, Handshake, Globe, CalendarDays } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import companySitesHero from "@/assets/company-sites-hero.jpg";

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
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={companySitesHero}
          alt="Company Sites banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Company Sites</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto">
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
      </div>
    </div>
  );
}