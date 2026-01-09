import { BarChart3 } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import adaImage from "@/assets/analytics-ada.jpg";
import adminImage from "@/assets/analytics-admin.jpg";
import foundationImage from "@/assets/analytics-foundation.jpg";
import advancedImage from "@/assets/analytics-advanced.jpg";

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
  return (
    <PageLayout
      title="Analytics Suite"
      description="Comprehensive analytics tools for data-driven insights and business intelligence."
      icon={<BarChart3 className="h-5 w-5" />}
    >
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
    </PageLayout>
  );
}
