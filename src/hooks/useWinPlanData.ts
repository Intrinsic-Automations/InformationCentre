import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CustomerAuthor {
  id: string;
  full_name: string | null;
  initials: string | null;
  avatar_url: string | null;
}

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
  author_id: string;
  author?: CustomerAuthor;
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
        .select(`
          *,
          author:profiles!customers_author_id_fkey(id, full_name, initials, avatar_url)
        `)
        .order("company_name");
      if (error) throw error;
      return data as Customer[];
    },
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (customerData: Omit<Customer, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("customers")
        .insert(customerData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add customer: " + error.message);
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...customerData }: { id: string } & Partial<Omit<Customer, "id" | "created_at" | "updated_at">>) => {
      const { data, error } = await supabase
        .from("customers")
        .update(customerData)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Customer updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update customer: " + error.message);
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

export function useUploadCustomerDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customerId,
      file,
      documentName,
      documentType,
      notes,
    }: {
      customerId: string;
      file: File;
      documentName: string;
      documentType: string;
      notes?: string;
    }) => {
      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${customerId}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("customer-documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("customer-documents")
        .getPublicUrl(fileName);

      // Create document record
      const { data, error } = await supabase
        .from("customer_documents")
        .insert({
          customer_id: customerId,
          document_name: documentName,
          document_type: documentType,
          document_url: urlData.publicUrl,
          shared_date: new Date().toISOString(),
          notes: notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customer_documents", variables.customerId] });
      toast.success("Document uploaded successfully");
    },
    onError: (error) => {
      toast.error("Failed to upload document: " + error.message);
    },
  });
}

export function useDeleteCustomerDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId, documentUrl, customerId }: { documentId: string; documentUrl: string; customerId: string }) => {
      // Extract file path from URL
      const urlParts = documentUrl.split("/customer-documents/");
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from("customer-documents").remove([filePath]);
      }

      // Delete document record
      const { error } = await supabase
        .from("customer_documents")
        .delete()
        .eq("id", documentId);

      if (error) throw error;
      return { customerId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["customer_documents", data.customerId] });
      toast.success("Document deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete document: " + error.message);
    },
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

export function useCreateOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (opportunityData: Omit<Opportunity, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("opportunities")
        .insert(opportunityData)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["opportunities", data.customer_id] });
      toast.success("Opportunity added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add opportunity: " + error.message);
    },
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

export function useCreateInteraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<OpportunityInteraction, "id" | "created_at" | "updated_at">) => {
      const { data: result, error } = await supabase
        .from("opportunity_interactions")
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["opportunity_interactions", data.opportunity_id] });
      toast.success("Interaction added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add interaction: " + error.message);
    },
  });
}

export function useUpdateInteraction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, opportunityId, ...data }: { id: string; opportunityId: string } & Partial<Omit<OpportunityInteraction, "id" | "created_at" | "updated_at">>) => {
      const { data: result, error } = await supabase
        .from("opportunity_interactions")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return { ...result, opportunityId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["opportunity_interactions", data.opportunityId] });
      toast.success("Interaction updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update interaction: " + error.message);
    },
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

export function useCreateStakeholder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<OpportunityStakeholder, "id" | "created_at" | "updated_at">) => {
      const { data: result, error } = await supabase
        .from("opportunity_stakeholders")
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["opportunity_stakeholders", data.opportunity_id] });
      toast.success("Stakeholder added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add stakeholder: " + error.message);
    },
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

export function useCreateActionStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<OpportunityActionStep, "id" | "created_at" | "updated_at">) => {
      const { data: result, error } = await supabase
        .from("opportunity_action_steps")
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["opportunity_action_steps", data.opportunity_id] });
      toast.success("Action step added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add action step: " + error.message);
    },
  });
}

export function useUpdateActionStep() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, opportunityId, ...data }: { id: string; opportunityId: string } & Partial<Omit<OpportunityActionStep, "id" | "created_at" | "updated_at">>) => {
      const { data: result, error } = await supabase
        .from("opportunity_action_steps")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return { ...result, opportunityId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["opportunity_action_steps", data.opportunityId] });
      toast.success("Action step updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update action step: " + error.message);
    },
  });
}

export function useUpdateOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Omit<Opportunity, "id" | "created_at" | "updated_at">>) => {
      const { data: result, error } = await supabase
        .from("opportunities")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["opportunities", data.customer_id] });
      toast.success("Opportunity updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update opportunity: " + error.message);
    },
  });
}

// Customer Access Types and Hooks
export interface CustomerAccessUser {
  id: string;
  user_id: string;
  customer_id: string;
  granted_by: string;
  created_at: string;
  user?: {
    id: string;
    full_name: string | null;
    initials: string | null;
    avatar_url: string | null;
    email: string | null;
  };
}

export function useCustomerAccess(customerId: string | null) {
  return useQuery({
    queryKey: ["customer_access", customerId],
    queryFn: async () => {
      if (!customerId) return [];
      const { data, error } = await supabase
        .from("customer_access")
        .select(`
          *,
          user:profiles!customer_access_user_id_fkey(id, full_name, initials, avatar_url, email)
        `)
        .eq("customer_id", customerId);
      if (error) throw error;
      return data as CustomerAccessUser[];
    },
    enabled: !!customerId,
  });
}

export function useAllProfiles() {
  return useQuery({
    queryKey: ["all_profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, initials, avatar_url, email")
        .order("full_name");
      if (error) throw error;
      return data;
    },
  });
}

export function useGrantCustomerAccess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customerId, userId, grantedBy }: { customerId: string; userId: string; grantedBy: string }) => {
      const { data, error } = await supabase
        .from("customer_access")
        .insert({
          customer_id: customerId,
          user_id: userId,
          granted_by: grantedBy,
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customer_access", variables.customerId] });
      toast.success("Access granted successfully");
    },
    onError: (error) => {
      toast.error("Failed to grant access: " + error.message);
    },
  });
}

export function useRevokeCustomerAccess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ accessId, customerId }: { accessId: string; customerId: string }) => {
      const { error } = await supabase
        .from("customer_access")
        .delete()
        .eq("id", accessId);
      if (error) throw error;
      return { customerId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["customer_access", data.customerId] });
      toast.success("Access revoked successfully");
    },
    onError: (error) => {
      toast.error("Failed to revoke access: " + error.message);
    },
  });
}
