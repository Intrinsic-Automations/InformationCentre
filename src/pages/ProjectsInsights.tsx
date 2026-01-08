import { Lightbulb, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import projectsInsightsHero from "@/assets/projects-insights-hero.jpg";

const insights = [
  {
    project: "Enterprise Migration",
    metric: "Completion Rate",
    value: "78%",
    trend: "up",
    change: "+12%",
    description: "On track to complete ahead of schedule",
  },
  {
    project: "API Integration Suite",
    metric: "Team Velocity",
    value: "42 pts",
    trend: "stable",
    change: "0%",
    description: "Maintaining steady progress",
  },
  {
    project: "Cloud Infrastructure",
    metric: "Budget Usage",
    value: "65%",
    trend: "down",
    change: "-8%",
    description: "Under budget with optimizations",
  },
];

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-primary" />;
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-destructive" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

export default function ProjectsInsights() {
  return (
    <div className="flex flex-col h-full">
      {/* Hero Banner with Title */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={projectsInsightsHero}
          alt="Projects Insights banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Lightbulb className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-secondary-foreground">Projects Insights</h1>
              <p className="text-sm md:text-base text-secondary-foreground/80 mt-1">
                Key metrics and insights from ongoing projects.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((insight, index) => (
            <Card key={index} className="bg-card">
              <CardHeader className="pb-2">
                <CardDescription>{insight.project}</CardDescription>
                <CardTitle className="text-3xl font-bold">{insight.value}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-2">
                  <TrendIcon trend={insight.trend} />
                  <span className={`text-sm font-medium ${
                    insight.trend === "up" ? "text-primary" : 
                    insight.trend === "down" ? "text-destructive" : 
                    "text-muted-foreground"
                  }`}>
                    {insight.change}
                  </span>
                  <span className="text-sm text-muted-foreground">{insight.metric}</span>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
