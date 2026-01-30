import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FileText, User, ArrowDownToLine, ArrowUpFromLine, Package } from "lucide-react";
import type { TimelineItem } from "./ExecutionTimelineData";
import { useExecutionDocuments } from "@/hooks/useExecutionDocuments";
import { DocumentUploadSection } from "./DocumentUploadSection";

interface ExecutionItemDetailDialogProps {
  item: TimelineItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExecutionItemDetailDialog({ item, open, onOpenChange }: ExecutionItemDetailDialogProps) {
  const { documents, uploadDocument, downloadDocument, deleteDocument } = useExecutionDocuments(
    open ? item?.id || null : null
  );

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            {item.title}
            {item.isDeliverable && (
              <Badge variant="default" className="bg-emerald-500 text-white">
                <Package className="h-3 w-3 mr-1" />
                Deliverable
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {item.description || "No description available."}
            </p>
          </div>

          <Separator />

          {/* Responsible Role */}
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Responsible Role</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {item.responsibleRole || "To be assigned"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Inputs & Outputs */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-muted/30 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ArrowDownToLine className="h-4 w-4 text-blue-500" />
                  Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {item.inputs && item.inputs.length > 0 ? (
                  <ul className="space-y-1.5">
                    {item.inputs.map((input, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        {input}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No inputs specified</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-muted/30 border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ArrowUpFromLine className="h-4 w-4 text-emerald-500" />
                  Outputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {item.outputs && item.outputs.length > 0 ? (
                  <ul className="space-y-1.5">
                    {item.outputs.map((output, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-emerald-500 mt-1">•</span>
                        {output}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">No outputs specified</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Document Upload/Download Sections */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Documents</h4>
            <div className="grid sm:grid-cols-2 gap-4">
              <DocumentUploadSection
                title="Template Documents"
                documentType="template"
                documents={documents}
                onUpload={uploadDocument}
                onDownload={downloadDocument}
                onDelete={deleteDocument}
              />
              <DocumentUploadSection
                title="Example Documents"
                documentType="example"
                documents={documents}
                onUpload={uploadDocument}
                onDownload={downloadDocument}
                onDelete={deleteDocument}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
