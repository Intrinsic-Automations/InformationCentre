import { Users } from "lucide-react";
import communityHubBanner from "@/assets/community-hub-banner.jpg";

export function BrandingBanner() {
  return (
    <div className="relative h-9 w-full overflow-hidden">
      <img
        src={communityHubBanner}
        alt="Community Hub banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-primary/30" />
      <div className="absolute inset-0 flex items-center justify-center gap-2">
        <Users className="h-4 w-4 text-primary-foreground" />
        <span className="text-sm font-bold text-primary-foreground tracking-wide">
          eQ UK and Europe Information Centre
        </span>
      </div>
    </div>
  );
}