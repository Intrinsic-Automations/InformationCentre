import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Home,
  Bell,
  Lightbulb,
  Newspaper,
  Globe,
  Users,
  Trophy,
  Handshake,
  GraduationCap,
  TrendingUp,
  BookOpen,
  Wrench,
  ArrowRightLeft,
  History,
  FolderKanban,
  Building2,
  Database,
  ChevronDown,
  BarChart3,
  Plug,
  Target,
  FileText,
  Clock,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { SearchBar } from "@/components/layout/SearchBar";
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

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navigationConfig: NavGroup[] = [
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
      { title: "Europe Chat", url: "/europe-chat", icon: Globe },
      { title: "Introductions", url: "/introductions", icon: Users },
      { title: "Wins", url: "/wins", icon: Trophy },
      { title: "Partnerships", url: "/partnerships", icon: Handshake },
    ],
  },
  {
    label: "Learning",
    items: [
      { 
        title: "eQ Training", 
        url: "/eq-training", 
        icon: GraduationCap,
        children: [
          { title: "Analytics Suite", url: "/eq-training/analytics-suite", icon: BarChart3 },
          { title: "Integration Suite", url: "/eq-training/integration-suite", icon: Plug },
        ],
      },
      { title: "Sales Training", url: "/selling-training", icon: TrendingUp },
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
    label: "Sales Centre",
    items: [
      { title: "Win Plan Management", url: "/win-plan-management", icon: Target },
      { title: "Sales Timeline", url: "/sales-timeline", icon: Clock },
    ],
  },
  {
    label: "HR Centre",
    items: [
      { title: "Info & Resources", url: "/info-resources", icon: FileText },
    ],
  },
  {
    label: "Project Centre",
    items: [
      { title: "Current Projects", url: "/current-projects", icon: FolderKanban },
      { title: "Past Projects", url: "/past-projects", icon: History },
    ],
  },
  {
    label: "Resources",
    items: [
      { title: "Company Sites", url: "/company-sites", icon: Building2 },
      { title: "Solutions Database", url: "/solutions-database", icon: Database },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  // All groups expanded by default
  const getDefaultOpenGroups = () => {
    return navigationConfig.map((group) => group.label);
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
      <SidebarHeader className="p-4 border-b border-sidebar-border space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Users className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sidebar-foreground">Community Hub</h1>
            <p className="text-xs text-muted-foreground">Connect & Collaborate</p>
          </div>
        </div>
        <SearchBar />
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
                        {item.children && (
                          <SidebarMenu className="ml-4 mt-1 border-l border-sidebar-border pl-2">
                            {item.children.map((child) => (
                              <SidebarMenuItem key={child.title}>
                                <SidebarMenuButton asChild>
                                  <NavLink
                                    to={child.url}
                                    className="flex items-center gap-3 rounded-md px-3 py-1.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                                    activeClassName="bg-primary/10 text-primary font-semibold"
                                  >
                                    <child.icon className="h-3.5 w-3.5" />
                                    <span>{child.title}</span>
                                  </NavLink>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        )}
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
