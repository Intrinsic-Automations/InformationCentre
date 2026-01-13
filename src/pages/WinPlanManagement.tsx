import { Target } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

const WinPlanManagement = () => {
  return (
    <PageLayout
      title="Win Plan Management"
      icon={<Target className="h-5 w-5" />}
    >
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Win Plans</h2>
        <p className="text-muted-foreground">
          Manage and track your win plans for active sales opportunities.
        </p>
      </div>
    </PageLayout>
  );
};

export default WinPlanManagement;
