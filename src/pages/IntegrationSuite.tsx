import { Plug } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import adminImage from "@/assets/integration-admin.jpg";
import foundationImage from "@/assets/integration-foundation.jpg";
import advancedImage from "@/assets/integration-advanced.jpg";

const modules = [
  {
    title: "Admin",
    description: "Administrative tools and system integration management.",
    image: adminImage,
  },
  {
    title: "Foundation",
    description: "Core fundamentals and essential integration concepts.",
    image: foundationImage,
  },
  {
    title: "Advanced",
    description: "Advanced integration techniques and API workflows.",
    image: advancedImage,
  },
];

export default function IntegrationSuite() {
  return (
    <PageLayout
      title="Integration Suite"
      description="Seamlessly connect and integrate with your existing systems and workflows."
      icon={<Plug className="h-5 w-5" />}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
