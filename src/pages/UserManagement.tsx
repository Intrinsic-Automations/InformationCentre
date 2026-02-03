import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRoles, AppRole } from "@/hooks/useRoles";
import { Navigate } from "react-router-dom";
import { Users, Shield, Search, UserCog } from "lucide-react";
import userManagementHero from "@/assets/user-management-hero.jpg";

interface Profile {
  id: string;
  full_name: string;
  email: string | null;
  role: string | null;
  department: string | null;
  is_active: boolean;
  initials: string;
  avatar_url: string | null;
}

interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
}

export default function UserManagement() {
  const { isAdmin, isLoading: rolesLoading } = useRoles();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch all profiles
  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ["all-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("full_name");

      if (error) throw error;
      return data as Profile[];
    },
    enabled: isAdmin,
  });

  // Fetch all user roles (admin only)
  const { data: allRoles } = useQuery({
    queryKey: ["all-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("*");
      if (error) throw error;
      return data as UserRole[];
    },
    enabled: isAdmin,
  });

  // Update user active status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ is_active: isActive })
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-profiles"] });
      toast({ title: "User status updated" });
    },
    onError: (error) => {
      toast({ title: "Error updating status", description: error.message, variant: "destructive" });
    },
  });

  // Assign role mutation
  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      // First remove existing roles for this user
      await supabase.from("user_roles").delete().eq("user_id", userId);
      
      // Then assign new role
      const { error } = await supabase.from("user_roles").insert({
        user_id: userId,
        role: role,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-user-roles"] });
      toast({ title: "User role updated" });
    },
    onError: (error) => {
      toast({ title: "Error updating role", description: error.message, variant: "destructive" });
    },
  });

  const getUserRole = (userId: string): AppRole => {
    const userRole = allRoles?.find((r) => r.user_id === userId);
    return userRole?.role ?? "user";
  };

  const filteredProfiles = profiles?.filter(
    (p) =>
      p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Redirect non-admins
  if (!rolesLoading && !isAdmin) {
    return <Navigate to="/onboarding" replace />;
  }

  if (rolesLoading || profilesLoading) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Hero Banner with Title - Sticky */}
        <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
          <img
            src={userManagementHero}
            alt="User Management banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
          <div className="absolute inset-0 flex items-center px-6 md:px-12">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
                <UserCog className="h-4 w-4" />
              </div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">User Management</h1>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={userManagementHero}
          alt="User Management banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <UserCog className="h-4 w-4" />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">User Management</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
        {/* Role Explanations */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Role Permissions</CardTitle>
            <CardDescription>Understanding the different access levels in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Admin</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Full system access including user management, role assignment, and all content moderation capabilities.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Moderator</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Can edit and delete any user's content, manage announcements, and moderate community posts. No access to user management.
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">User</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Standard access to the platform. Can create and manage their own content only.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profiles?.length ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profiles?.filter((p) => p.is_active).length ?? 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allRoles?.filter((r) => r.role === "admin").length ?? 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>View and manage all registered users</CardDescription>
            <div className="flex items-center gap-2 pt-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>System Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles?.map((profile) => {
                  const systemRole = getUserRole(profile.id);
                  return (
                    <TableRow key={profile.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={profile.avatar_url || undefined} />
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {profile.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{profile.full_name}</div>
                            <div className="text-sm text-muted-foreground">{profile.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{profile.role || "-"}</TableCell>
                      <TableCell>{profile.department || "-"}</TableCell>
                      <TableCell>
                        <Select
                          value={systemRole}
                          onValueChange={(value) => {
                            assignRoleMutation.mutate({
                              userId: profile.id,
                              role: value as AppRole,
                            });
                          }}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge variant={profile.is_active ? "default" : "secondary"}>
                          {profile.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={profile.is_active}
                            onCheckedChange={(checked) =>
                              updateStatusMutation.mutate({
                                userId: profile.id,
                                isActive: checked,
                              })
                            }
                          />
                          <span className="text-sm text-muted-foreground">
                            {profile.is_active ? "Deactivate" : "Activate"}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
}
