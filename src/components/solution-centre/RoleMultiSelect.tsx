import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, X } from "lucide-react";

const AVAILABLE_ROLES = [
  "Customer Engagement Manager",
  "Project Manager",
  "Business Owner",
  "Solution Architect",
  "Migration Lead",
  "Business Data Owner",
  "Data Analyst",
  "Data Architect",
  "ETL Developer",
  "CAD Specialist",
  "DQ Lead",
] as const;

interface RoleMultiSelectProps {
  value: string[];
  onChange: (roles: string[]) => void;
}

export function RoleMultiSelect({ value, onChange }: RoleMultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggleRole = (role: string) => {
    if (value.includes(role)) {
      onChange(value.filter((r) => r !== role));
    } else {
      onChange([...value, role]);
    }
  };

  const removeRole = (role: string) => {
    onChange(value.filter((r) => r !== role));
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal h-auto min-h-10"
          >
            <span className="text-muted-foreground">
              {value.length === 0
                ? "Select responsible roles..."
                : `${value.length} role${value.length > 1 ? "s" : ""} selected`}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <div className="max-h-60 overflow-y-auto p-2 space-y-1">
            {AVAILABLE_ROLES.map((role) => (
              <label
                key={role}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted cursor-pointer text-sm"
              >
                <Checkbox
                  checked={value.includes(role)}
                  onCheckedChange={() => toggleRole(role)}
                />
                {role}
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((role) => (
            <Badge
              key={role}
              variant="secondary"
              className="text-xs gap-1 pr-1"
            >
              {role}
              <button
                type="button"
                onClick={() => removeRole(role)}
                className="ml-0.5 hover:text-destructive rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
