-- Create table for execution documents
CREATE TABLE public.execution_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('template', 'example')),
  document_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size TEXT,
  file_type TEXT,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.execution_documents ENABLE ROW LEVEL SECURITY;

-- All authenticated users can view documents
CREATE POLICY "Authenticated users can view execution documents"
ON public.execution_documents
FOR SELECT
TO authenticated
USING (true);

-- All authenticated users can upload documents
CREATE POLICY "Authenticated users can upload execution documents"
ON public.execution_documents
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Users can delete documents they uploaded
CREATE POLICY "Users can delete their own execution documents"
ON public.execution_documents
FOR DELETE
TO authenticated
USING (uploaded_by = public.current_profile_id());

-- Create storage bucket for execution documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('execution-documents', 'execution-documents', true);

-- Storage policies
CREATE POLICY "Anyone can view execution documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'execution-documents');

CREATE POLICY "Authenticated users can upload execution documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'execution-documents');

CREATE POLICY "Users can delete execution documents they uploaded"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'execution-documents');