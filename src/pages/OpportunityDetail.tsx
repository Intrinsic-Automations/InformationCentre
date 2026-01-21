import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  Target,
  Presentation,
  Handshake,
  Quote,
  Trophy,
  XCircle,
  Check,
  Edit,
  ExternalLink,
  Users,
  Package,
  Clock,
  Flag,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import winPlanHero from "@/assets/win-plan-hero.jpg";

// Timeline stages
const timelineStages = [
  { id: "prospecting", title: "Lead/Plow", shortTitle: "Plow", icon: Target, color: "bg-blue-500" },
  { id: "proposal", title: "Solution Proposed/SOW", shortTitle: "SOW", icon: Presentation, color: "bg-violet-500" },
  { id: "negotiation", title: "Formal Approval/Grow", shortTitle: "Grow", icon: Handshake, color: "bg-purple-500" },
  { id: "closing", title: "Quotation/Harvest", shortTitle: "Harvest", icon: Quote, color: "bg-orange-500" },
  { id: "won", title: "Won", shortTitle: "Won", icon: Trophy, color: "bg-emerald-500" },
  { id: "lost", title: "Lost", shortTitle: "Lost", icon: XCircle, color: "bg-red-500" },
];

const priorityOptions = [
  { value: "low", label: "Low", color: "bg-slate-500" },
  { value: "medium", label: "Medium", color: "bg-yellow-500" },
  { value: "high", label: "High", color: "bg-orange-500" },
  { value: "critical", label: "Critical", color: "bg-red-500" },
];

const eqProductOptions = [
  "Analytics Foundation",
  "Analytics Advanced", 
  "Analytics Admin",
  "Integration Foundation",
  "Integration Advanced",
  "Integration Admin",
  "Custom Development",
  "Consulting Services",
  "Training",
  "Support Package",
];

interface OpportunityFull {
  id: string;
  customer_id: string;
  opportunity_name: string;
  deal_summary: string | null;
  stage: string | null;
  probability: number | null;
  expected_close_date: string | null;
  estimated_value: number | null;
  partner_prime_quotations: string | null;
  eq_products: string[] | null;
  eq_employees: string[] | null;
  start_date: string | null;
  end_date: string | null;
  priority: string | null;
  opportunity_owner: string | null;
  created_at: string;
  updated_at: string;
}

interface Customer {
  id: string;
  company_name: string;
}

const getStageIndex = (stage: string | null): number => {
  const idx = timelineStages.findIndex(s => s.id === stage);
  return idx >= 0 ? idx : 0;
};

const OpportunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<OpportunityFull>>({});
  const [newEmployee, setNewEmployee] = useState("");
  const [localConfidence, setLocalConfidence] = useState<number>(0);

  // Fetch opportunity
  const { data: opportunity, isLoading: isLoadingOpp } = useQuery({
    queryKey: ["opportunity-detail", id],
    queryFn: async () => {
      if (!id) throw new Error("No ID provided");
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as OpportunityFull;
    },
    enabled: !!id,
  });

  // Fetch customer
  const { data: customer } = useQuery({
    queryKey: ["customer-for-opp", opportunity?.customer_id],
    queryFn: async () => {
      if (!opportunity?.customer_id) throw new Error("No customer ID");
      const { data, error } = await supabase
        .from("customers")
        .select("id, company_name")
        .eq("id", opportunity.customer_id)
        .single();
      if (error) throw error;
      return data as Customer;
    },
    enabled: !!opportunity?.customer_id,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: Partial<OpportunityFull>) => {
      if (!id) throw new Error("No ID");
      const { error } = await supabase
        .from("opportunities")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opportunity-detail", id] });
      queryClient.invalidateQueries({ queryKey: ["all-opportunities"] });
      toast.success("Opportunity updated");
      setIsEditDialogOpen(false);
    },
    onError: (error) => {
      toast.error("Failed to update: " + error.message);
    },
  });

  useEffect(() => {
    if (opportunity) {
      setEditForm({
        opportunity_name: opportunity.opportunity_name,
        deal_summary: opportunity.deal_summary,
        partner_prime_quotations: opportunity.partner_prime_quotations,
        probability: opportunity.probability,
        expected_close_date: opportunity.expected_close_date,
        eq_products: opportunity.eq_products || [],
        eq_employees: opportunity.eq_employees || [],
        start_date: opportunity.start_date,
        end_date: opportunity.end_date,
        priority: opportunity.priority || "medium",
      });
      setLocalConfidence(opportunity.probability ?? 0);
    }
  }, [opportunity]);

  const handleStageClick = (stageId: string) => {
    if (stageId !== opportunity?.stage) {
      updateMutation.mutate({ stage: stageId });
    }
  };

  const handleConfidenceChange = (value: number[]) => {
    setLocalConfidence(value[0]);
  };

  const handleConfidenceCommit = (value: number[]) => {
    updateMutation.mutate({ probability: value[0] });
  };

  const handleSaveEdit = () => {
    updateMutation.mutate(editForm);
  };

  const addEmployee = () => {
    if (newEmployee.trim()) {
      setEditForm(prev => ({
        ...prev,
        eq_employees: [...(prev.eq_employees || []), newEmployee.trim()]
      }));
      setNewEmployee("");
    }
  };

  const removeEmployee = (emp: string) => {
    setEditForm(prev => ({
      ...prev,
      eq_employees: (prev.eq_employees || []).filter(e => e !== emp)
    }));
  };

  const toggleProduct = (product: string) => {
    setEditForm(prev => {
      const current = prev.eq_products || [];
      if (current.includes(product)) {
        return { ...prev, eq_products: current.filter(p => p !== product) };
      } else {
        return { ...prev, eq_products: [...current, product] };
      }
    });
  };

  if (isLoadingOpp) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Opportunity not found</p>
        <Button variant="outline" onClick={() => navigate("/opportunities")} className="mt-4">
          Back to Opportunities
        </Button>
      </div>
    );
  }

  const currentStageIndex = getStageIndex(opportunity.stage);
  const isWon = opportunity.stage === "won";
  const isLost = opportunity.stage === "lost";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img src={winPlanHero} alt="Opportunity banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/opportunities")} className="text-secondary-foreground hover:bg-secondary/50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground truncate max-w-md">
                {opportunity.opportunity_name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Header with Edit Button */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Building2 className="h-4 w-4" />
              <span>{customer?.company_name || "Loading..."}</span>
            </div>
            <h2 className="text-2xl font-bold">{opportunity.opportunity_name}</h2>
            {opportunity.deal_summary && (
              <p className="text-muted-foreground mt-2 max-w-2xl">{opportunity.deal_summary}</p>
            )}
          </div>
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Details
          </Button>
        </div>

        {/* Phase Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Phase (Timeline Position)</CardTitle>
            <CardDescription>Click on a stage to update the opportunity's position</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-4 left-4 right-4 h-1 bg-muted rounded-full" />
                {!isLost && (
                  <div 
                    className={cn(
                      "absolute top-4 left-4 h-1 rounded-full transition-all duration-500",
                      isWon ? "bg-gradient-to-r from-blue-500 via-purple-500 via-orange-500 to-emerald-500" : "bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"
                    )}
                    style={{ 
                      width: `calc(${(currentStageIndex / (timelineStages.length - 2)) * 100}% - 2rem)`,
                      maxWidth: 'calc(100% - 2rem)'
                    }}
                  />
                )}
                <TooltipProvider delayDuration={0}>
                  {timelineStages.slice(0, -1).map((stage, index) => {
                    const Icon = stage.icon;
                    const isPast = index < currentStageIndex && !isLost;
                    const isCurrent = index === currentStageIndex && !isLost;
                    const isFuture = index > currentStageIndex || isLost;
                    
                    return (
                      <Tooltip key={stage.id}>
                        <TooltipTrigger asChild>
                          <button
                            className={cn(
                              "relative z-10 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200",
                              isPast && `${stage.color} text-white shadow-md`,
                              isCurrent && `${stage.color} text-white shadow-lg ring-2 ring-offset-2 ring-offset-background ring-primary scale-110`,
                              isFuture && "bg-muted text-muted-foreground hover:bg-muted/80",
                              "hover:scale-110"
                            )}
                            onClick={() => handleStageClick(stage.id)}
                            disabled={updateMutation.isPending}
                          >
                            {isPast ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          <p className="font-medium">{stage.title}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
              </div>
              <div className="flex items-center justify-between mt-3">
                {timelineStages.slice(0, -1).map((stage, index) => {
                  const isCurrent = index === currentStageIndex && !isLost;
                  return (
                    <span key={stage.id} className={cn("text-xs text-center w-10", isCurrent ? "text-foreground font-medium" : "text-muted-foreground")}>
                      {stage.shortTitle}
                    </span>
                  );
                })}
              </div>
              {(isLost || isWon) && (
                <div className={cn(
                  "mt-4 flex items-center justify-center gap-2 py-2 px-4 rounded-full text-sm font-medium w-fit mx-auto",
                  isWon && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                  isLost && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}>
                  {isWon ? <Trophy className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <span>{isWon ? "Deal Won" : "Deal Lost"}</span>
                </div>
              )}
              {!isWon && !isLost && (
                <div className="flex items-center justify-center gap-3 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={() => handleStageClick("lost")}
                    disabled={updateMutation.isPending}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Mark Lost
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                    onClick={() => handleStageClick("won")}
                    disabled={updateMutation.isPending}
                  >
                    <Trophy className="h-4 w-4 mr-1" />
                    Mark Won
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Confidence Slider */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Confidence</CardTitle>
            <CardDescription>How confident are you in closing this deal?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">0%</span>
                <span className="text-2xl font-bold text-primary">{localConfidence}%</span>
                <span className="text-sm text-muted-foreground">100%</span>
              </div>
              <Slider
                value={[localConfidence]}
                onValueChange={handleConfidenceChange}
                onValueCommit={handleConfidenceCommit}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Details Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Key Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Key Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Potential Close Date</p>
                  <p className="font-medium">
                    {opportunity.expected_close_date 
                      ? format(new Date(opportunity.expected_close_date), "MMM d, yyyy")
                      : "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="font-medium">
                    {opportunity.start_date 
                      ? format(new Date(opportunity.start_date), "MMM d, yyyy")
                      : "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">End Date</p>
                  <p className="font-medium">
                    {opportunity.end_date 
                      ? format(new Date(opportunity.end_date), "MMM d, yyyy")
                      : "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Flag className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Priority</p>
                  <Badge variant="outline" className={cn(
                    priorityOptions.find(p => p.value === opportunity.priority)?.color,
                    "text-white"
                  )}>
                    {priorityOptions.find(p => p.value === opportunity.priority)?.label || "Medium"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partner/Prime & Quotations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Partner/Prime Related Quotations</CardTitle>
            </CardHeader>
            <CardContent>
              {opportunity.partner_prime_quotations ? (
                <p className="text-sm whitespace-pre-wrap">{opportunity.partner_prime_quotations}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No quotations added yet</p>
              )}
            </CardContent>
          </Card>

          {/* eQ Products */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                eQ Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {opportunity.eq_products && opportunity.eq_products.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {opportunity.eq_products.map((product) => (
                    <Badge key={product} variant="secondary">{product}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No products selected</p>
              )}
            </CardContent>
          </Card>

          {/* eQ Employees */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                eQ Employees
              </CardTitle>
            </CardHeader>
            <CardContent>
              {opportunity.eq_employees && opportunity.eq_employees.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {opportunity.eq_employees.map((emp) => (
                    <Badge key={emp} variant="outline">{emp}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No employees assigned</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Go to Win Plan Button */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Win Plan Management</h3>
                <p className="text-sm text-muted-foreground">
                  View stakeholders, interactions, action steps, and more
                </p>
              </div>
              <Button 
                onClick={() => navigate(`/win-plan-management?customer=${opportunity.customer_id}&opportunity=${opportunity.id}`)}
                className="gap-2"
              >
                Go to Win Plan
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Opportunity Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Opportunity Name</Label>
              <Input
                value={editForm.opportunity_name || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, opportunity_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={editForm.deal_summary || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, deal_summary: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Partner/Prime Related Quotations</Label>
              <Textarea
                value={editForm.partner_prime_quotations || ""}
                onChange={(e) => setEditForm(prev => ({ ...prev, partner_prime_quotations: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Potential Close Date</Label>
                <Input
                  type="date"
                  value={editForm.expected_close_date || ""}
                  onChange={(e) => setEditForm(prev => ({ ...prev, expected_close_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={editForm.priority || "medium"}
                  onValueChange={(value) => setEditForm(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={editForm.start_date || ""}
                  onChange={(e) => setEditForm(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={editForm.end_date || ""}
                  onChange={(e) => setEditForm(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>eQ Products</Label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-md bg-muted/30">
                {eqProductOptions.map((product) => (
                  <Badge
                    key={product}
                    variant={(editForm.eq_products || []).includes(product) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleProduct(product)}
                  >
                    {product}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>eQ Employees</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add employee name..."
                  value={newEmployee}
                  onChange={(e) => setNewEmployee(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEmployee())}
                />
                <Button type="button" variant="outline" onClick={addEmployee}>Add</Button>
              </div>
              {(editForm.eq_employees || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {(editForm.eq_employees || []).map((emp) => (
                    <Badge key={emp} variant="secondary" className="gap-1">
                      {emp}
                      <button onClick={() => removeEmployee(emp)} className="ml-1 hover:text-destructive">×</button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OpportunityDetail;