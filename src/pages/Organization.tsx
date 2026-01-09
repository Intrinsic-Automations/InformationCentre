import { Network, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import organizationHero from "@/assets/organization-hero.jpg";

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
  CEO: "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30",
  VP: "bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-500/30",
  Head: "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30",
  Senior: "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  Lead: "bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30",
  Developer: "bg-slate-500/20 text-slate-700 dark:text-slate-400 border-slate-500/30",
};

const levelBorderColors: Record<Employee["level"], string> = {
  CEO: "border-amber-500",
  VP: "border-purple-500",
  Head: "border-blue-500",
  Senior: "border-emerald-500",
  Lead: "border-orange-500",
  Developer: "border-slate-500",
};

function EmployeeCard({ employee }: { employee: Employee }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`bg-card border-2 ${levelBorderColors[employee.level]} rounded-lg p-3 min-w-[180px] max-w-[200px] shadow-sm hover:shadow-md transition-shadow cursor-pointer`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {employee.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm text-foreground truncate">{employee.name}</p>
                <Badge variant="secondary" className={`${levelColors[employee.level]} text-[10px] px-1.5 py-0`}>
                  {employee.level}
                </Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground truncate">{employee.role}</p>
            {employee.reportsTo && (
              <p className="text-[10px] text-muted-foreground/70 mt-1 truncate">
                <User className="h-2.5 w-2.5 inline mr-0.5" />
                → {employee.reportsTo}
              </p>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-[250px]">
          <div className="space-y-1">
            <p className="font-medium">{employee.name}</p>
            <p className="text-xs text-muted-foreground">{employee.role}</p>
            {employee.reportsTo && (
              <p className="text-xs">Reports to: {employee.reportsTo}</p>
            )}
            <div className="flex flex-wrap gap-1 pt-1">
              {employee.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 bg-muted rounded text-[10px]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function OrgTreeNode({ employee }: { employee: Employee }) {
  const hasReports = employee.directReports && employee.directReports.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Employee card */}
      <EmployeeCard employee={employee} />

      {/* Connector and children */}
      {hasReports && (
        <div className="flex flex-col items-center">
          {/* Vertical line from card to children */}
          <div className="w-0.5 h-6 bg-border" />
          
          {/* Children row */}
          <div className="flex relative">
            {/* Horizontal line connecting children */}
            {employee.directReports!.length > 1 && (
              <div
                className="absolute top-0 h-0.5 bg-border"
                style={{
                  left: '50%',
                  width: `calc(100% - 180px)`,
                  transform: 'translateX(-50%)',
                }}
              />
            )}
            
            {employee.directReports!.map((report) => (
              <div key={report.id} className="flex flex-col items-center relative px-2">
                {/* Vertical connector to child */}
                <div className="w-0.5 h-4 bg-border" />
                <OrgTreeNode employee={report} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Organization() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={organizationHero}
          alt="Organization banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Network className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Organization</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(levelColors).map(([level, colorClass]) => (
              <Badge key={level} variant="secondary" className={colorClass}>
                {level}
              </Badge>
            ))}
          </div>
          
          {/* Scrollable org chart - both directions */}
          <ScrollArea className="w-full h-[calc(100vh-280px)]">
            <div className="p-4 min-w-max flex justify-center">
              <OrgTreeNode employee={orgData} />
            </div>
            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
