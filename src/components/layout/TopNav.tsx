import { NavLink } from "@/components/NavLink";
import { ProfileMenu } from "@/components/profile/ProfileMenu";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { GraduationCap, Building2, FileText } from "lucide-react";

const topNavItems = [
  { title: "eQ Training", url: "/eq-training", icon: GraduationCap },
  { title: "Company Sites", url: "/company-sites", icon: Building2 },
  { title: "Info & Resources", url: "/info-resources", icon: FileText },
];

export function TopNav() {
  return (
    <nav className="h-8 border-b border-border bg-card flex items-center px-3">
      <div className="flex-1" />
      <div className="flex items-center justify-center gap-0.5 sm:gap-1">
        {topNavItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className="flex items-center justify-center gap-1 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap"
            activeClassName="bg-primary/10 text-primary"
          >
            <item.icon className="h-3 w-3 shrink-0" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </div>
      <div className="flex-1 flex justify-end items-center gap-1">
        <NotificationBell />
        <ProfileMenu />
      </div>
    </nav>
  );
}
