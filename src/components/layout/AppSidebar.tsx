import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Home,
  Bell,
  Lightbulb,
  Newspaper,
  MessageCircle,
  Globe,
  Users,
  Trophy,
  Handshake,
  GraduationCap,
  TrendingUp,
  BookOpen,
  Wrench,
  ArrowRightLeft,
  FolderKanban,
  Calendar,
  Clock,
  History,
  Building2,
  Database,
  Network,
  ChevronDown,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navigationConfig = [
  {
    label: "Welcome",
    items: [
      { title: "Onboarding", url: "/onboarding", icon: Home },
    ],
  },
  {
    label: "Stay Up To Date",
    items: [
      { title: "Announcements", url: "/announcements", icon: Bell },
      { title: "Projects Insights", url: "/projects-insights", icon: Lightbulb },
      { title: "News", url: "/news", icon: Newspaper },
    ],
  },
  {
    label: "Community",
    items: [
      { title: "India Chat", url: "/india-chat", icon: MessageCircle },
      { title: "Europe Chat", url: "/europe-chat", icon: Globe },
      { title: "Introductions", url: "/introductions", icon: Users },
      { title: "Wins", url: "/wins", icon: Trophy },
      { title: "Partnerships", url: "/partnerships", icon: Handshake },
    ],
  },
  {
    label: "Learning",
    items: [
      { title: "eQ Training", url: "/eq-training", icon: GraduationCap },
      { title: "Selling Training", url: "/selling-training", icon: TrendingUp },
      { title: "Generic Training", url: "/generic-training", icon: BookOpen },
    ],
  },
  {
    label: "Solution Centre",
    items: [
      { title: "Migration", url: "/migration", icon: ArrowRightLeft },
      { title: "Integration", url: "/integration", icon: Wrench },
    ],
  },
  {
    label: "Project Centre",
    items: [
      { title: "Upcoming Projects", url: "/upcoming-projects", icon: Calendar },
      { title: "Current Projects", url: "/current-projects", icon: Clock },
      { title: "Past Projects", url: "/past-projects", icon: History },
    ],
  },
  {
    label: "Resources",
    items: [
      { title: "Company Sites", url: "/company-sites", icon: Building2 },
      { title: "Solutions Database", url: "/solutions-database", icon: Database },
      { title: "Organization", url: "/organization", icon: Network },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Determine which groups should be open by default (groups containing active route)
  const getDefaultOpenGroups = () => {
    const openGroups: string[] = [];
    navigationConfig.forEach((group) => {
      if (group.items.some((item) => currentPath === item.url)) {
        openGroups.push(group.label);
      }
    });
    // If no active route, open the first group
    if (openGroups.length === 0 && navigationConfig.length > 0) {
      openGroups.push(navigationConfig[0].label);
    }
    return openGroups;
  };

  const [openGroups, setOpenGroups] = useState<string[]>(getDefaultOpenGroups);

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) =>
      prev.includes(label)
        ? prev.filter((g) => g !== label)
        : [...prev, label]
    );
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Users className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sidebar-foreground">Community Hub</h1>
            <p className="text-xs text-muted-foreground">Connect & Collaborate</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        {navigationConfig.map((group) => (
          <Collapsible
            key={group.label}
            open={openGroups.includes(group.label)}
            onOpenChange={() => toggleGroup(group.label)}
          >
            <SidebarGroup>
              <CollapsibleTrigger asChild>
                <SidebarGroupLabel className="flex w-full cursor-pointer items-center justify-between px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-sidebar-foreground transition-colors">
                  {group.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      openGroups.includes(group.label) ? "rotate-180" : ""
                    }`}
                  />
                </SidebarGroupLabel>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {group.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <NavLink
                            to={item.url}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                            activeClassName="bg-primary/10 text-primary font-semibold"
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
