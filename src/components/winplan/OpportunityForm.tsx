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

export interface OpportunityFormData {
  opportunity_name: string;
  deal_summary: string;
  value_proposition: string;
  compelling_reasons: string;
  key_issues: string;
  blockers: string;
  estimated_value: string;
  stage: string;
  probability: string;
  expected_close_date: string;
  industry: string;
  exec_owner: string;
  opportunity_owner: string;
  quarter_to_close: string;
  services_value: string;
  software_sales: string;
}

interface OpportunityFormProps {
  formData: OpportunityFormData;
  onFormDataChange: (data: OpportunityFormData) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  isEditMode?: boolean;
}

const stageOptions = [
  { value: "prospecting", label: "Prospecting" },
  { value: "qualification", label: "Qualification" },
  { value: "proposal", label: "Proposal" },
  { value: "negotiation", label: "Negotiation" },
  { value: "closed_won", label: "Closed Won" },
  { value: "closed_lost", label: "Closed Lost" },
];

const quarterOptions = [
  { value: "Q1", label: "Q1" },
  { value: "Q2", label: "Q2" },
  { value: "Q3", label: "Q3" },
  { value: "Q4", label: "Q4" },
];

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

export function OpportunityForm({
  formData,
  onFormDataChange,
  onSubmit,
  onCancel,
  isSubmitting,
  isEditMode = false,
}: OpportunityFormProps) {
  const updateField = (field: keyof OpportunityFormData, value: string) => {
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="opportunity_name">Opportunity Name *</Label>
          <Input
            id="opportunity_name"
            value={formData.opportunity_name}
            onChange={(e) => updateField("opportunity_name", e.target.value)}
            placeholder="Enter opportunity name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stage">Stage</Label>
          <Select
            value={formData.stage}
            onValueChange={(value) => updateField("stage", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {stageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="deal_summary">Deal Summary</Label>
        <Textarea
          id="deal_summary"
          value={formData.deal_summary}
          onChange={(e) => updateField("deal_summary", e.target.value)}
          placeholder="Summarize the deal..."
          rows={2}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="estimated_value">Estimated Value ($)</Label>
          <Input
            id="estimated_value"
            type="number"
            value={formData.estimated_value}
            onChange={(e) => updateField("estimated_value", e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="services_value">Services Value ($)</Label>
          <Input
            id="services_value"
            type="number"
            value={formData.services_value}
            onChange={(e) => updateField("services_value", e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="software_sales">Software Sales ($)</Label>
          <Input
            id="software_sales"
            type="number"
            value={formData.software_sales}
            onChange={(e) => updateField("software_sales", e.target.value)}
            placeholder="0"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="probability">Probability (%)</Label>
          <Input
            id="probability"
            type="number"
            min="0"
            max="100"
            value={formData.probability}
            onChange={(e) => updateField("probability", e.target.value)}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expected_close_date">Expected Close Date</Label>
          <Input
            id="expected_close_date"
            type="date"
            value={formData.expected_close_date}
            onChange={(e) => updateField("expected_close_date", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quarter_to_close">Quarter to Close</Label>
          <Select
            value={formData.quarter_to_close}
            onValueChange={(value) => updateField("quarter_to_close", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select quarter" />
            </SelectTrigger>
            <SelectContent>
              {quarterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="exec_owner">Exec Owner</Label>
          <Input
            id="exec_owner"
            value={formData.exec_owner}
            onChange={(e) => updateField("exec_owner", e.target.value)}
            placeholder="Executive owner name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="opportunity_owner">Opportunity Owner</Label>
          <Input
            id="opportunity_owner"
            value={formData.opportunity_owner}
            onChange={(e) => updateField("opportunity_owner", e.target.value)}
            placeholder="Opportunity owner name"
          />
        </div>
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

      <div className="space-y-2">
        <Label htmlFor="value_proposition">Value Proposition</Label>
        <Textarea
          id="value_proposition"
          value={formData.value_proposition}
          onChange={(e) => updateField("value_proposition", e.target.value)}
          placeholder="What value does this opportunity provide?"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="compelling_reasons">Compelling Reasons</Label>
        <Textarea
          id="compelling_reasons"
          value={formData.compelling_reasons}
          onChange={(e) => updateField("compelling_reasons", e.target.value)}
          placeholder="Why should the customer act now?"
          rows={2}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="key_issues">Key Issues</Label>
          <Textarea
            id="key_issues"
            value={formData.key_issues}
            onChange={(e) => updateField("key_issues", e.target.value)}
            placeholder="Key issues to address..."
            rows={2}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="blockers">Blockers</Label>
          <Textarea
            id="blockers"
            value={formData.blockers}
            onChange={(e) => updateField("blockers", e.target.value)}
            placeholder="What could block this deal?"
            rows={2}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={isSubmitting || !formData.opportunity_name.trim()}
        >
          {isSubmitting ? (isEditMode ? "Saving..." : "Adding...") : (isEditMode ? "Save Changes" : "Add Opportunity")}
        </Button>
      </div>
    </div>
  );
}
