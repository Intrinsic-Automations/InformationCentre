import { BarChart3 } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

export default function AnalyticsSuite() {
  return (
    <PageLayout
      title="Analytics Suite"
      description="Comprehensive analytics tools for data-driven insights and business intelligence."
      icon={<BarChart3 className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Explore the Analytics Suite training modules and resources.
        </p>
      </div>
    </PageLayout>
  );
}
