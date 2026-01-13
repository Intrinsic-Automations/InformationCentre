import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Customer {
  id: string;
  company_name: string;
  industry: string | null;
  website: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  notes: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface CustomerDocument {
  id: string;
  customer_id: string;
  document_name: string;
  document_type: string;
  document_url: string | null;
  shared_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Opportunity {
  id: string;
  customer_id: string;
  opportunity_name: string;
  deal_summary: string | null;
  value_proposition: string | null;
  compelling_reasons: string | null;
  key_issues: string | null;
  blockers: string | null;
  estimated_value: number | null;
  stage: string | null;
  probability: number | null;
  expected_close_date: string | null;
  status: string | null;
  industry: string | null;
  exec_owner: string | null;
  opportunity_owner: string | null;
  quarter_to_close: string | null;
  services_value: number | null;
  software_sales: number | null;
  created_at: string;
  updated_at: string;
}

export interface OpportunityStakeholder {
  id: string;
  opportunity_id: string;
  name: string;
  role: string;
  relationship_owner: string | null;
  comments: string | null;
  is_decision_maker: boolean;
  created_at: string;
  updated_at: string;
}

export interface OpportunityInteraction {
  id: string;
  opportunity_id: string;
  interaction_type: string;
  interaction_date: string;
  summary: string;
  attendees: string | null;
  presentation_shared: string | null;
  outcome: string | null;
  next_steps: string | null;
  created_at: string;
  updated_at: string;
}

export interface OpportunityActionStep {
  id: string;
  opportunity_id: string;
  action_description: string;
  owner: string;
  due_date: string | null;
  rag_status: 'red' | 'amber' | 'green';
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("company_name");
      if (error) throw error;
      return data as Customer[];
    },
  });
}

export function useCustomerDocuments(customerId: string | null) {
  return useQuery({
    queryKey: ["customer_documents", customerId],
    queryFn: async () => {
      if (!customerId) return [];
      const { data, error } = await supabase
        .from("customer_documents")
        .select("*")
        .eq("customer_id", customerId)
        .order("shared_date", { ascending: false });
      if (error) throw error;
      return data as CustomerDocument[];
    },
    enabled: !!customerId,
  });
}

export function useOpportunities(customerId: string | null) {
  return useQuery({
    queryKey: ["opportunities", customerId],
    queryFn: async () => {
      if (!customerId) return [];
      const { data, error } = await supabase
        .from("opportunities")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Opportunity[];
    },
    enabled: !!customerId,
  });
}

export function useOpportunityInteractions(opportunityId: string | null) {
  return useQuery({
    queryKey: ["opportunity_interactions", opportunityId],
    queryFn: async () => {
      if (!opportunityId) return [];
      const { data, error } = await supabase
        .from("opportunity_interactions")
        .select("*")
        .eq("opportunity_id", opportunityId)
        .order("interaction_date", { ascending: false });
      if (error) throw error;
      return data as OpportunityInteraction[];
    },
    enabled: !!opportunityId,
  });
}

export function useOpportunityStakeholders(opportunityId: string | null) {
  return useQuery({
    queryKey: ["opportunity_stakeholders", opportunityId],
    queryFn: async () => {
      if (!opportunityId) return [];
      const { data, error } = await supabase
        .from("opportunity_stakeholders")
        .select("*")
        .eq("opportunity_id", opportunityId)
        .order("is_decision_maker", { ascending: false });
      if (error) throw error;
      return data as OpportunityStakeholder[];
    },
    enabled: !!opportunityId,
  });
}

export function useOpportunityActionSteps(opportunityId: string | null) {
  return useQuery({
    queryKey: ["opportunity_action_steps", opportunityId],
    queryFn: async () => {
      if (!opportunityId) return [];
      const { data, error } = await supabase
        .from("opportunity_action_steps")
        .select("*")
        .eq("opportunity_id", opportunityId)
        .order("due_date", { ascending: true });
      if (error) throw error;
      return data as OpportunityActionStep[];
    },
    enabled: !!opportunityId,
  });
}
