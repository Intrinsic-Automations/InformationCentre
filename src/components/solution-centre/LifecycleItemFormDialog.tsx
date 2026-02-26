import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, X } from "lucide-react";
import type { LifecycleItem } from "@/hooks/useLifecycleItems";

interface LifecycleItemFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: LifecycleItem | null;
  phaseId: string;
  methodSlug: string;
  onSave: (data: {
    title: string;
    description: string;
    is_deliverable: boolean;
    has_template: boolean;
    responsible_role: string;
    inputs: string[];
    outputs: string[];
    phase_id: string;
    method_slug: string;
    order_index: number;
  }) => void;
  onUpdate?: (data: { id: string } & Partial<LifecycleItem>) => void;
  isPending?: boolean;
  existingItemsCount: number;
}

export function LifecycleItemFormDialog({
  open,
  onOpenChange,
  item,
  phaseId,
  methodSlug,
  onSave,
  onUpdate,
  isPending,
  existingItemsCount,
}: LifecycleItemFormDialogProps) {
  const isEditing = !!item;

  const [title, setTitle] = useState(item?.title || "");
  const [description, setDescription] = useState(item?.description || "");
  const [isDeliverable, setIsDeliverable] = useState(item?.is_deliverable || false);
  const [hasTemplate, setHasTemplate] = useState(item?.has_template ?? true);
  const [responsibleRole, setResponsibleRole] = useState(item?.responsible_role || "");
  const [inputs, setInputs] = useState<string[]>(item?.inputs || []);
  const [outputs, setOutputs] = useState<string[]>(item?.outputs || []);
  const [newInput, setNewInput] = useState("");
  const [newOutput, setNewOutput] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;

    const data = {
      title: title.trim(),
      description: description.trim(),
      is_deliverable: isDeliverable,
      has_template: hasTemplate,
      responsible_role: responsibleRole.trim(),
      inputs,
      outputs,
      phase_id: phaseId,
      method_slug: methodSlug,
      order_index: item?.order_index ?? existingItemsCount,
    };

    if (isEditing && onUpdate && item) {
      onUpdate({ id: item.id, ...data });
    } else {
      onSave(data);
    }
  };

  const addInput = () => {
    if (newInput.trim()) {
      setInputs([...inputs, newInput.trim()]);
      setNewInput("");
    }
  };

  const addOutput = () => {
    if (newOutput.trim()) {
      setOutputs([...outputs, newOutput.trim()]);
      setNewOutput("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Item" : "Add New Item"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the lifecycle item details" : "Add a new item to this phase"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Item title" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Item description" rows={3} />
          </div>

          <div>
            <Label htmlFor="role">Responsible Role</Label>
            <Input id="role" value={responsibleRole} onChange={(e) => setResponsibleRole(e.target.value)} placeholder="e.g. Project Manager" />
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch checked={isDeliverable} onCheckedChange={setIsDeliverable} />
              <Label>Customer Deliverable</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={hasTemplate} onCheckedChange={setHasTemplate} />
              <Label>Has Template</Label>
            </div>
          </div>

          {/* Inputs */}
          <div>
            <Label>Inputs</Label>
            <div className="space-y-1 mt-1">
              {inputs.map((inp, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="flex-1 text-muted-foreground">• {inp}</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setInputs(inputs.filter((_, idx) => idx !== i))}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-1">
              <Input value={newInput} onChange={(e) => setNewInput(e.target.value)} placeholder="Add input" className="text-sm" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInput())} />
              <Button variant="outline" size="sm" onClick={addInput}><Plus className="h-3 w-3" /></Button>
            </div>
          </div>

          {/* Outputs */}
          <div>
            <Label>Outputs</Label>
            <div className="space-y-1 mt-1">
              {outputs.map((out, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="flex-1 text-muted-foreground">• {out}</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setOutputs(outputs.filter((_, idx) => idx !== i))}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-1">
              <Input value={newOutput} onChange={(e) => setNewOutput(e.target.value)} placeholder="Add output" className="text-sm" onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOutput())} />
              <Button variant="outline" size="sm" onClick={addOutput}><Plus className="h-3 w-3" /></Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || isPending}>
            {isEditing ? "Save Changes" : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
