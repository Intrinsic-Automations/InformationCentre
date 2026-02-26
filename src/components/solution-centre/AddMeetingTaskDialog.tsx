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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddMeetingTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phaseId: string;
  methodSlug: string;
  onSave: (data: { title: string; type: "meeting" | "task"; phase_id: string; method_slug: string; order_index: number }) => void;
  isPending?: boolean;
  existingCount: number;
}

export function AddMeetingTaskDialog({
  open,
  onOpenChange,
  phaseId,
  methodSlug,
  onSave,
  isPending,
  existingCount,
}: AddMeetingTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"meeting" | "task">("meeting");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      type,
      phase_id: phaseId,
      method_slug: methodSlug,
      order_index: existingCount,
    });
    setTitle("");
    setType("meeting");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Meeting or Task</DialogTitle>
          <DialogDescription>Add a key meeting or task to this phase</DialogDescription>
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || isPending}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
