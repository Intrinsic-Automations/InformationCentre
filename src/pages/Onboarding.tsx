import { Home, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import onboardingHero from "@/assets/onboarding-hero.jpg";

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
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={onboardingHero}
          alt="Onboarding banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Home className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Onboarding</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
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
      </div>
    </div>
  );
}