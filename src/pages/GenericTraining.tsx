import { BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

import communicationImage from "@/assets/generic-communication.jpg";
import timeImage from "@/assets/generic-time.jpg";
import leadershipImage from "@/assets/generic-leadership.jpg";
import vmodelImage from "@/assets/generic-vmodel.jpg";
import assertionImage from "@/assets/generic-assertion.jpg";
import genericTrainingHero from "@/assets/generic-training-hero.jpg";

const courses = [
  {
    slug: "effective-communication",
    title: "Effective Communication",
    description: "Enhance your written and verbal communication skills.",
    image: communicationImage,
  },
  {
    slug: "time-management-mastery",
    title: "Time Management Mastery",
    description: "Learn to prioritize tasks and manage your time effectively.",
    image: timeImage,
  },
  {
    slug: "leadership-fundamentals",
    title: "Leadership Fundamentals",
    description: "Core leadership skills for emerging and experienced leaders.",
    image: leadershipImage,
  },
  {
    slug: "v-model",
    title: "V-Model",
    description: "Learn the V-Model software development methodology for verification and validation.",
    image: vmodelImage,
  },
  {
    slug: "assertion-skills",
    title: "Assertion Skills",
    description: "Develop confidence and assertiveness in professional communication and interactions.",
    image: assertionImage,
  },
];

export default function GenericTraining() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={genericTrainingHero}
          alt="Generic Training banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Generic Training</h1>
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
              onClick={() => navigate(`/training/generic/${course.slug}`)}
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