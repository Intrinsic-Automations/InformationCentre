import { Button } from "@/components/ui/button";
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

const PARTNERSHIP_TYPES = ["Technology", "Consulting", "Data", "Services", "Distribution", "Research"];
const PARTNERSHIP_STATUSES = ["Active", "Pending", "Inactive"];

export interface PartnershipFormData {
  partner_name: string;
  partnership_type: string;
  status: string;
  description: string;
  since_year: string;
  contact_name: string;
  contact_email: string;
  key_benefits: string;
  focus_areas: string;
}

interface PartnershipFormProps {
  formData: PartnershipFormData;
  onFormDataChange: (data: PartnershipFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEditMode: boolean;
}

export function PartnershipForm({
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isSubmitting,
  isEditMode,
}: PartnershipFormProps) {
  const updateField = (field: keyof PartnershipFormData, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="partner_name">Partner Name *</Label>
          <Input
            id="partner_name"
            value={formData.partner_name}
            onChange={(e) => updateField("partner_name", e.target.value)}
            placeholder="e.g., TechCorp Solutions"
          />
        </div>
        
        <div>
          <Label htmlFor="partnership_type">Type</Label>
          <Select
            value={formData.partnership_type}
            onValueChange={(value) => updateField("partnership_type", value)}
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
            onValueChange={(value) => updateField("status", value)}
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
            onChange={(e) => updateField("since_year", e.target.value)}
            placeholder="e.g., 2023"
          />
        </div>
        
        <div>
          <Label htmlFor="contact_name">Contact Name</Label>
          <Input
            id="contact_name"
            value={formData.contact_name}
            onChange={(e) => updateField("contact_name", e.target.value)}
            placeholder="e.g., John Smith"
          />
        </div>
        
        <div className="col-span-2">
          <Label htmlFor="contact_email">Contact Email</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => updateField("contact_email", e.target.value)}
            placeholder="e.g., john@example.com"
          />
        </div>
        
        <div className="col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Brief description of the partnership..."
            rows={3}
          />
        </div>
        
        <div className="col-span-2">
          <Label htmlFor="key_benefits">Key Benefits (comma-separated)</Label>
          <Input
            id="key_benefits"
            value={formData.key_benefits}
            onChange={(e) => updateField("key_benefits", e.target.value)}
            placeholder="e.g., Access to cloud infrastructure, Shared expertise"
          />
        </div>
        
        <div className="col-span-2">
          <Label htmlFor="focus_areas">Focus Areas (comma-separated)</Label>
          <Input
            id="focus_areas"
            value={formData.focus_areas}
            onChange={(e) => updateField("focus_areas", e.target.value)}
            placeholder="e.g., Cloud Migration, DevOps, CI/CD"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isEditMode ? "Save Changes" : "Add Partnership"}
        </Button>
      </div>
    </form>
  );
}