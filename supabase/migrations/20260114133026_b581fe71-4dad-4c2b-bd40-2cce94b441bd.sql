-- Create table for HR topic documents
CREATE TABLE public.hr_topic_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_slug TEXT NOT NULL,
  document_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size TEXT,
  file_type TEXT,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hr_topic_documents ENABLE ROW LEVEL SECURITY;

-- Everyone can view documents
CREATE POLICY "Anyone can view HR topic documents"
ON public.hr_topic_documents
FOR SELECT
USING (true);

-- Authenticated users can add documents
CREATE POLICY "Authenticated users can add HR topic documents"
ON public.hr_topic_documents
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Users can delete documents they uploaded
CREATE POLICY "Users can delete their own HR topic documents"
ON public.hr_topic_documents
FOR DELETE
USING (
  uploaded_by IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_hr_topic_documents_updated_at
BEFORE UPDATE ON public.hr_topic_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for HR documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('hr-documents', 'hr-documents', true);

-- Storage policies
CREATE POLICY "Anyone can view HR documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'hr-documents');

CREATE POLICY "Authenticated users can upload HR documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'hr-documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete HR documents"
ON storage.objects
FOR DELETE
USING (bucket_id = 'hr-documents' AND auth.uid() IS NOT NULL);