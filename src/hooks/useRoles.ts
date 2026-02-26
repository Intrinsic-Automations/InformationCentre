import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type AppRole = "admin" | "moderator" | "content_admin" | "user";

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export function useRoles() {
  const { profile } = useAuth();

  const { data: userRoles, isLoading } = useQuery({
    queryKey: ["user-roles", profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", profile.id);

      if (error) {
        console.error("Error fetching user roles:", error);
        return [];
      }
      return data as UserRole[];
    },
    enabled: !!profile?.id,
  });

  const isAdmin = userRoles?.some((r) => r.role === "admin") ?? false;
  const isModerator = userRoles?.some((r) => r.role === "moderator") ?? false;
  const isContentAdmin = userRoles?.some((r) => r.role === "content_admin") ?? false;
  const isAdminOrModerator = isAdmin || isModerator || isContentAdmin;

  const hasRole = (role: AppRole) => userRoles?.some((r) => r.role === role) ?? false;

  return {
    userRoles,
    isAdmin,
    isModerator,
    isContentAdmin,
    isAdminOrModerator,
    hasRole,
    isLoading,
  };
}
