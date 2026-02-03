-- Create table for training resource links
CREATE TABLE public.training_resource_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_slug TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.profiles(id)
);

-- Enable RLS
ALTER TABLE public.training_resource_links ENABLE ROW LEVEL SECURITY;

-- Policies for training resource links
CREATE POLICY "Training resource links are viewable by authenticated users"
ON public.training_resource_links
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert training resource links"
ON public.training_resource_links
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update their own training resource links"
ON public.training_resource_links
FOR UPDATE
TO authenticated
USING (created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can delete their own training resource links or legacy links"
ON public.training_resource_links
FOR DELETE
TO authenticated
USING (
  created_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
  OR created_by IS NULL
);

-- Create trigger for updated_at
CREATE TRIGGER update_training_resource_links_updated_at
BEFORE UPDATE ON public.training_resource_links
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();