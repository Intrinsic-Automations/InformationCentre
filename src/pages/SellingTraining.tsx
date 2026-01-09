import { TrendingUp } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import consultativeImage from "@/assets/selling-consultative.jpg";
import objectionImage from "@/assets/selling-objection.jpg";
import enterpriseImage from "@/assets/selling-enterprise.jpg";
import spinImage from "@/assets/selling-spin.jpg";

const courses = [
  {
    title: "Consultative Selling",
    description: "Master the art of understanding customer needs and providing solutions.",
    image: consultativeImage,
  },
  {
    title: "Objection Handling",
    description: "Learn techniques to address and overcome common sales objections.",
    image: objectionImage,
  },
  {
    title: "Enterprise Sales Strategy",
    description: "Strategies for complex enterprise sales cycles and stakeholder management.",
    image: enterpriseImage,
  },
  {
    title: "Spin Selling",
    description: "Master the SPIN methodology: Situation, Problem, Implication, and Need-Payoff questions.",
    image: spinImage,
  },
];

export default function SellingTraining() {
  return (
    <PageLayout
      title="Sales Training"
      description="Sharpen your sales skills with expert-led training programs."
      icon={<TrendingUp className="h-5 w-5" />}
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course, index) => (
          <Card key={index} className="bg-card overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
            <div className="aspect-video overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground">{course.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
