import { 
  ArrowRightLeft, 
  CheckCircle2, 
  Download,
  Rocket,
  Search,
  PenTool,
  FileText,
  UserCheck,
  Code,
  TestTube,
  FlaskConical,
  Package,
  Wrench,
  AlertCircle,
  PackageCheck,
  HeadphonesIcon,
  FileCheck
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import migrationHero from "@/assets/migration-hero.jpg";

const timelineSteps = [
  { title: "Kick off", subItems: [], icon: Rocket, color: "bg-emerald-500" },
  { title: "Discovery Workshop", subItems: ["Requirements", "Data Profiling"], icon: Search, color: "bg-blue-500" },
  { title: "High Level Design", subItems: [], icon: PenTool, color: "bg-violet-500" },
  { title: "Low Level Design", subItems: [], icon: FileText, color: "bg-purple-500" },
  { title: "Customer Sign Off", subItems: [], icon: UserCheck, color: "bg-pink-500" },
  { title: "Development", subItems: [], icon: Code, color: "bg-orange-500" },
  { title: "Unit Testing", subItems: [], icon: TestTube, color: "bg-amber-500" },
  { title: "Testing", subItems: [], icon: FlaskConical, color: "bg-yellow-500" },
  { title: "Delivery", subItems: ["Deployment Support", "Training for customer"], icon: Package, color: "bg-lime-500" },
  { title: "SIT + VAT", subItems: [], icon: Wrench, color: "bg-green-500" },
  { title: "Fixes and Enhancements", subItems: [], icon: AlertCircle, color: "bg-teal-500" },
  { title: "Production Delivery (Go Live)", subItems: ["Validation", "Sign off"], icon: PackageCheck, color: "bg-cyan-500" },
  { title: "Identify Product Gaps", subItems: ["Support"], icon: HeadphonesIcon, color: "bg-sky-500" },
  { title: "Project Closure Document", subItems: [], icon: FileCheck, color: "bg-indigo-500" },
];

const templates = [
  "Project One-Pager",
  "Questionnaire",
  "Requirements Document",
  "Solution Outline",
  "RACI",
  "IPP Plan",
  "Risk and Issues",
  "Burn Rate Monitor",
  "Data Mapping",
  "Data Profiling",
  "High Level Design",
  "Low Level Design",
  "Infrastructure Architecture Design",
  "User Stories",
  "Test Plan",
  "Test Script",
  "Implementation Document",
  "User Guide",
  "Deployment Guide",
  "Change Request Document",
  "Project Closure Document",
];

export default function Migration() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={migrationHero}
          alt="Migration banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <ArrowRightLeft className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Migration</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* IRGT Process Notice */}
        <Card className="bg-primary/5 border-primary/20 mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm font-medium text-foreground">
                It is mandatory that all Projects must follow the <span className="text-primary font-semibold">IRGT process</span>
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Download className="h-4 w-4" />
                IRGT Planning Document
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-foreground mb-8">Solution Timeline</h2>
              <div className="relative">
                {/* Gradient vertical line */}
                <div className="absolute left-5 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 via-purple-500 to-indigo-500 rounded-full" />

                <div className="space-y-4">
                  {timelineSteps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div 
                        key={index} 
                        className="relative pl-14 group animate-fade-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {/* Icon marker */}
                        <div className={`absolute left-0 flex h-10 w-10 items-center justify-center rounded-xl ${step.color} text-white shadow-lg transition-transform duration-200 group-hover:scale-110`}>
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Content card */}
                        <div className="bg-muted/30 rounded-lg p-3 border border-border/30 transition-all duration-200 group-hover:bg-muted/50 group-hover:border-primary/30 group-hover:shadow-md">
                          <h3 className="font-semibold text-foreground">{step.title}</h3>
                          {step.subItems.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {step.subItems.map((subItem, subIndex) => (
                                <li key={subIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <CheckCircle2 className="h-3 w-3 text-primary" />
                                  {subItem}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card h-fit">
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold text-foreground mb-6">Migration Templates</h2>
              <ul className="space-y-2">
                {templates.map((template, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="flex items-center justify-between gap-2 text-sm text-foreground hover:text-primary transition-colors py-1 group"
                    >
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        {template}
                      </span>
                      <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}