import { Building2, Globe, Mail, Phone, User, FileText, Presentation, FileCheck, File } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import type { Customer, CustomerDocument } from "@/hooks/useWinPlanData";
import { format } from "date-fns";

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

export function CustomerDetails({
  customer,
  documents,
  isLoadingDocuments,
}: CustomerDetailsProps) {
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

      {/* Documents Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Shared Documents
          </CardTitle>
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
