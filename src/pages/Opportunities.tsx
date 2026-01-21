import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Target, 
  Building2, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Trophy,
  XCircle,
  Presentation,
  Handshake,
  Quote,
  CheckCircle2,
  ChevronRight,
  Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import winPlanHero from "@/assets/win-plan-hero.jpg";
import { useCustomers, useOpportunities } from "@/hooks/useWinPlanData";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";

// Sales timeline stages matching the SalesTimeline page
const salesTimelineStages = [
  { 
    id: "lead", 
    title: "Lead/Plow", 
    icon: Target, 
    color: "bg-blue-500",
    textColor: "text-blue-600",
    borderColor: "border-blue-500",
    bgLight: "bg-blue-50"
  },
  { 
    id: "solution_proposed", 
    title: "Solution Proposed/SOW", 
    icon: Presentation, 
    color: "bg-violet-500",
    textColor: "text-violet-600",
    borderColor: "border-violet-500",
    bgLight: "bg-violet-50"
  },
  { 
    id: "formal_approval", 
    title: "Formal Approval/Grow", 
    icon: Handshake, 
    color: "bg-purple-500",
    textColor: "text-purple-600",
    borderColor: "border-purple-500",
    bgLight: "bg-purple-50"
  },
  { 
    id: "quotation", 
    title: "Quotation/Harvest", 
    icon: Quote, 
    color: "bg-orange-500",
    textColor: "text-orange-600",
    borderColor: "border-orange-500",
    bgLight: "bg-orange-50"
  },
  { 
    id: "won", 
    title: "Won", 
    icon: Trophy, 
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-500",
    bgLight: "bg-emerald-50"
  },
  { 
    id: "lost", 
    title: "Lost", 
    icon: XCircle, 
    color: "bg-red-500",
    textColor: "text-red-600",
    borderColor: "border-red-500",
    bgLight: "bg-red-50"
  },
];

// Map existing opportunity stages to sales timeline stages
const stageMapping: Record<string, string> = {
  prospecting: "lead",
  qualification: "lead",
  proposal: "solution_proposed",
  negotiation: "formal_approval",
  closing: "quotation",
  won: "won",
  lost: "lost",
};

