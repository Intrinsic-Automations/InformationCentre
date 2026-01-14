-- Create storage bucket for project documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-documents', 'project-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for project documents
CREATE POLICY "Anyone can view project documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-documents');

CREATE POLICY "Authenticated users can upload project documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own project documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create table for project documents metadata
CREATE TABLE public.project_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size TEXT,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;

-- RLS policies for project documents
CREATE POLICY "Anyone can view project documents"
ON public.project_documents FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert project documents"
ON public.project_documents FOR INSERT
WITH CHECK (
  uploaded_by IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own project documents"
ON public.project_documents FOR DELETE
USING (
  uploaded_by IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);