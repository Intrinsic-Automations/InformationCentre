import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const METHOD_TAGS = ["Migration", "Integration", "R&A", "Installation"] as const;

interface MethodTagSelectProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export function MethodTagSelect({ value, onChange }: MethodTagSelectProps) {
  const toggle = (tag: string) => {
    if (value.includes(tag)) {
      onChange(value.filter((t) => t !== tag));
    } else {
      onChange([...value, tag]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {METHOD_TAGS.map((tag) => {
        const selected = value.includes(tag);
        return (
          <Badge
            key={tag}
            variant={selected ? "default" : "outline"}
            className={cn(
              "cursor-pointer select-none transition-colors",
              selected && "bg-primary text-primary-foreground",
              !selected && "hover:bg-muted"
            )}
            onClick={() => toggle(tag)}
          >
            {tag}
          </Badge>
        );
      })}
    </div>
  );
}

export { METHOD_TAGS };
