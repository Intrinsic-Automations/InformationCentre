import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface TrainingContent {
  id: string;
  course_slug: string;
  about_content: string | null;
  objectives: string[];
  duration: string | null;
  level: string | null;
  updated_at: string;
  updated_by: string | null;
}

export function useTrainingContent(courseSlug: string | undefined) {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["training-content", courseSlug],
    queryFn: async () => {
      if (!courseSlug) return null;
      const { data, error } = await supabase
        .from("training_content")
        .select("*")
        .eq("course_slug", courseSlug)
        .maybeSingle();

      if (error) throw error;
      return data as TrainingContent | null;
    },
    enabled: !!courseSlug,
  });

  const upsertMutation = useMutation({
    mutationFn: async (content: { about_content?: string; objectives?: string[]; duration?: string; level?: string }) => {
      if (!courseSlug) throw new Error("No course slug");

      const { data: existing } = await supabase
        .from("training_content")
        .select("id")
        .eq("course_slug", courseSlug)
        .maybeSingle();

      if (existing) {
        const { data, error } = await supabase
          .from("training_content")
          .update({ ...content, updated_by: profile?.id || null })
          .eq("course_slug", courseSlug)
          .select()
          .single();
        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("training_content")
          .insert({ course_slug: courseSlug, ...content, updated_by: profile?.id || null })
          .select()
          .single();
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (data) => {
      // Immediately update the cache with the returned data
      queryClient.setQueryData(["training-content", courseSlug], data);
      queryClient.invalidateQueries({ queryKey: ["training-content", courseSlug] });
    },
  });

  return {
    content: query.data,
    isLoading: query.isLoading,
    upsertContent: upsertMutation,
  };
}
