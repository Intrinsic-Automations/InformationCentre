import { GraduationCap, Play, Clock, CheckCircle } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const courses = [
  {
    title: "eQ Platform Fundamentals",
    description: "Learn the core concepts and navigation of the eQ platform.",
    duration: "2 hours",
    progress: 100,
    lessons: 8,
  },
  {
    title: "Advanced eQ Configuration",
    description: "Deep dive into advanced settings and customization options.",
    duration: "3 hours",
    progress: 60,
    lessons: 12,
  },
  {
    title: "eQ Integration Best Practices",
    description: "Best practices for integrating eQ with other systems.",
    duration: "1.5 hours",
    progress: 0,
    lessons: 6,
  },
];

export default function EQTraining() {
  return (
    <PageLayout
      title="eQ Training"
      description="Master the eQ platform with comprehensive training modules."
      icon={<GraduationCap className="h-5 w-5" />}
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
