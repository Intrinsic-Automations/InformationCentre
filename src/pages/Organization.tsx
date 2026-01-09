import { Network, ChevronDown, ChevronRight, User } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Employee {
  id: string;
  name: string;
  role: string;
  level: "CEO" | "VP" | "Head" | "Senior" | "Lead" | "Developer";
  reportsTo: string | null;
  skills: string[];
  initials: string;
  directReports?: Employee[];
}

const orgData: Employee = {
  id: "1",
  name: "Alexandra Chen",
  role: "Chief Executive Officer",
  level: "CEO",
  reportsTo: null,
  skills: ["Strategic Leadership", "Business Development", "Stakeholder Management"],
  initials: "AC",
  directReports: [
    {
      id: "2",
      name: "Marcus Williams",
      role: "VP of Engineering",
      level: "VP",
      reportsTo: "Alexandra Chen",
      skills: ["Technical Architecture", "Team Building", "Agile Methodologies"],
      initials: "MW",
      directReports: [
        {
          id: "5",
          name: "Sarah Johnson",
          role: "Head of Product Development",
          level: "Head",
          reportsTo: "Marcus Williams",
          skills: ["Product Strategy", "UX Design", "Cross-functional Leadership"],
          initials: "SJ",
          directReports: [
            {
              id: "9",
              name: "David Park",
              role: "Senior Software Architect",
              level: "Senior",
              reportsTo: "Sarah Johnson",
              skills: ["System Design", "Cloud Architecture", "Performance Optimization"],
              initials: "DP",
              directReports: [
                {
                  id: "13",
                  name: "Emily Torres",
                  role: "Team Lead - Frontend",
                  level: "Lead",
                  reportsTo: "David Park",
                  skills: ["React", "TypeScript", "Design Systems"],
                  initials: "ET",
                  directReports: [
                    {
                      id: "17",
                      name: "James Liu",
                      role: "Senior Developer",
                      level: "Developer",
                      reportsTo: "Emily Torres",
                      skills: ["React", "Next.js", "Testing"],
                      initials: "JL",
                    },
                    {
                      id: "18",
                      name: "Priya Sharma",
                      role: "Developer",
                      level: "Developer",
                      reportsTo: "Emily Torres",
                      skills: ["JavaScript", "CSS", "Accessibility"],
                      initials: "PS",
                    },
                  ],
                },
                {
                  id: "14",
                  name: "Michael Brown",
                  role: "Team Lead - Backend",
                  level: "Lead",
                  reportsTo: "David Park",
                  skills: ["Node.js", "PostgreSQL", "Microservices"],
                  initials: "MB",
                  directReports: [
                    {
                      id: "19",
                      name: "Ana Rodriguez",
                      role: "Senior Developer",
                      level: "Developer",
                      reportsTo: "Michael Brown",
                      skills: ["Python", "APIs", "Database Design"],
                      initials: "AR",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "6",
          name: "Kevin O'Brien",
          role: "Head of DevOps",
          level: "Head",
          reportsTo: "Marcus Williams",
          skills: ["CI/CD", "Kubernetes", "Infrastructure as Code"],
          initials: "KO",
          directReports: [
            {
              id: "10",
              name: "Lisa Chang",
              role: "Senior DevOps Engineer",
              level: "Senior",
              reportsTo: "Kevin O'Brien",
              skills: ["AWS", "Terraform", "Monitoring"],
              initials: "LC",
            },
          ],
        },
      ],
    },
    {
      id: "3",
      name: "Rachel Foster",
      role: "VP of Sales",
      level: "VP",
      reportsTo: "Alexandra Chen",
      skills: ["Enterprise Sales", "Negotiation", "Client Relations"],
      initials: "RF",
      directReports: [
        {
          id: "7",
          name: "Thomas Wright",
          role: "Head of Enterprise Sales",
          level: "Head",
          reportsTo: "Rachel Foster",
          skills: ["Account Management", "Solution Selling", "CRM"],
          initials: "TW",
          directReports: [
            {
              id: "11",
              name: "Jennifer Adams",
              role: "Senior Account Executive",
              level: "Senior",
              reportsTo: "Thomas Wright",
              skills: ["B2B Sales", "Presentations", "Pipeline Management"],
              initials: "JA",
            },
          ],
        },
      ],
    },
    {
      id: "4",
      name: "Daniel Kumar",
      role: "VP of Operations",
      level: "VP",
      reportsTo: "Alexandra Chen",
      skills: ["Process Optimization", "Resource Planning", "Quality Assurance"],
      initials: "DK",
      directReports: [
        {
          id: "8",
          name: "Maria Garcia",
          role: "Head of Customer Success",
          level: "Head",
          reportsTo: "Daniel Kumar",
          skills: ["Customer Retention", "Onboarding", "Support Strategy"],
          initials: "MG",
          directReports: [
            {
              id: "12",
              name: "Robert Kim",
              role: "Senior Customer Success Manager",
              level: "Senior",
              reportsTo: "Maria Garcia",
              skills: ["Account Health", "Training", "Escalation Management"],
              initials: "RK",
              directReports: [
                {
                  id: "15",
                  name: "Sophie Anderson",
                  role: "Team Lead - Support",
                  level: "Lead",
                  reportsTo: "Robert Kim",
                  skills: ["Technical Support", "Team Coaching", "Documentation"],
                  initials: "SA",
                  directReports: [
                    {
                      id: "20",
                      name: "Chris Taylor",
                      role: "Support Specialist",
                      level: "Developer",
                      reportsTo: "Sophie Anderson",
                      skills: ["Troubleshooting", "Communication", "Ticketing"],
                      initials: "CT",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const levelColors: Record<Employee["level"], string> = {
  CEO: "bg-amber-500/20 text-amber-700 dark:text-amber-400",
  VP: "bg-purple-500/20 text-purple-700 dark:text-purple-400",
  Head: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
  Senior: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400",
  Lead: "bg-orange-500/20 text-orange-700 dark:text-orange-400",
  Developer: "bg-slate-500/20 text-slate-700 dark:text-slate-400",
};

function EmployeeNode({ employee, depth = 0 }: { employee: Employee; depth?: number }) {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const hasReports = employee.directReports && employee.directReports.length > 0;

  return (
    <div className="relative">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <Card className="bg-card mb-2 transition-all hover:shadow-md">
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {employee.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-foreground">{employee.name}</span>
                  <Badge variant="secondary" className={levelColors[employee.level]}>
                    {employee.level}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{employee.role}</p>
                {employee.reportsTo && (
                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    <User className="h-3 w-3 inline mr-1" />
                    Reports to: {employee.reportsTo}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {employee.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-muted rounded text-xs text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              {hasReports && (
                <CollapsibleTrigger asChild>
                  <button className="p-1 hover:bg-muted rounded transition-colors shrink-0">
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                </CollapsibleTrigger>
              )}
            </div>
          </CardContent>
        </Card>
        
        {hasReports && (
          <CollapsibleContent>
            <div className="ml-6 pl-4 border-l-2 border-border/50">
              {employee.directReports!.map((report) => (
                <EmployeeNode key={report.id} employee={report} depth={depth + 1} />
              ))}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}

export default function Organization() {
  return (
    <PageLayout
      title="Organization"
      description="Explore our organizational structure and team hierarchy."
      icon={<Network className="h-5 w-5" />}
    >
      <div className="max-w-3xl">
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(levelColors).map(([level, colorClass]) => (
            <Badge key={level} variant="secondary" className={colorClass}>
              {level}
            </Badge>
          ))}
        </div>
        <EmployeeNode employee={orgData} />
      </div>
    </PageLayout>
  );
}
