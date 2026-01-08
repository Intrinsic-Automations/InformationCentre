import { Users } from "lucide-react";
import communityHubBanner from "@/assets/community-hub-banner.jpg";

export function BrandingBanner() {
  return (
    <div className="relative h-14 w-full overflow-hidden">
      <img
        src={communityHubBanner}
        alt="Community Hub banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-primary/30" />
      <div className="absolute inset-0 flex items-center justify-center gap-3">
        <Users className="h-5 w-5 text-primary-foreground" />
        <span className="text-lg font-bold text-primary-foreground tracking-wide">
          Community Hub
        </span>
      </div>
    </div>
  );
}