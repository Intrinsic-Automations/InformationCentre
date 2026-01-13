-- Create project_insight_documents table
CREATE TABLE public.project_insight_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  insight_id UUID NOT NULL REFERENCES public.project_insights(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_insight_documents ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view documents
CREATE POLICY "Authenticated users can view insight documents"
  ON public.project_insight_documents
  FOR SELECT
  TO authenticated
  USING (true);

-- Insight authors can add documents
CREATE POLICY "Insight authors can add documents"
  ON public.project_insight_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.project_insights pi 
      JOIN public.profiles p ON p.id = pi.author_id 
      WHERE pi.id = insight_id AND p.user_id = auth.uid()
    )
  );

-- Insight authors can delete documents
CREATE POLICY "Insight authors can delete documents"
  ON public.project_insight_documents
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.project_insights pi 
      JOIN public.profiles p ON p.id = pi.author_id 
      WHERE pi.id = insight_id AND p.user_id = auth.uid()
    )
  );

-- Add extended_content column for more details
ALTER TABLE public.project_insights ADD COLUMN extended_content TEXT;

-- Create storage bucket for insight documents
INSERT INTO storage.buckets (id, name, public) VALUES ('insight-documents', 'insight-documents', true);

-- Storage policies
CREATE POLICY "Anyone can view insight documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'insight-documents');

CREATE POLICY "Authenticated users can upload insight documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'insight-documents');

CREATE POLICY "Users can delete their own insight documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'insight-documents');

-- Create index
CREATE INDEX idx_insight_documents_insight ON public.project_insight_documents(insight_id);