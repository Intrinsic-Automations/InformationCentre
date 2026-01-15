import { useState, useRef } from "react";
import { Building2, Globe, Mail, Phone, User, FileText, Presentation, FileCheck, File, Upload, Download, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Customer, CustomerDocument } from "@/hooks/useWinPlanData";
import { useUploadCustomerDocument, useDeleteCustomerDocument } from "@/hooks/useWinPlanData";
import { format } from "date-fns";
import { CustomerAccessManager } from "./CustomerAccessManager";

interface CustomerDetailsProps {
  customer: Customer | undefined;
  documents: CustomerDocument[] | undefined;
  isLoadingDocuments: boolean;
}

const documentTypeIcons: Record<string, React.ReactNode> = {
  nda: <FileCheck className="h-4 w-4" />,
  presentation: <Presentation className="h-4 w-4" />,
  proposal: <FileText className="h-4 w-4" />,
  contract: <FileCheck className="h-4 w-4" />,
  other: <File className="h-4 w-4" />,
};

const documentTypeBadgeVariants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  nda: "default",
  presentation: "secondary",
  proposal: "outline",
  contract: "default",
  other: "outline",
};

const documentTypeOptions = [
  { value: "nda", label: "NDA" },
  { value: "presentation", label: "Presentation" },
  { value: "proposal", label: "Proposal" },
  { value: "contract", label: "Contract" },
  { value: "other", label: "Other" },
];

export function CustomerDetails({
  customer,
  documents,
  isLoadingDocuments,
}: CustomerDetailsProps) {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("other");
  const [documentNotes, setDocumentNotes] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadDocument = useUploadCustomerDocument();
  const deleteDocument = useDeleteCustomerDocument();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!documentName) {
        setDocumentName(file.name.split(".").slice(0, -1).join(".") || file.name);
      }
    }
  };

  const handleUpload = () => {
    if (!customer || !selectedFile || !documentName) return;

    uploadDocument.mutate(
      {
        customerId: customer.id,
        file: selectedFile,
        documentName,
        documentType,
        notes: documentNotes || undefined,
      },
      {
        onSuccess: () => {
          setIsUploadOpen(false);
          resetUploadForm();
        },
      }
    );
  };

  const resetUploadForm = () => {
    setSelectedFile(null);
    setDocumentName("");
    setDocumentType("other");
    setDocumentNotes("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDownload = (doc: CustomerDocument) => {
    if (doc.document_url) {
      window.open(doc.document_url, "_blank");
    }
  };

  const handleDelete = (doc: CustomerDocument) => {
    if (!customer) return;
    deleteDocument.mutate({
      documentId: doc.id,
      documentUrl: doc.document_url || "",
      customerId: customer.id,
    });
  };

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a customer to view details
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Customer Info Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">{customer.company_name}</CardTitle>
              {customer.industry && (
                <Badge variant="secondary" className="mt-1">
                  {customer.industry}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {customer.contact_name && (
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Contact:</span>
                <span className="text-muted-foreground">{customer.contact_name}</span>
              </div>
            )}
            {customer.contact_email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <a href={`mailto:${customer.contact_email}`} className="text-primary hover:underline">
                  {customer.contact_email}
                </a>
              </div>
            )}
            {customer.contact_phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Phone:</span>
                <span className="text-muted-foreground">{customer.contact_phone}</span>
              </div>
            )}
            {customer.website && (
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Website:</span>
                <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                  {customer.website}
                </a>
              </div>
            )}
          </div>
          {customer.notes && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium text-sm mb-2">Notes</h4>
                <p className="text-sm text-muted-foreground">{customer.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Team Access Card */}
      <CustomerAccessManager customer={customer} />

      {/* Documents Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Shared Documents
            </CardTitle>
            <Dialog open={isUploadOpen} onOpenChange={(open) => {
              setIsUploadOpen(open);
              if (!open) resetUploadForm();
            }}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Document</DialogTitle>
                  <DialogDescription>
                    Upload a document to share with this customer.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="file">File</Label>
                    <Input
                      id="file"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      className="cursor-pointer"
                    />
                    {selectedFile && (
                      <p className="text-xs text-muted-foreground">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documentName">Document Name</Label>
                    <Input
                      id="documentName"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      placeholder="Enter document name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documentType">Document Type</Label>
                    <Select value={documentType} onValueChange={setDocumentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {documentTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      value={documentNotes}
                      onChange={(e) => setDocumentNotes(e.target.value)}
                      placeholder="Add any notes about this document..."
                      rows={2}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsUploadOpen(false);
                        resetUploadForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={!selectedFile || !documentName || uploadDocument.isPending}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {uploadDocument.isPending ? "Uploading..." : "Upload"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingDocuments ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : documents && documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-background text-muted-foreground">
                      {documentTypeIcons[doc.document_type] || documentTypeIcons.other}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{doc.document_name}</p>
                      {doc.notes && (
                        <p className="text-xs text-muted-foreground">{doc.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={documentTypeBadgeVariants[doc.document_type] || "outline"}>
                      {doc.document_type.toUpperCase()}
                    </Badge>
                    {doc.shared_date && (
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(doc.shared_date), "MMM d, yyyy")}
                      </span>
                    )}
                    {doc.document_url && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDownload(doc)}
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Document</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{doc.document_name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(doc)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No documents shared yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