const formatCurrency = (value: number | null | undefined) => {
  if (!value) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

interface Opportunity {
  id: string;
  opportunity_name: string;
  customer_id: string;
  stage: string | null;
  estimated_value: number | null;
  probability: number | null;
  expected_close_date: string | null;
  status: string | null;
  industry: string | null;
  opportunity_owner: string | null;
  exec_owner: string | null;
  created_at: string;
}

interface Customer {
  id: string;
  company_name: string;
}

const Opportunities = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");

  // Fetch all opportunities across all customers
  const { data: allOpportunities, isLoading: isLoadingOpportunities } = useQuery({
    queryKey: ["all-opportunities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Opportunity[];
    },
  });

  // Fetch all customers for mapping
  const { data: customers, isLoading: isLoadingCustomers } = useCustomers();

  // Create a customer lookup map
  const customerMap = useMemo(() => {
    const map = new Map<string, string>();
    customers?.forEach((c) => {
      map.set(c.id, c.company_name);
    });
    return map;
  }, [customers]);

  // Filter opportunities based on search and stage
  const filteredOpportunities = useMemo(() => {
    if (!allOpportunities) return [];
    
    return allOpportunities.filter((opp) => {
      const customerName = customerMap.get(opp.customer_id) || "";
      const matchesSearch = 
        opp.opportunity_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (opp.opportunity_owner?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
      
      const mappedStage = stageMapping[opp.stage || "prospecting"] || "lead";
      const matchesStage = stageFilter === "all" || mappedStage === stageFilter;
      
      return matchesSearch && matchesStage;
    });
  }, [allOpportunities, searchQuery, stageFilter, customerMap]);

  // Group opportunities by sales timeline stage
  const opportunitiesByStage = useMemo(() => {
    const grouped: Record<string, Opportunity[]> = {};
    salesTimelineStages.forEach((stage) => {
      grouped[stage.id] = [];
    });
    
    filteredOpportunities.forEach((opp) => {
      const mappedStage = stageMapping[opp.stage || "prospecting"] || "lead";
      if (grouped[mappedStage]) {
        grouped[mappedStage].push(opp);
      }
    });
    
    return grouped;
  }, [filteredOpportunities]);

  // Calculate totals for each stage
  const stageTotals = useMemo(() => {
    const totals: Record<string, { count: number; value: number }> = {};
    salesTimelineStages.forEach((stage) => {
      const opps = opportunitiesByStage[stage.id] || [];
      totals[stage.id] = {
        count: opps.length,
        value: opps.reduce((sum, opp) => sum + (opp.estimated_value || 0), 0),
      };
    });
    return totals;
  }, [opportunitiesByStage]);

  const handleOpportunityClick = (opportunityId: string, customerId: string) => {
    // Navigate to Win Plan Management with the opportunity pre-selected
    navigate(`/win-plan-management?customer=${customerId}&opportunity=${opportunityId}`);
  };

  const isLoading = isLoadingOpportunities || isLoadingCustomers;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={winPlanHero}
          alt="Opportunities banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Opportunities</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Header with search and filter */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Sales Pipeline
              </h2>
              <p className="text-sm text-muted-foreground">
                View all opportunities across the sales timeline
              </p>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  {salesTimelineStages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Pipeline Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {salesTimelineStages.map((stage) => {
            const Icon = stage.icon;
            const totals = stageTotals[stage.id];
            return (
              <Card 
                key={stage.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${stageFilter === stage.id ? `ring-2 ${stage.borderColor}` : ''}`}
                onClick={() => setStageFilter(stageFilter === stage.id ? "all" : stage.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${stage.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-medium truncate">{stage.title}</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xl font-bold">{totals?.count || 0}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(totals?.value || 0)}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Timeline View */}
        <Card className="bg-card">
          <CardContent className="pt-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground mb-2">Sales Pipeline Timeline</h2>
              <p className="text-muted-foreground text-sm">
                Track opportunities through each stage of the sales process
              </p>
            </div>

            <div className="relative">
              {/* Gradient vertical line */}
              <div className="absolute left-5 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 via-orange-500 to-emerald-500 rounded-full" />

              <div className="space-y-6">
                {salesTimelineStages.map((stage, index) => {
                  const Icon = stage.icon;
                  const opportunities = opportunitiesByStage[stage.id] || [];
                  
                  if (stageFilter !== "all" && stageFilter !== stage.id) return null;
                  
                  return (
                    <div 
                      key={stage.id} 
                      className="relative pl-14 group animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Icon marker */}
                      <div className={`absolute left-0 flex h-10 w-10 items-center justify-center rounded-xl ${stage.color} text-white shadow-lg transition-transform duration-200 group-hover:scale-110`}>
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Content card */}
                      <div className="bg-muted/30 rounded-lg border border-border/30 transition-all duration-200 group-hover:bg-muted/50 group-hover:border-primary/30 group-hover:shadow-md overflow-hidden">
                        <div className="p-4 border-b border-border/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-foreground text-lg">{stage.title}</h3>
                              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {opportunities.length} {opportunities.length === 1 ? "opportunity" : "opportunities"}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">
                              {formatCurrency(stageTotals[stage.id]?.value || 0)}
                            </span>
                          </div>
                        </div>

                        {isLoading ? (
                          <div className="p-4 space-y-3">
                            {[1, 2].map((i) => (
                              <Skeleton key={i} className="h-16 w-full" />
                            ))}
                          </div>
                        ) : opportunities.length === 0 ? (
                          <div className="p-6 text-center text-muted-foreground text-sm">
                            No opportunities in this stage
                          </div>
                        ) : (
                          <div className="divide-y divide-border/30">
                            {opportunities.map((opp) => (
                              <div
                                key={opp.id}
                                className="p-4 hover:bg-background/50 cursor-pointer transition-colors"
                                onClick={() => handleOpportunityClick(opp.id, opp.customer_id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-medium truncate">{opp.opportunity_name}</h4>
                                      {opp.probability !== null && opp.probability !== undefined && (
                                        <Badge variant="outline" className="text-xs shrink-0">
                                          {opp.probability}%
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                      <span className="flex items-center gap-1">
                                        <Building2 className="h-3.5 w-3.5" />
                                        {customerMap.get(opp.customer_id) || "Unknown"}
                                      </span>
                                      {opp.estimated_value && (
                                        <span className="flex items-center gap-1 text-emerald-600">
                                          <DollarSign className="h-3.5 w-3.5" />
                                          {formatCurrency(opp.estimated_value)}
                                        </span>
                                      )}
                                      {opp.expected_close_date && (
                                        <span className="flex items-center gap-1">
                                          <Calendar className="h-3.5 w-3.5" />
                                          {format(new Date(opp.expected_close_date), "MMM d, yyyy")}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <ChevronRight className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors shrink-0 ml-2" />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Opportunities;
