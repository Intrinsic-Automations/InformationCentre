import { BarChart3 } from "lucide-react";
import { MethodPage } from "@/components/solution-centre/MethodPage";
import analyticsHero from "@/assets/analytics-suite-hero.jpg";

export default function ReportingAnalyticsMethod() {
  return (
    <MethodPage
      methodSlug="reporting-analytics"
      title="Reporting & Analytics Method"
      heroImage={analyticsHero}
      icon={BarChart3}
    />
  );
}
