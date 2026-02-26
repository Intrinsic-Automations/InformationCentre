import { Wrench } from "lucide-react";
import { MethodPage } from "@/components/solution-centre/MethodPage";
import integrationHero from "@/assets/integration-hero.jpg";

export default function IntegrationMethod() {
  return (
    <MethodPage
      methodSlug="integration"
      title="Integration Method"
      heroImage={integrationHero}
      icon={Wrench}
    />
  );
}
