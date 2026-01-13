import { Card, CardContent } from "@/components/ui/card";
import { 
  CalendarOff, 
  ClipboardCheck, 
  Gift, 
  LogOut, 
  UserPlus, 
  FileText, 
  TrendingUp, 
  Clock, 
  Search, 
  GraduationCap 
} from "lucide-react";
import infoResourcesHero from "@/assets/generic-training-hero.jpg";

const hrTiles = [
  { title: "Absence Management", icon: CalendarOff, description: "Policies and procedures for managing employee absence" },
  { title: "Appraisals", icon: ClipboardCheck, description: "Performance review processes and templates" },
  { title: "Employee Benefits Info", icon: Gift, description: "Information about employee benefits and perks" },
  { title: "Employee Exit", icon: LogOut, description: "Offboarding procedures and exit documentation" },
  { title: "Induction", icon: UserPlus, description: "New starter onboarding and induction materials" },
  { title: "Job Descriptions", icon: FileText, description: "Role definitions and job description templates" },
  { title: "Performance Management", icon: TrendingUp, description: "Performance tracking and improvement resources" },
  { title: "Probation", icon: Clock, description: "Probation period guidelines and review processes" },
  { title: "Recruiting", icon: Search, description: "Recruitment processes and hiring guidelines" },
  { title: "Training", icon: GraduationCap, description: "Training programs and development resources" },
];

export default function InfoResources() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={infoResourcesHero}
          alt="Info & Resources banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Info & Resources</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {hrTiles.map((tile) => (
            <Card 
              key={tile.title} 
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <tile.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{tile.title}</h3>
                <p className="text-sm text-muted-foreground">{tile.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
