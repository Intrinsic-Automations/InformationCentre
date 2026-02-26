import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface LifecycleItem {
  id: string;
  method_slug: string;
  phase_id: string;
  title: string;
  description: string | null;
  is_deliverable: boolean;
  has_template: boolean;
  responsible_role: string | null;
  inputs: string[];
  outputs: string[];
  order_index: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface LifecycleMeetingTask {
  id: string;
  method_slug: string;
  phase_id: string;
  title: string;
  type: "meeting" | "task";
  order_index: number;
  created_at: string;
  created_by: string | null;
}

export function useLifecycleItems(methodSlug: string) {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const itemsQuery = useQuery({
    queryKey: ["lifecycle-items", methodSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lifecycle_items")
        .select("*")
        .eq("method_slug", methodSlug)
        .order("order_index");

      if (error) throw error;
      return data as LifecycleItem[];
    },
  });

  const meetingsTasksQuery = useQuery({
    queryKey: ["lifecycle-meetings-tasks", methodSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lifecycle_meetings_tasks")
        .select("*")
        .eq("method_slug", methodSlug)
        .order("order_index");

      if (error) throw error;
      return data as LifecycleMeetingTask[];
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async (item: Omit<LifecycleItem, "id" | "created_at" | "updated_at" | "created_by">) => {
      const { error } = await supabase.from("lifecycle_items").insert({
        ...item,
        created_by: profile?.id || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lifecycle-items", methodSlug] });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<LifecycleItem> & { id: string }) => {
      const { error } = await supabase
        .from("lifecycle_items")
        .update(updates)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lifecycle-items", methodSlug] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("lifecycle_items")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lifecycle-items", methodSlug] });
    },
  });

  const addMeetingTaskMutation = useMutation({
    mutationFn: async (item: Omit<LifecycleMeetingTask, "id" | "created_at" | "created_by">) => {
      const { error } = await supabase.from("lifecycle_meetings_tasks").insert({
        ...item,
        created_by: profile?.id || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lifecycle-meetings-tasks", methodSlug] });
    },
  });

  const deleteMeetingTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("lifecycle_meetings_tasks")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lifecycle-meetings-tasks", methodSlug] });
    },
  });

  // Group items by phase
  const itemsByPhase = (phaseId: string) =>
    (itemsQuery.data || []).filter((i) => i.phase_id === phaseId);

  const meetingTasksByPhase = (phaseId: string) =>
    (meetingsTasksQuery.data || []).filter((m) => m.phase_id === phaseId);

  return {
    items: itemsQuery.data || [],
    meetingsTasks: meetingsTasksQuery.data || [],
    isLoading: itemsQuery.isLoading || meetingsTasksQuery.isLoading,
    itemsByPhase,
    meetingTasksByPhase,
    addItem: addItemMutation,
    updateItem: updateItemMutation,
    deleteItem: deleteItemMutation,
    addMeetingTask: addMeetingTaskMutation,
    deleteMeetingTask: deleteMeetingTaskMutation,
  };
}
