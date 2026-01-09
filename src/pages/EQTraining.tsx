import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import analyticsSuiteImage from "@/assets/analytics-suite.jpg";
import integrationSuiteImage from "@/assets/integration-suite.jpg";

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
    <PageLayout
      title="eQ Training"
      description="Master the eQ platform with comprehensive training modules."
      icon={<GraduationCap className="h-5 w-5" />}
    >
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
    </PageLayout>
  );
}
