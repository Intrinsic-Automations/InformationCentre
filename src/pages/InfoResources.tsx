import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import infoResourcesHero from "@/assets/generic-training-hero.jpg";
import hrAbsenceManagement from "@/assets/hr-absence-management.jpg";
import hrAppraisals from "@/assets/hr-appraisals.jpg";
import hrBenefits from "@/assets/hr-benefits.jpg";
import hrEmployeeExit from "@/assets/hr-employee-exit.jpg";
import hrInduction from "@/assets/hr-induction.jpg";
import hrJobDescriptions from "@/assets/hr-job-descriptions.jpg";
import hrPerformance from "@/assets/hr-performance.jpg";
import hrProbation from "@/assets/hr-probation.jpg";
import hrRecruiting from "@/assets/hr-recruiting.jpg";
import hrTraining from "@/assets/hr-training.jpg";

const hrTiles = [
  { title: "Absence Management", image: hrAbsenceManagement, description: "Policies and procedures for managing employee absence" },
  { title: "Appraisals", image: hrAppraisals, description: "Performance review processes and templates" },
  { title: "Employee Benefits Info", image: hrBenefits, description: "Information about employee benefits and perks" },
  { title: "Employee Exit", image: hrEmployeeExit, description: "Offboarding procedures and exit documentation" },
  { title: "Induction", image: hrInduction, description: "New starter onboarding and induction materials" },
  { title: "Job Descriptions", image: hrJobDescriptions, description: "Role definitions and job description templates" },
  { title: "Performance Management", image: hrPerformance, description: "Performance tracking and improvement resources" },
  { title: "Probation", image: hrProbation, description: "Probation period guidelines and review processes" },
  { title: "Recruiting", image: hrRecruiting, description: "Recruitment processes and hiring guidelines" },
  { title: "Training", image: hrTraining, description: "Training programs and development resources" },
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
              className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative h-32 overflow-hidden">
                <img 
                  src={tile.image} 
                  alt={tile.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>
              <CardContent className="p-4 text-center">
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
