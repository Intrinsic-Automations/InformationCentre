-- Create storage bucket for solution files
INSERT INTO storage.buckets (id, name, public) VALUES ('solution-files', 'solution-files', true)
ON CONFLICT (id) DO NOTHING;

-- Add DELETE policy for authors
CREATE POLICY "Authors can delete their solutions"
ON public.solutions
FOR DELETE
USING (
  author_id IN (SELECT id FROM profiles WHERE profiles.user_id = auth.uid())
);

-- Storage policies for solution files
CREATE POLICY "Authenticated users can view solution files"
ON storage.objects
FOR SELECT
USING (bucket_id = 'solution-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can upload solution files"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'solution-files' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own solution files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'solution-files' AND auth.uid()::text = (storage.foldername(name))[1]);