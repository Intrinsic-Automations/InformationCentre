-- Create customer-documents storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('customer-documents', 'customer-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to view customer documents
CREATE POLICY "Authenticated users can view customer documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'customer-documents' AND auth.role() = 'authenticated');

-- Allow authenticated users to upload customer documents
CREATE POLICY "Authenticated users can upload customer documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'customer-documents' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete customer documents
CREATE POLICY "Authenticated users can delete customer documents"
ON storage.objects FOR DELETE
USING (bucket_id = 'customer-documents' AND auth.role() = 'authenticated');