import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, ArrowLeft, File, FileSpreadsheet, Trash2, Upload, Loader2, Pencil, Check, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import infoResourcesHero from "@/assets/generic-training-hero.jpg";

const topicTitles: Record<string, string> = {
  "absence-management": "Absence Management",
  "appraisals": "Appraisals",
  "employee-benefits-info": "Employee Benefits Info",
  "employee-exit": "Employee Exit",
  "induction": "Induction",
  "job-descriptions": "Job Descriptions",
  "performance-management": "Performance Management",
  "probation": "Probation",
  "recruiting": "Recruiting",
  "training": "Training",
};

function getFileIcon(type: string) {
  switch (type) {
    case "pdf":
      return <FileText className="h-5 w-5 text-destructive" />;
    case "doc":
    case "docx":
      return <File className="h-5 w-5 text-primary" />;
    case "excel":
    case "xlsx":
    case "xls":
      return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    default:
      return <File className="h-5 w-5 text-muted-foreground" />;
  }
}

function getFileType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'doc';
  if (['xls', 'xlsx'].includes(ext)) return 'excel';
  return 'other';
}

function getFileDescription(fileName: string, fileType: string | null): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') return 'PDF document containing HR policies, procedures, and reference guides.';
  if (ext === 'pptx' || ext === 'ppt') return 'Presentation slides for training and informational sessions.';
  if (ext === 'docx' || ext === 'doc') return 'Word document with detailed policies, forms, or procedures.';
  if (ext === 'xlsx' || ext === 'xls') return 'Spreadsheet with templates, tracking tools, or data.';
  if (ext === 'txt') return 'Text file with notes or reference information.';
  return 'Document resource for this HR topic.';
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function HRTopicDetail() {
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState("");

  const title = topicSlug ? topicTitles[topicSlug] || "Resources" : "Resources";

  // Fetch documents from database
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['hr-topic-documents', topicSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hr_topic_documents')
        .select('*')
        .eq('topic_slug', topicSlug)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!topicSlug,
  });

  // Delete document mutation
  const deleteDocument = useMutation({
    mutationFn: async (doc: { id: string; file_path: string }) => {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('hr-documents')
        .remove([doc.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('hr_topic_documents')
        .delete()
        .eq('id', doc.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-topic-documents', topicSlug] });
      toast.success('Document deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    },
  });

  // Update description mutation
  const updateDescriptionMutation = useMutation({
    mutationFn: async ({ id, description }: { id: string; description: string }) => {
      const { error } = await supabase
        .from('hr_topic_documents')
        .update({ description })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hr-topic-documents', topicSlug] });
      toast.success('Description updated');
    },
    onError: (error) => {
      console.error('Error updating description:', error);
      toast.error('Failed to update description');
    },
  });

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !topicSlug || !profile) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${topicSlug}/${Date.now()}-${file.name}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('hr-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save to database
      const { error: dbError } = await supabase
        .from('hr_topic_documents')
        .insert({
          topic_slug: topicSlug,
          document_name: file.name,
          file_path: filePath,
          file_size: formatFileSize(file.size),
          file_type: getFileType(file.name),
          uploaded_by: profile.id,
        });

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ['hr-topic-documents', topicSlug] });
      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle download
  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('hr-documents')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Hero Banner with Title - Sticky */}
      <div className="sticky top-0 z-30 shrink-0 relative h-16 md:h-20 overflow-hidden">
        <img
          src={infoResourcesHero}
          alt={`${title} banner`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />
        <div className="absolute inset-0 flex items-center px-6 md:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary-foreground backdrop-blur-sm">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-secondary-foreground">{title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="w-full">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => navigate("/info-resources")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Info & Resources
          </Button>

          {/* Files List */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Available Documents
                </h2>
                {profile && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                    />
                    <Button
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="gap-2"
                    >
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      Add Document
                    </Button>
                  </>
                )}
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : documents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No documents available for this topic.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {documents.map((doc) => {
                    const isEditing = editingDocId === doc.id;
                    const displayDescription = doc.description || getFileDescription(doc.document_name, doc.file_type);

                    return (
                      <Card
                        key={doc.id}
                        className="group hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <div className="shrink-0 mt-0.5">
                                {getFileIcon(doc.file_type || 'other')}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground truncate">{doc.document_name}</p>
                                <p className="text-xs text-muted-foreground mb-2">{doc.file_size}</p>
                                {isEditing ? (
                                  <div className="space-y-2">
                                    <Textarea
                                      value={editingDescription}
                                      onChange={(e) => setEditingDescription(e.target.value)}
                                      className="text-sm min-h-[60px]"
                                      placeholder="Enter description..."
                                    />
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="gap-1"
                                        onClick={() => {
                                          updateDescriptionMutation.mutate({ id: doc.id, description: editingDescription });
                                          setEditingDocId(null);
                                        }}
                                      >
                                        <Check className="h-3 w-3" />
                                        Save
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="gap-1"
                                        onClick={() => setEditingDocId(null)}
                                      >
                                        <X className="h-3 w-3" />
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="group/desc">
                                    <div className="flex items-start gap-2">
                                      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                                        {displayDescription}
                                      </p>
                                      <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-6 w-6 opacity-0 group-hover/desc:opacity-100 transition-opacity shrink-0"
                                        onClick={() => {
                                          setEditingDocId(doc.id);
                                          setEditingDescription(doc.description || '');
                                        }}
                                      >
                                        <Pencil className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDownload(doc.file_path, doc.document_name)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              {profile && doc.uploaded_by === profile.id && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                                  onClick={() => deleteDocument.mutate({ id: doc.id, file_path: doc.file_path })}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
