import { BookOpen, Play, Clock, CheckCircle } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const courses = [
  {
    title: "Effective Communication",
    description: "Enhance your written and verbal communication skills.",
    duration: "2 hours",
    progress: 100,
    lessons: 10,
  },
  {
    title: "Time Management Mastery",
    description: "Learn to prioritize tasks and manage your time effectively.",
    duration: "1.5 hours",
    progress: 80,
    lessons: 6,
  },
  {
    title: "Leadership Fundamentals",
    description: "Core leadership skills for emerging and experienced leaders.",
    duration: "3 hours",
    progress: 25,
    lessons: 12,
  },
];

export default function GenericTraining() {
  return (
    <PageLayout
      title="Generic Training"
      description="Professional development courses for all team members."
      icon={<BookOpen className="h-5 w-5" />}
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
