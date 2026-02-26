import { useState } from "react";
import { Building2, ExternalLink, Monitor, Bug, CalendarDays, Clock, Receipt, Clipboard, GraduationCap, Database, Globe, Key, Network, Users, Handshake, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useRoles } from "@/hooks/useRoles";
import { toast } from "sonner";
import companySitesHero from "@/assets/company-sites-hero.jpg";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Monitor, Bug, CalendarDays, Clock, Receipt, Clipboard, GraduationCap,
  Database, Globe, Key, Network, Building2, Users, Handshake, ExternalLink,
  Calendar: CalendarDays,
};

const availableIcons = [
  "Monitor", "Bug", "CalendarDays", "Clock", "Receipt", "Clipboard",
  "GraduationCap", "Database", "Globe", "Key", "Network", "Building2",
  "Users", "Handshake",
];

const categories = ["Internal", "Projects", "HR", "Finance", "Learning", "Public", "Portal", "External"];

interface SiteFormData {
  name: string;
  url: string;
  description: string;
  category: string;
  icon: string;
}

const emptySite: SiteFormData = { name: "", url: "", description: "", category: "Internal", icon: "Globe" };

export default function CompanySites() {
  const { isAdminOrModerator } = useRoles();
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<(SiteFormData & { id?: string }) | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [siteToDelete, setSiteToDelete] = useState<string | null>(null);

  const { data: sites = [], isLoading } = useQuery({
    queryKey: ["company-sites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_sites")
        .select("*")
        .eq("is_active", true)
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });

  const upsertSite = useMutation({
    mutationFn: async (site: SiteFormData & { id?: string }) => {
      if (site.id) {
        const { error } = await supabase.from("company_sites").update({
          name: site.name, url: site.url, description: site.description,
          category: site.category, icon: site.icon,
        }).eq("id", site.id);
        if (error) throw error;
      } else {
        const maxOrder = sites.length > 0 ? Math.max(...sites.map(s => s.order_index)) + 1 : 0;
        const { error } = await supabase.from("company_sites").insert({
          name: site.name, url: site.url, description: site.description,
          category: site.category, icon: site.icon, order_index: maxOrder,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-sites"] });
      toast.success(editingSite?.id ? "Site updated" : "Site added");
      setDialogOpen(false);
      setEditingSite(null);
    },
    onError: () => toast.error("Failed to save site"),
  });

  const deleteSite = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("company_sites").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-sites"] });
      toast.success("Site deleted");
    },
    onError: () => toast.error("Failed to delete site"),
  });

  const handleSave = () => {
    if (!editingSite?.name.trim() || !editingSite?.url.trim()) {
      toast.error("Name and URL are required");
      return;
    }
    upsertSite.mutate(editingSite);
  };

  const openAdd = () => { setEditingSite({ ...emptySite }); setDialogOpen(true); };
  const openEdit = (site: any) => {
    setEditingSite({ id: site.id, name: site.name, url: site.url, description: site.description || "", category: site.category, icon: site.icon || "Globe" });
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img src={companySitesHero} alt="Company Sites banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Building2 className="h-4 w-4" />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Company Sites</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {isAdminOrModerator && (
          <div className="flex justify-end mb-4">
            <Button onClick={openAdd} className="gap-2">
              <Plus className="h-4 w-4" />Add Site
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sites.map((site) => {
              const IconComp = iconMap[site.icon || "Globe"] || Globe;
              return (
                <Card key={site.id} className="bg-card hover:bg-card/80 transition-colors group relative">
                  {isAdminOrModerator && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(site)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive hover:text-destructive" onClick={() => { setSiteToDelete(site.id); setDeleteDialogOpen(true); }}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{site.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="flex items-end justify-between gap-4">
                    <p className="text-sm text-foreground/80">{site.description}</p>
                    <Button variant="outline" size="sm" className="gap-2 shrink-0" onClick={() => window.open(site.url, '_blank', 'noopener,noreferrer')}>
                      Visit <ExternalLink className="h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) { setDialogOpen(false); setEditingSite(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingSite?.id ? "Edit Site" : "Add Site"}</DialogTitle>
          </DialogHeader>
          {editingSite && (
            <div className="space-y-4">
              <div><Label>Name</Label><Input value={editingSite.name} onChange={(e) => setEditingSite({ ...editingSite, name: e.target.value })} /></div>
              <div><Label>URL</Label><Input value={editingSite.url} onChange={(e) => setEditingSite({ ...editingSite, url: e.target.value })} placeholder="https://..." /></div>
              <div><Label>Description</Label><Textarea value={editingSite.description} onChange={(e) => setEditingSite({ ...editingSite, description: e.target.value })} rows={2} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={editingSite.category} onValueChange={(v) => setEditingSite({ ...editingSite, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Icon</Label>
                  <Select value={editingSite.icon} onValueChange={(v) => setEditingSite({ ...editingSite, icon: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{availableIcons.map(i => {
                      const IC = iconMap[i] || Globe;
                      return <SelectItem key={i} value={i}><span className="flex items-center gap-2"><IC className="h-4 w-4" />{i}</span></SelectItem>;
                    })}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDialogOpen(false); setEditingSite(null); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={upsertSite.isPending}>
              {upsertSite.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editingSite?.id ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this site?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { if (siteToDelete) deleteSite.mutate(siteToDelete); setDeleteDialogOpen(false); setSiteToDelete(null); }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
