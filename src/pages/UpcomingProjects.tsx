import { Calendar, Users, ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const projects = [
  {
    name: "Customer Portal Redesign",
    startDate: "February 1, 2024",
    team: ["JW", "EZ", "MG"],
    priority: "High",
    description: "Complete redesign of the customer-facing portal with improved UX.",
  },
  {
    name: "Data Analytics Dashboard",
    startDate: "February 15, 2024",
    team: ["AC", "PS"],
    priority: "Medium",
    description: "New analytics dashboard for real-time business insights.",
  },
  {
    name: "Mobile App v2.0",
    startDate: "March 1, 2024",
    team: ["RM", "SL", "HM", "DK"],
    priority: "High",
    description: "Major update to the mobile application with new features.",
  },
];

export default function UpcomingProjects() {
  return (
    <PageLayout
      title="Upcoming Projects"
      description="Projects scheduled to start soon."
      icon={<Calendar className="h-5 w-5" />}
    >
      <div className="max-w-3xl space-y-4">
        {projects.map((project, index) => (
          <Card key={index} className="bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>Starts {project.startDate}</CardDescription>
                </div>
                <Badge variant={project.priority === "High" ? "default" : "secondary"}>
                  {project.priority}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 mb-4">{project.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div className="flex -space-x-2">
                    {project.team.map((member, i) => (
                      <Avatar key={i} className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {member}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-2">
                  Details <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
