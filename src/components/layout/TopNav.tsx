import { NavLink } from "@/components/NavLink";
import { GraduationCap, Building2, Network, Calendar } from "lucide-react";

const topNavItems = [
  { title: "eQ Training", url: "/eq-training", icon: GraduationCap },
  { title: "Company Sites", url: "/company-sites", icon: Building2 },
  { title: "Organization", url: "/organization", icon: Network },
  { title: "Upcoming Projects", url: "/upcoming-projects", icon: Calendar },
];

export function TopNav() {
  return (
    <nav className="h-12 border-b border-border bg-card flex items-center justify-center px-6">
      <div className="flex items-center justify-evenly w-full max-w-4xl">
        {topNavItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex-1"
            activeClassName="bg-primary/10 text-primary"
          >
            <item.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{item.title}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
