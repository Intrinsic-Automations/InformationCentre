import { History, Construction } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import pastProjectsHero from "@/assets/past-projects-hero.jpg";

export default function PastProjects() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img src={pastProjectsHero} alt="Past Projects banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <History className="h-4 w-4" />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Past Projects</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
          <Card className="bg-card w-full max-w-lg">
            <CardContent className="py-12 px-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
                  <Construction className="h-8 w-8 text-amber-500" />
                </div>
              </div>
              <h2 className="text-xl font-semibold text-foreground">Under Construction</h2>
              <p className="text-sm text-muted-foreground">
                This page is currently being developed. It will integrate with external systems to display historical project data.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
