import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ExecutionDocument {
  id: string;
  item_id: string;
  document_type: "template" | "example";
  document_name: string;
  file_path: string;
  file_size: string | null;
  file_type: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export function useExecutionDocuments(itemId: string | null) {
  const [documents, setDocuments] = useState<ExecutionDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    if (!itemId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("execution_documents")
        .select("*")
        .eq("item_id", itemId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments((data as ExecutionDocument[]) || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [itemId]);

  const uploadDocument = async (
    file: File,
    documentType: "template" | "example"
  ) => {
    if (!itemId) return;

    try {
      // Get current user's profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to upload documents",
          variant: "destructive",
        });
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!profile) {
        toast({
          title: "Error",
          description: "Profile not found",
          variant: "destructive",
        });
        return;
      }

      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const filePath = `${itemId}/${documentType}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("execution-documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create database record
      const { error: dbError } = await supabase
        .from("execution_documents")
        .insert({
          item_id: itemId,
          document_type: documentType,
          document_name: file.name,
          file_path: filePath,
          file_size: `${(file.size / 1024).toFixed(1)} KB`,
          file_type: fileExt,
          uploaded_by: profile.id,
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: `${documentType === "template" ? "Template" : "Example"} document uploaded successfully`,
      });

      fetchDocuments();
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    }
  };

  const deleteDocument = async (document: ExecutionDocument) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("execution-documents")
        .remove([document.file_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from("execution_documents")
        .delete()
        .eq("id", document.id);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

      fetchDocuments();
    } catch (error: any) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const downloadDocument = async (document: ExecutionDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from("execution-documents")
        .download(document.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = document.document_name;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Error downloading document:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to download document",
        variant: "destructive",
      });
    }
  };

  return {
    documents,
    loading,
    uploadDocument,
    deleteDocument,
    downloadDocument,
    refetch: fetchDocuments,
  };
}
