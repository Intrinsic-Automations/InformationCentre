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
