import { NavLink } from "@/components/NavLink";
import { ProfileMenu } from "@/components/profile/ProfileMenu";
import { GraduationCap, Building2, Network, Calendar } from "lucide-react";

const topNavItems = [
  { title: "eQ Training", url: "/eq-training", icon: GraduationCap },
  { title: "Company Sites", url: "/company-sites", icon: Building2 },
  { title: "Organization", url: "/organization", icon: Network },
  { title: "Upcoming Projects", url: "/upcoming-projects", icon: Calendar },
];

export function TopNav() {
  return (
    <nav className="h-12 border-b border-border bg-card flex items-center px-6">
      <div className="flex-1" />
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        {topNavItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className="flex items-center justify-center gap-1.5 px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap"
            activeClassName="bg-primary/10 text-primary"
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </div>
      <div className="flex-1 flex justify-end">
        <ProfileMenu />
      </div>
    </nav>
  );
}
