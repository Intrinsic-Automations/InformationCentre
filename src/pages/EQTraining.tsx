import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import analyticsSuiteImage from "@/assets/analytics-suite.jpg";
import integrationSuiteImage from "@/assets/integration-suite.jpg";
import eqTrainingHero from "@/assets/eq-training-hero.jpg";

const suites = [
  {
    title: "Analytics Suite",
    description: "Comprehensive analytics tools for data-driven insights and business intelligence.",
    image: analyticsSuiteImage,
    url: "/eq-training/analytics-suite",
  },
  {
    title: "Integration Suite",
    description: "Seamlessly connect and integrate with your existing systems and workflows.",
    image: integrationSuiteImage,
    url: "/eq-training/integration-suite",
  },
];

export default function EQTraining() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={eqTrainingHero}
          alt="eQ Training banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">eQ Training</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
          {suites.map((suite, index) => (
            <Card 
              key={index} 
              className="bg-card overflow-hidden cursor-pointer transition-shadow hover:shadow-lg"
              onClick={() => navigate(suite.url)}
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={suite.image}
                  alt={suite.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{suite.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{suite.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}