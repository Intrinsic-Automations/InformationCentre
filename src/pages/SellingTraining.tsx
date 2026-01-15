import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

import consultativeImage from "@/assets/selling-consultative.jpg";
import objectionImage from "@/assets/selling-objection.jpg";
import enterpriseImage from "@/assets/selling-enterprise.jpg";
import spinImage from "@/assets/selling-spin.jpg";
import salesTrainingHero from "@/assets/sales-training-hero.jpg";

const courses = [
  {
    slug: "consultative-selling",
    title: "Consultative Selling",
    description: "Master the art of understanding customer needs and providing solutions.",
    image: consultativeImage,
  },
  {
    slug: "objection-handling",
    title: "Objection Handling",
    description: "Learn techniques to address and overcome common sales objections.",
    image: objectionImage,
  },
  {
    slug: "enterprise-sales-strategy",
    title: "Enterprise Sales Strategy",
    description: "Strategies for complex enterprise sales cycles and stakeholder management.",
    image: enterpriseImage,
  },
  {
    slug: "spin-selling",
    title: "Spin Selling",
    description: "Master the SPIN methodology: Situation, Problem, Implication, and Need-Payoff questions.",
    image: spinImage,
  },
];

export default function SellingTraining() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={salesTrainingHero}
          alt="Sales Training banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Sales Training</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course) => (
            <Card 
              key={course.slug} 
              className="bg-card overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/training/sales/${course.slug}`)}
            >
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
      </div>
    </div>
  );
}