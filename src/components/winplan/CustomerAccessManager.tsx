import { useState } from "react";
import { Users, UserPlus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import {
  useCustomerAccess,
  useAllProfiles,
  useGrantCustomerAccess,
  useRevokeCustomerAccess,
  type Customer,
  type CustomerAccessUser,
} from "@/hooks/useWinPlanData";

interface CustomerAccessManagerProps {
  customer: Customer;
}

export function CustomerAccessManager({ customer }: CustomerAccessManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [accessToRevoke, setAccessToRevoke] = useState<CustomerAccessUser | null>(null);

  const { profile } = useAuth();
  const { data: accessList, isLoading: isLoadingAccess } = useCustomerAccess(customer.id);
  const { data: allProfiles, isLoading: isLoadingProfiles } = useAllProfiles();
  const grantAccess = useGrantCustomerAccess();
  const revokeAccess = useRevokeCustomerAccess();

  const isOwner = profile?.id === customer.author_id;

  // Filter out users who already have access or are the owner
  const availableUsers = allProfiles?.filter(
    (p) =>
      p.id !== customer.author_id &&
      !accessList?.some((a) => a.user_id === p.id)
  );

  const handleGrantAccess = () => {
    if (!selectedUserId || !profile?.id) return;

    grantAccess.mutate(
      {
        customerId: customer.id,
        userId: selectedUserId,
        grantedBy: profile.id,
      },
      {
        onSuccess: () => {
          setIsAddOpen(false);
          setSelectedUserId("");
        },
      }
    );
  };

  const handleRevokeAccess = () => {
    if (!accessToRevoke) return;

    revokeAccess.mutate(
      {
        accessId: accessToRevoke.id,
        customerId: customer.id,
      },
      {
        onSuccess: () => {
          setRevokeDialogOpen(false);
          setAccessToRevoke(null);
        },
      }
    );
  };

  const openRevokeDialog = (access: CustomerAccessUser) => {
    setAccessToRevoke(access);
    setRevokeDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Access
          </CardTitle>
          {isOwner && (
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Grant Customer Access</DialogTitle>
                  <DialogDescription>
                    Select a user to grant them access to view this customer's data.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="user">Select User</Label>
                    <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a user..." />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingProfiles ? (
                          <SelectItem value="" disabled>
                            Loading users...
                          </SelectItem>
                        ) : availableUsers?.length === 0 ? (
                          <SelectItem value="" disabled>
                            No users available
                          </SelectItem>
                        ) : (
                          availableUsers?.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={user.avatar_url || undefined} />
                                  <AvatarFallback className="text-xs">
                                    {user.initials || "?"}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{user.full_name || user.email}</span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleGrantAccess}
                      disabled={!selectedUserId || grantAccess.isPending}
                    >
                      {grantAccess.isPending ? "Granting..." : "Grant Access"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Owner */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={customer.author?.avatar_url || undefined} />
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {customer.author?.initials || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{customer.author?.full_name || "Unknown"}</p>
                <p className="text-xs text-muted-foreground">Owner</p>
              </div>
            </div>
          </div>

          {/* Access List */}
          {isLoadingAccess ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : accessList && accessList.length > 0 ? (
            accessList.map((access) => (
              <div
                key={access.id}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50 border"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={access.user?.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">
                      {access.user?.initials || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">
                      {access.user?.full_name || access.user?.email || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">Has access</p>
                  </div>
                </div>
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => openRevokeDialog(access)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No additional users have access
            </p>
          )}
        </div>
      </CardContent>

      {/* Revoke Confirmation Dialog */}
      <AlertDialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to REVOKE access?</AlertDialogTitle>
            <AlertDialogDescription>
              {accessToRevoke?.user?.full_name || "This user"} will no longer be able to view this customer's data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAccessToRevoke(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRevokeAccess}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke Access
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
