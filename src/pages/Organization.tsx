import { Network, Users, ChevronRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const departments = [
  {
    name: "Engineering",
    head: "John Smith",
    initials: "JS",
    teamSize: 45,
    teams: ["Frontend", "Backend", "DevOps", "QA"],
  },
  {
    name: "Sales",
    head: "Maria Garcia",
    initials: "MG",
    teamSize: 32,
    teams: ["Enterprise", "SMB", "Partnerships"],
  },
  {
    name: "Product",
    head: "Sarah Johnson",
    initials: "SJ",
    teamSize: 18,
    teams: ["Product Management", "Design", "Research"],
  },
  {
    name: "Operations",
    head: "David Kumar",
    initials: "DK",
    teamSize: 25,
    teams: ["Customer Success", "Support", "Implementation"],
  },
];

export default function Organization() {
  return (
    <PageLayout
      title="Organization"
      description="Explore our organizational structure and teams."
      icon={<Network className="h-5 w-5" />}
    >
      <div className="max-w-4xl space-y-4">
        {departments.map((dept, index) => (
          <Card key={index} className="bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {dept.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">Led by {dept.head}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">{dept.teamSize} members</span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {dept.teams.map((team, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-muted rounded-full text-sm text-muted-foreground"
                  >
                    {team}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
