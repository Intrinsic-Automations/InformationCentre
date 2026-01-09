import { Plug } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

export default function IntegrationSuite() {
  return (
    <PageLayout
      title="Integration Suite"
      description="Seamlessly connect and integrate with your existing systems and workflows."
      icon={<Plug className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Explore the Integration Suite training modules and resources.
        </p>
      </div>
    </PageLayout>
  );
}
