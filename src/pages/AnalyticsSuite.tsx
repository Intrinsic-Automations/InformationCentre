import { BarChart3, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import adaImage from "@/assets/analytics-ada.jpg";
import adminImage from "@/assets/analytics-admin.jpg";
import foundationImage from "@/assets/analytics-foundation.jpg";
import advancedImage from "@/assets/analytics-advanced.jpg";
import analyticsSuiteHero from "@/assets/analytics-suite-hero.jpg";

const modules = [
  {
    title: "ADA",
    description: "Learn about ADA compliance and accessibility in analytics.",
    image: adaImage,
  },
  {
    title: "Admin",
    description: "Administrative tools and user management training.",
    image: adminImage,
  },
  {
    title: "Foundation",
    description: "Core fundamentals and essential analytics concepts.",
    image: foundationImage,
  },
  {
    title: "Advanced",
    description: "Advanced analytics techniques and data visualization.",
    image: advancedImage,
  },
];

export default function AnalyticsSuite() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title and Back Button - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={analyticsSuiteHero}
          alt="Analytics Suite banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <Button
            variant="ghost"
            size="sm"
            className="mr-3 text-secondary-foreground hover:bg-secondary/40"
            onClick={() => navigate("/eq-training")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Analytics Suite</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((module, index) => (
            <Card key={index} className="bg-card overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={module.image} 
                  alt={module.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{module.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{module.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}