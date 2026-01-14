import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface CustomerFormData {
  company_name: string;
  industry: string;
  website: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  notes: string;
  status: string;
}

interface CustomerFormProps {
  formData: CustomerFormData;
  onFormDataChange: (data: CustomerFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEditMode?: boolean;
}

const industryOptions = [
  "Technology",
  "Healthcare",
  "Finance",
  "Manufacturing",
  "Retail",
  "Energy",
  "Telecommunications",
  "Transportation",
  "Education",
  "Government",
  "Other",
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "prospect", label: "Prospect" },
  { value: "inactive", label: "Inactive" },
];

export function CustomerForm({
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isSubmitting,
  isEditMode = false,
}: CustomerFormProps) {
  const updateField = (field: keyof CustomerFormData, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name *</Label>
          <Input
            id="company_name"
            value={formData.company_name}
            onChange={(e) => updateField("company_name", e.target.value)}
            placeholder="Enter company name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select
            value={formData.industry}
            onValueChange={(value) => updateField("industry", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industryOptions.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => updateField("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => updateField("website", e.target.value)}
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact_name">Contact Name</Label>
          <Input
            id="contact_name"
            value={formData.contact_name}
            onChange={(e) => updateField("contact_name", e.target.value)}
            placeholder="Primary contact name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact_email">Contact Email</Label>
          <Input
            id="contact_email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => updateField("contact_email", e.target.value)}
            placeholder="contact@example.com"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact_phone">Contact Phone</Label>
          <Input
            id="contact_phone"
            value={formData.contact_phone}
            onChange={(e) => updateField("contact_phone", e.target.value)}
            placeholder="+1 234 567 890"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => updateField("address", e.target.value)}
            placeholder="Company address"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => updateField("notes", e.target.value)}
          placeholder="Additional notes about this customer..."
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || !formData.company_name.trim()}
        >
          {isSubmitting ? (isEditMode ? "Saving..." : "Adding...") : (isEditMode ? "Save Changes" : "Add Customer")}
        </Button>
      </div>
    </div>
  );
}
