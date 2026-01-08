import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNav } from "@/components/layout/TopNav";
import { Menu } from "lucide-react";

// Pages
import Onboarding from "./pages/Onboarding";
import Announcements from "./pages/Announcements";
import ProjectsInsights from "./pages/ProjectsInsights";
import News from "./pages/News";
import IndiaChat from "./pages/IndiaChat";
import EuropeChat from "./pages/EuropeChat";
import Introductions from "./pages/Introductions";
import Wins from "./pages/Wins";
import Partnerships from "./pages/Partnerships";
import EQTraining from "./pages/EQTraining";
import SellingTraining from "./pages/SellingTraining";
import GenericTraining from "./pages/GenericTraining";
import Migration from "./pages/Migration";
import Integration from "./pages/Integration";
import UpcomingProjects from "./pages/UpcomingProjects";
import CurrentProjects from "./pages/CurrentProjects";
import PastProjects from "./pages/PastProjects";
import CompanySites from "./pages/CompanySites";
import SolutionsDatabase from "./pages/SolutionsDatabase";
import Organization from "./pages/Organization";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <header className="border-b border-border bg-card flex items-center px-4 lg:hidden h-14">
                <SidebarTrigger>
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
              </header>
              <TopNav />
              <main className="flex-1 overflow-auto bg-background">
                <Routes>
                  <Route path="/" element={<Navigate to="/onboarding" replace />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/announcements" element={<Announcements />} />
                  <Route path="/projects-insights" element={<ProjectsInsights />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/india-chat" element={<IndiaChat />} />
                  <Route path="/europe-chat" element={<EuropeChat />} />
                  <Route path="/introductions" element={<Introductions />} />
                  <Route path="/wins" element={<Wins />} />
                  <Route path="/partnerships" element={<Partnerships />} />
                  <Route path="/eq-training" element={<EQTraining />} />
                  <Route path="/selling-training" element={<SellingTraining />} />
                  <Route path="/generic-training" element={<GenericTraining />} />
                  <Route path="/migration" element={<Migration />} />
                  <Route path="/integration" element={<Integration />} />
                  <Route path="/upcoming-projects" element={<UpcomingProjects />} />
                  <Route path="/current-projects" element={<CurrentProjects />} />
                  <Route path="/past-projects" element={<PastProjects />} />
                  <Route path="/company-sites" element={<CompanySites />} />
                  <Route path="/solutions-database" element={<SolutionsDatabase />} />
                  <Route path="/organization" element={<Organization />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
