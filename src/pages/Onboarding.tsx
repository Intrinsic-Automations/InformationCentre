import { Home, CheckCircle2, ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const onboardingSteps = [
  {
    title: "Complete Your Profile",
    description: "Add your photo, bio, and contact information to help others connect with you.",
    completed: true,
  },
  {
    title: "Join Your Regional Chat",
    description: "Connect with team members in your region for local updates and discussions.",
    completed: true,
  },
  {
    title: "Explore Training Resources",
    description: "Browse our comprehensive training materials to get up to speed quickly.",
    completed: false,
  },
  {
    title: "Introduce Yourself",
    description: "Share a bit about yourself in the Introductions channel.",
    completed: false,
  },
];

export default function Onboarding() {
  return (
    <PageLayout
      title="Onboarding"
      description="Welcome to the Community Hub! Complete these steps to get started."
      icon={<Home className="h-5 w-5" />}
    >
      <div className="max-w-3xl space-y-6">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl">Welcome to the Team! 🎉</CardTitle>
            <CardDescription>
              We're excited to have you here. Follow these steps to get the most out of our community.
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {onboardingSteps.map((step, index) => (
            <Card key={index} className={step.completed ? "bg-card/50" : "bg-card"}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  step.completed 
                    ? "bg-primary/20 text-primary" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {step.completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-medium ${step.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {!step.completed && (
                  <Button size="sm" className="gap-2">
                    Start <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Need help? Reach out in any of our chat channels or check the Resources section.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
