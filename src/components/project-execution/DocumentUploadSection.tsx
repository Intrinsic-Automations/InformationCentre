import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Download, Trash2, FileText, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ExecutionDocument } from "@/hooks/useExecutionDocuments";

interface DocumentUploadSectionProps {
  title: string;
  documentType: "template" | "example";
  documents: ExecutionDocument[];
  onUpload: (file: File, type: "template" | "example") => Promise<void>;
  onDownload: (document: ExecutionDocument) => Promise<void>;
  onDelete: (document: ExecutionDocument) => Promise<void>;
}

export function DocumentUploadSection({
  title,
  documentType,
  documents,
  onUpload,
  onDownload,
  onDelete,
}: DocumentUploadSectionProps) {
  const [uploading, setUploading] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<ExecutionDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDocuments = documents.filter(
    (doc) => doc.document_type === documentType
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await onUpload(file, documentType);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteClick = (document: ExecutionDocument) => {
    setDocumentToDelete(document);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (documentToDelete) {
      await onDelete(documentToDelete);
      setDocumentToDelete(null);
      setDeleteConfirmOpen(false);
    }
  };

  return (
    <>
      <Card className="bg-muted/30 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className={`h-4 w-4 ${documentType === "template" ? "text-primary" : "text-amber-500"}`} />
              {title}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="h-7 text-xs"
            >
              {uploading ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Upload className="h-3 w-3 mr-1" />
              )}
              Upload
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length > 0 ? (
            <div className="space-y-2">
              {filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2 bg-background rounded-md border border-border/50"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{doc.document_name}</p>
                      <p className="text-xs text-muted-foreground">{doc.file_size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onDownload(doc)}
                    >
                      <Download className="h-3.5 w-3.5 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleDeleteClick(doc)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic text-center py-4">
              No {documentType} documents uploaded yet
            </p>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{documentToDelete?.document_name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
