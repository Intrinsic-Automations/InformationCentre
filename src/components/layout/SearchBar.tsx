import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
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
  Calendar,
  Clock,
  History,
  Building2,
  Database,
  Network,
  BarChart3,
  Plug,
  Target,
  FileText,
  CalendarOff,
  ClipboardCheck,
  Gift,
  LogOut,
  UserPlus,
} from "lucide-react";

interface SearchableItem {
  title: string;
  description: string;
  url: string;
  category: string;
  keywords: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const searchableContent: SearchableItem[] = [
  // Welcome
  { title: "Onboarding", description: "Get started with the Community Hub", url: "/onboarding", category: "Welcome", keywords: ["start", "welcome", "getting started", "new", "introduction"], icon: Home },
  
  // Stay Up To Date
  { title: "Announcements", description: "Company announcements and updates", url: "/announcements", category: "Stay Up To Date", keywords: ["news", "updates", "company", "announcements", "important"], icon: Bell },
  { title: "Projects Insights", description: "Insights and analytics on projects", url: "/projects-insights", category: "Stay Up To Date", keywords: ["analytics", "insights", "data", "metrics", "projects"], icon: Lightbulb },
  { title: "News", description: "Latest news and articles", url: "/news", category: "Stay Up To Date", keywords: ["articles", "latest", "updates", "news"], icon: Newspaper },
  
  // Community
  { title: "Europe Chat", description: "Chat with Europe team members", url: "/europe-chat", category: "Community", keywords: ["chat", "europe", "team", "communication", "discuss"], icon: Globe },
  { title: "Introductions", description: "Introduce yourself to the team", url: "/introductions", category: "Community", keywords: ["introduce", "new members", "welcome", "team"], icon: Users },
  { title: "Wins", description: "Celebrate team and project wins", url: "/wins", category: "Community", keywords: ["success", "achievements", "celebrate", "wins", "accomplishments"], icon: Trophy },
  { title: "Partnerships", description: "Partner information and collaborations", url: "/partnerships", category: "Community", keywords: ["partners", "collaboration", "business", "relationships"], icon: Handshake },
  
  // Learning
  { title: "eQ Training", description: "eQ product training courses", url: "/eq-training", category: "Learning", keywords: ["training", "eq", "courses", "learning", "education"], icon: GraduationCap },
  { title: "Analytics Suite", description: "Analytics Suite training modules", url: "/eq-training/analytics-suite", category: "Learning", keywords: ["analytics", "training", "data", "reports", "dashboards"], icon: BarChart3 },
  { title: "Integration Suite", description: "Integration Suite training modules", url: "/eq-training/integration-suite", category: "Learning", keywords: ["integration", "training", "api", "connect", "systems"], icon: Plug },
  { title: "Sales Training", description: "Sales techniques and strategies", url: "/selling-training", category: "Learning", keywords: ["sales", "selling", "techniques", "strategy", "closing"], icon: TrendingUp },
  { title: "Generic Training", description: "General professional development", url: "/generic-training", category: "Learning", keywords: ["training", "professional", "development", "skills", "communication"], icon: BookOpen },
  
  // Solution Centre
  { title: "Migration", description: "Migration projects and templates", url: "/migration", category: "Solution Centre", keywords: ["migration", "move", "transfer", "upgrade", "templates"], icon: ArrowRightLeft },
  { title: "Integration", description: "Integration projects and templates", url: "/integration", category: "Solution Centre", keywords: ["integration", "connect", "api", "systems", "templates"], icon: Wrench },
  
  // Sales Centre
  { title: "Win Plan Management", description: "Manage sales opportunities and win plans", url: "/win-plan-management", category: "Sales Centre", keywords: ["sales", "opportunities", "customers", "deals", "pipeline", "win plan", "crm"], icon: Target },
  
  // HR Centre
  { title: "Info & Resources", description: "HR information and resources", url: "/info-resources", category: "HR Centre", keywords: ["hr", "human resources", "policies", "procedures"], icon: FileText },
  { title: "Absence Management", description: "Policies for managing employee absence", url: "/info-resources", category: "HR Centre", keywords: ["absence", "leave", "sick", "holiday", "vacation", "time off"], icon: CalendarOff },
  { title: "Appraisals", description: "Performance review processes", url: "/info-resources", category: "HR Centre", keywords: ["appraisal", "review", "performance", "evaluation", "feedback"], icon: ClipboardCheck },
  { title: "Employee Benefits", description: "Information about employee benefits", url: "/info-resources", category: "HR Centre", keywords: ["benefits", "perks", "insurance", "pension", "health"], icon: Gift },
  { title: "Employee Exit", description: "Offboarding procedures", url: "/info-resources", category: "HR Centre", keywords: ["exit", "leaving", "offboarding", "resignation", "termination"], icon: LogOut },
  { title: "Induction", description: "New starter onboarding materials", url: "/info-resources", category: "HR Centre", keywords: ["induction", "onboarding", "new starter", "orientation"], icon: UserPlus },
  { title: "Job Descriptions", description: "Role definitions and templates", url: "/info-resources", category: "HR Centre", keywords: ["job", "role", "description", "responsibilities", "duties"], icon: FileText },
  { title: "Performance Management", description: "Performance tracking resources", url: "/info-resources", category: "HR Centre", keywords: ["performance", "management", "goals", "objectives", "kpi"], icon: TrendingUp },
  { title: "Probation", description: "Probation period guidelines", url: "/info-resources", category: "HR Centre", keywords: ["probation", "trial", "new employee", "review period"], icon: Clock },
  { title: "Recruiting", description: "Recruitment processes and guidelines", url: "/info-resources", category: "HR Centre", keywords: ["recruiting", "hiring", "interview", "candidates", "jobs"], icon: Search },
  { title: "Training", description: "Training programs and development", url: "/info-resources", category: "HR Centre", keywords: ["training", "development", "learning", "courses", "skills"], icon: GraduationCap },
  
  // Project Centre
  { title: "Upcoming Projects", description: "View upcoming projects", url: "/upcoming-projects", category: "Project Centre", keywords: ["upcoming", "future", "planned", "projects", "pipeline"], icon: Calendar },
  { title: "Current Projects", description: "View active projects", url: "/current-projects", category: "Project Centre", keywords: ["current", "active", "ongoing", "projects", "in progress"], icon: Clock },
  { title: "Past Projects", description: "View completed projects", url: "/past-projects", category: "Project Centre", keywords: ["past", "completed", "finished", "historical", "archive"], icon: History },
  
  // Resources
  { title: "Company Sites", description: "Internal and external company links", url: "/company-sites", category: "Resources", keywords: ["sites", "links", "tools", "portals", "intranet"], icon: Building2 },
  { title: "Solutions Database", description: "Browse solutions and documentation", url: "/solutions-database", category: "Resources", keywords: ["solutions", "database", "documentation", "knowledge", "library"], icon: Database },
  { title: "Organization", description: "Company organization structure", url: "/organization", category: "Resources", keywords: ["organization", "org chart", "structure", "team", "hierarchy", "employees"], icon: Network },
];

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchableItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim().length > 0) {
      const searchTerms = query.toLowerCase().split(" ");
      const filtered = searchableContent.filter((item) => {
        const searchText = `${item.title} ${item.description} ${item.category} ${item.keywords.join(" ")}`.toLowerCase();
        return searchTerms.every((term) => searchText.includes(term));
      });
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (url: string) => {
    navigate(url);
    setQuery("");
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search the hub..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length > 0 && setIsOpen(true)}
          className="pl-9 pr-8 bg-sidebar-accent/50 border-sidebar-border focus:bg-background"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-auto">
          {results.length > 0 ? (
            <div className="py-2">
              {results.map((item, index) => (
                <button
                  key={`${item.url}-${index}`}
                  onClick={() => handleSelect(item.url)}
                  className="w-full flex items-start gap-3 px-4 py-3 hover:bg-accent transition-colors text-left"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-foreground">{item.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                    <div className="text-xs text-primary/70 mt-0.5">{item.category}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
