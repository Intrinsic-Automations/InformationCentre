import { FolderKanban } from "lucide-react";
import { MethodPage } from "@/components/solution-centre/MethodPage";
import migrationMethodHero from "@/assets/migration-method-hero.jpg";

export default function ProjectExecution() {
  return (
    <MethodPage
      methodSlug="migration"
      title="Migration Method"
      heroImage={migrationMethodHero}
      icon={FolderKanban}
    />
  );
}
