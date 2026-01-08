import { Lightbulb, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    <PageLayout
      title="Projects Insights"
      description="Key metrics and insights from ongoing projects."
      icon={<Lightbulb className="h-5 w-5" />}
    >
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
    </PageLayout>
  );
}
