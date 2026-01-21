import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNav } from "@/components/layout/TopNav";
import { BrandingBanner } from "@/components/layout/BrandingBanner";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Menu } from "lucide-react";

// Auth Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Pages
import Onboarding from "./pages/Onboarding";
import Announcements from "./pages/Announcements";
import ProjectsInsights from "./pages/ProjectsInsights";
import News from "./pages/News";
import EuropeChat from "./pages/EuropeChat";
import Introductions from "./pages/Introductions";
import Wins from "./pages/Wins";
import Partnerships from "./pages/Partnerships";
import EQTraining from "./pages/EQTraining";
import AnalyticsSuite from "./pages/AnalyticsSuite";
import IntegrationSuite from "./pages/IntegrationSuite";
import SellingTraining from "./pages/SellingTraining";
import GenericTraining from "./pages/GenericTraining";
import Migration from "./pages/Migration";
import Integration from "./pages/Integration";
import PastProjects from "./pages/PastProjects";
import CurrentProjects from "./pages/CurrentProjects";
import CompanySites from "./pages/CompanySites";
import SolutionsDatabase from "./pages/SolutionsDatabase";
import TrainingDetail from "./pages/TrainingDetail";
import WinPlanManagement from "./pages/WinPlanManagement";
import SalesTimeline from "./pages/SalesTimeline";
import Customers from "./pages/Customers";
import Opportunities from "./pages/Opportunities";
import OpportunityDetail from "./pages/OpportunityDetail";
import InfoResources from "./pages/InfoResources";
import HRTopicDetail from "./pages/HRTopicDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="h-screen flex flex-col w-full overflow-hidden">
        <div className="sticky top-0 z-50 shrink-0">
          <BrandingBanner />
        </div>
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="border-b border-border bg-card flex items-center px-4 lg:hidden h-14 shrink-0">
              <SidebarTrigger>
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
            </header>
            <div className="sticky top-0 z-40 shrink-0">
              <TopNav />
            </div>
            <main className="flex-1 overflow-auto bg-background">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<Navigate to="/onboarding" replace />} />
                      <Route path="/onboarding" element={<Onboarding />} />
                      <Route path="/announcements" element={<Announcements />} />
                      <Route path="/projects-insights" element={<ProjectsInsights />} />
                      <Route path="/news" element={<News />} />
                      <Route path="/europe-chat" element={<EuropeChat />} />
                      <Route path="/introductions" element={<Introductions />} />
                      <Route path="/wins" element={<Wins />} />
                      <Route path="/partnerships" element={<Partnerships />} />
                      <Route path="/eq-training" element={<EQTraining />} />
                      <Route path="/eq-training/analytics-suite" element={<AnalyticsSuite />} />
                      <Route path="/eq-training/integration-suite" element={<IntegrationSuite />} />
                      <Route path="/selling-training" element={<SellingTraining />} />
                      <Route path="/generic-training" element={<GenericTraining />} />
                      <Route path="/training/:category/:slug" element={<TrainingDetail />} />
                      <Route path="/migration" element={<Migration />} />
                      <Route path="/integration" element={<Integration />} />
                      <Route path="/customers" element={<Customers />} />
                      <Route path="/opportunities" element={<Opportunities />} />
                      <Route path="/opportunities/:id" element={<OpportunityDetail />} />
                      <Route path="/win-plan-management" element={<WinPlanManagement />} />
                      <Route path="/sales-timeline" element={<SalesTimeline />} />
                      <Route path="/current-projects" element={<CurrentProjects />} />
                      <Route path="/past-projects" element={<PastProjects />} />
                      <Route path="/company-sites" element={<CompanySites />} />
                      <Route path="/solutions-database" element={<SolutionsDatabase />} />
                      
                      <Route path="/info-resources" element={<InfoResources />} />
                      <Route path="/info-resources/:topicSlug" element={<HRTopicDetail />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
