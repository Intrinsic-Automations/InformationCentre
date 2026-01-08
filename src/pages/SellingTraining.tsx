import { TrendingUp, Play, Clock, CheckCircle } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const courses = [
  {
    title: "Consultative Selling",
    description: "Master the art of understanding customer needs and providing solutions.",
    duration: "4 hours",
    progress: 100,
    lessons: 15,
  },
  {
    title: "Objection Handling",
    description: "Learn techniques to address and overcome common sales objections.",
    duration: "2 hours",
    progress: 45,
    lessons: 8,
  },
  {
    title: "Enterprise Sales Strategy",
    description: "Strategies for complex enterprise sales cycles and stakeholder management.",
    duration: "5 hours",
    progress: 0,
    lessons: 20,
  },
];

export default function SellingTraining() {
  return (
    <PageLayout
      title="Selling Training"
      description="Sharpen your sales skills with expert-led training programs."
      icon={<TrendingUp className="h-5 w-5" />}
    >
      <div className="max-w-3xl space-y-4">
        {courses.map((course, index) => (
          <Card key={index} className="bg-card">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{course.title}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </div>
                {course.progress === 100 ? (
                  <CheckCircle className="h-5 w-5 text-primary" />
                ) : (
                  <Button size="sm" className="gap-2">
                    <Play className="h-3 w-3" /> {course.progress > 0 ? "Continue" : "Start"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {course.duration}
                </span>
                <span>{course.lessons} lessons</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
}
