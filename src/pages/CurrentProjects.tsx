import { Clock, Users, ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const projects = [
  {
    name: "Enterprise Migration",
    deadline: "January 31, 2024",
    team: ["JW", "AC", "MG"],
    progress: 78,
    description: "Migrating enterprise clients to the new platform.",
  },
  {
    name: "API Gateway Implementation",
    deadline: "February 14, 2024",
    team: ["EZ", "RM"],
    progress: 45,
    description: "Building a unified API gateway for all services.",
  },
  {
    name: "Security Audit",
    deadline: "January 25, 2024",
    team: ["PS", "HM", "SL"],
    progress: 90,
    description: "Comprehensive security review and compliance audit.",
  },
];

export default function CurrentProjects() {
  return (
    <PageLayout
      title="Current Projects"
      description="Active projects in progress."
      icon={<Clock className="h-5 w-5" />}
    >
      <div className="max-w-3xl space-y-4">
        {projects.map((project, index) => (
          <Card key={index} className="bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>Due {project.deadline}</CardDescription>
                </div>
                <span className="text-2xl font-bold text-primary">{project.progress}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 mb-4">{project.description}</p>
              <Progress value={project.progress} className="h-2 mb-4" />
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
