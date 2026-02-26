import { Package as PackageIcon } from "lucide-react";
import { MethodPage } from "@/components/solution-centre/MethodPage";
import installationHero from "@/assets/installation-method-hero.jpg";

export default function ProductInstallationMethod() {
  return (
    <MethodPage
      methodSlug="installation"
      title="Product Installation Method"
      heroImage={installationHero}
      icon={PackageIcon}
    />
  );
}
