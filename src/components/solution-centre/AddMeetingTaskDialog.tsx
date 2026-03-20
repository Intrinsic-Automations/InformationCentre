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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import type { LifecycleMeetingTask } from "@/hooks/useLifecycleItems";
import { RoleMultiSelect } from "./RoleMultiSelect";

interface AddMeetingTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phaseId: string;
  methodSlug: string;
  onSave: (data: Omit<LifecycleMeetingTask, "id" | "created_at" | "created_by">) => void;
  onUpdate?: (data: { id: string } & Partial<LifecycleMeetingTask>) => void;
  isPending?: boolean;
  existingCount: number;
  item?: LifecycleMeetingTask | null;
}

export function AddMeetingTaskDialog({
  open,
  onOpenChange,
  phaseId,
  methodSlug,
  onSave,
  onUpdate,
  isPending,
  existingCount,
  item,
}: AddMeetingTaskDialogProps) {
  const isEditing = !!item;

  const [title, setTitle] = useState(item?.title || "");
  const [type, setType] = useState<"meeting" | "task">(item?.type || "meeting");
  const [description, setDescription] = useState(item?.description || "");
  const [responsibleRole, setResponsibleRole] = useState<string[]>(item?.responsible_role || []);
  const [inputs, setInputs] = useState<string[]>(item?.inputs || []);
  const [outputs, setOutputs] = useState<string[]>(item?.outputs || []);
  const [newInput, setNewInput] = useState("");
  const [newOutput, setNewOutput] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    const data = {
      title: title.trim(),
      type,
      description: description.trim() || null,
      responsible_role: responsibleRole.trim() || null,
      inputs,
      outputs,
      phase_id: phaseId,
      method_slug: methodSlug,
      order_index: item?.order_index ?? existingCount,
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
          <DialogTitle>{isEditing ? "Edit Meeting / Task" : "Add Meeting or Task"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the meeting or task details" : "Add a key meeting or task to this phase"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Meeting or task title" />
          </div>
          <div>
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as "meeting" | "task")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="task">Task</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the purpose and scope" rows={3} />
          </div>
          <div>
            <Label>Responsible Role</Label>
            <Input value={responsibleRole} onChange={(e) => setResponsibleRole(e.target.value)} placeholder="e.g. Project Manager" />
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
            {isEditing ? "Save Changes" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
