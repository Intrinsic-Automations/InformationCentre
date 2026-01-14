import { useState } from "react";
import { Handshake, ExternalLink, Building2, Calendar, FileText, Users, Plus, Pencil, X, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import partnershipsHero from "@/assets/partnerships-hero.jpg";

interface Partnership {
  id: string;
  author_id: string | null;
  partner_name: string;
  partnership_type: string | null;
  status: string | null;
  description: string | null;
  since_year: string | null;
  contact_name: string | null;
  contact_email: string | null;
  key_benefits: string[] | null;
  focus_areas: string[] | null;
  created_at: string;
  updated_at: string;
}

const PARTNERSHIP_TYPES = ["Technology", "Consulting", "Data", "Services", "Distribution", "Research"];
const PARTNERSHIP_STATUSES = ["Active", "Pending", "Inactive"];

export default function Partnerships() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPartnership, setSelectedPartnership] = useState<Partnership | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    partner_name: "",
    partnership_type: "",
    status: "Active",
    description: "",
    since_year: new Date().getFullYear().toString(),
    contact_name: "",
    contact_email: "",
    key_benefits: "",
    focus_areas: "",
  });

  // Fetch partnerships
  const { data: partnerships = [], isLoading } = useQuery({
    queryKey: ["partnerships"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partnerships")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Partnership[];
    },
  });

  // Create partnership mutation
  const createPartnership = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!profile) throw new Error("Not authenticated");
      const { error } = await supabase.from("partnerships").insert({
        author_id: profile.id,
        partner_name: data.partner_name,
        partnership_type: data.partnership_type || null,
        status: data.status,
        description: data.description || null,
        since_year: data.since_year || null,
        contact_name: data.contact_name || null,
        contact_email: data.contact_email || null,
        key_benefits: data.key_benefits ? data.key_benefits.split(",").map(s => s.trim()).filter(Boolean) : null,
        focus_areas: data.focus_areas ? data.focus_areas.split(",").map(s => s.trim()).filter(Boolean) : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partnerships"] });
      toast.success("Partnership added successfully");
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to add partnership: " + error.message);
    },
  });

  // Update partnership mutation
  const updatePartnership = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from("partnerships")
        .update({
          partner_name: data.partner_name,
          partnership_type: data.partnership_type || null,
          status: data.status,
          description: data.description || null,
          since_year: data.since_year || null,
          contact_name: data.contact_name || null,
          contact_email: data.contact_email || null,
          key_benefits: data.key_benefits ? data.key_benefits.split(",").map(s => s.trim()).filter(Boolean) : null,
          focus_areas: data.focus_areas ? data.focus_areas.split(",").map(s => s.trim()).filter(Boolean) : null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partnerships"] });
      toast.success("Partnership updated successfully");
      setSelectedPartnership(null);
      setIsEditMode(false);
      resetForm();
    },
    onError: (error) => {
      toast.error("Failed to update partnership: " + error.message);
    },
  });

  const resetForm = () => {
    setFormData({
      partner_name: "",
      partnership_type: "",
      status: "Active",
      description: "",
      since_year: new Date().getFullYear().toString(),
      contact_name: "",
      contact_email: "",
      key_benefits: "",
      focus_areas: "",
    });
  };

  const handleEdit = (partnership: Partnership) => {
    setFormData({
      partner_name: partnership.partner_name,
      partnership_type: partnership.partnership_type || "",
      status: partnership.status || "Active",
      description: partnership.description || "",
      since_year: partnership.since_year || "",
      contact_name: partnership.contact_name || "",
      contact_email: partnership.contact_email || "",
      key_benefits: partnership.key_benefits?.join(", ") || "",
      focus_areas: partnership.focus_areas?.join(", ") || "",
    });
    setIsEditMode(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.partner_name.trim()) {
      toast.error("Partner name is required");
      return;
    }
    
    if (isEditMode && selectedPartnership) {
      updatePartnership.mutate({ id: selectedPartnership.id, data: formData });
    } else {
      createPartnership.mutate(formData);
    }
  };

  const canEdit = (partnership: Partnership) => {
    return profile && partnership.author_id === profile.id;
  };

  const PartnershipForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="partner_name">Partner Name *</Label>
          <Input
            id="partner_name"
            value={formData.partner_name}
            onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })}
            placeholder="e.g., TechCorp Solutions"
          />
        </div>
        
        <div>
          <Label htmlFor="partnership_type">Type</Label>
          <Select
            value={formData.partnership_type}
            onValueChange={(value) => setFormData({ ...formData, partnership_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {PARTNERSHIP_TYPES.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {PARTNERSHIP_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="since_year">Partner Since (Year)</Label>
          <Input
            id="since_year"
            value={formData.since_year}
            onChange={(e) => setFormData({ ...formData, since_year: e.target.value })}
            placeholder="e.g., 2023"
          />
        </div>
        
        <div>
          <Label htmlFor="contact_name">Contact Name</Label>
          <Input
            id="contact_name"
            value={formData.contact_name}
            onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
            placeholder="e.g., John Smith"
          />
        </div>
        
        <div className="col-span-2">
          <Label htmlFor="contact_email">Contact Email</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            placeholder="e.g., john@example.com"
          />
        </div>
        
        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of the partnership..."
            rows={3}
          />
        </div>
        
        <div className="col-span-2">
          <Label htmlFor="key_benefits">Key Benefits (comma-separated)</Label>
          <Input
            id="key_benefits"
            value={formData.key_benefits}
            onChange={(e) => setFormData({ ...formData, key_benefits: e.target.value })}
            placeholder="e.g., Access to cloud infrastructure, Shared expertise"
          />
        </div>
        
        <div className="col-span-2">
          <Label htmlFor="focus_areas">Focus Areas (comma-separated)</Label>
          <Input
            id="focus_areas"
            value={formData.focus_areas}
            onChange={(e) => setFormData({ ...formData, focus_areas: e.target.value })}
            placeholder="e.g., Cloud Migration, DevOps, CI/CD"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (isEditMode) {
              setIsEditMode(false);
            } else {
              setIsAddDialogOpen(false);
            }
            resetForm();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={createPartnership.isPending || updatePartnership.isPending}>
          {isEditMode ? "Save Changes" : "Add Partnership"}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={partnershipsHero}
          alt="Partnerships banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center justify-between px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <Handshake className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">Partnerships</h1>
            </div>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)} 
            size="sm" 
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Partnership
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Loading partnerships...</div>
        ) : partnerships.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No partnerships yet. Click "Add Partnership" to create one.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {partnerships.map((partner) => (
              <Card key={partner.id} className="bg-card">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{partner.partner_name}</CardTitle>
                      <CardDescription>
                        {partner.since_year ? `Partner since ${partner.since_year}` : "Partnership"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant={partner.status === "Active" ? "default" : "secondary"}>
                        {partner.status || "Active"}
                      </Badge>
                      {partner.partnership_type && (
                        <Badge variant="outline">{partner.partnership_type}</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex items-end justify-between gap-4">
                  <p className="text-sm text-foreground/80 line-clamp-2">
                    {partner.description || "No description provided."}
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 shrink-0"
                    onClick={() => {
                      setSelectedPartnership(partner);
                      setIsEditMode(false);
                    }}
                  >
                    Details <ExternalLink className="h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Partnership Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Partnership</DialogTitle>
            <DialogDescription>
              Enter the details of the new partnership.
            </DialogDescription>
          </DialogHeader>
          <PartnershipForm />
        </DialogContent>
      </Dialog>

      {/* Partnership Details Dialog */}
      <Dialog 
        open={!!selectedPartnership} 
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPartnership(null);
            setIsEditMode(false);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {isEditMode ? (
            <>
              <DialogHeader>
                <DialogTitle>Edit Partnership</DialogTitle>
                <DialogDescription>
                  Update the partnership details.
                </DialogDescription>
              </DialogHeader>
              <PartnershipForm />
            </>
          ) : (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <DialogTitle>{selectedPartnership?.partner_name}</DialogTitle>
                      <DialogDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3" />
                        {selectedPartnership?.since_year 
                          ? `Partner since ${selectedPartnership.since_year}`
                          : "Partnership"
                        }
                      </DialogDescription>
                    </div>
                  </div>
                  {selectedPartnership && canEdit(selectedPartnership) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={() => handleEdit(selectedPartnership)}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </div>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <Badge variant={selectedPartnership?.status === "Active" ? "default" : "secondary"}>
                    {selectedPartnership?.status || "Active"}
                  </Badge>
                  {selectedPartnership?.partnership_type && (
                    <Badge variant="outline">{selectedPartnership.partnership_type}</Badge>
                  )}
                </div>

                {selectedPartnership?.description && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">Overview</h4>
                    <p className="text-sm text-muted-foreground">{selectedPartnership.description}</p>
                  </div>
                )}

                <Separator />

                {(selectedPartnership?.contact_name || selectedPartnership?.contact_email) && (
                  <div className="flex items-start gap-3">
                    <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-foreground">Primary Contact</h4>
                      {selectedPartnership.contact_name && (
                        <p className="text-sm text-muted-foreground">{selectedPartnership.contact_name}</p>
                      )}
                      {selectedPartnership.contact_email && (
                        <a 
                          href={`mailto:${selectedPartnership.contact_email}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {selectedPartnership.contact_email}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {selectedPartnership?.key_benefits && selectedPartnership.key_benefits.length > 0 && (
                  <div className="flex items-start gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Key Benefits</h4>
                      <ul className="space-y-1">
                        {selectedPartnership.key_benefits.map((benefit, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary">•</span>
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {selectedPartnership?.focus_areas && selectedPartnership.focus_areas.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Focus Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPartnership.focus_areas.map((area, i) => (
                        <Badge key={i} variant="secondary">{area}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}