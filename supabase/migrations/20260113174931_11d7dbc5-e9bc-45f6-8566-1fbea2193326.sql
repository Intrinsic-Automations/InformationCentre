-- Create project_insights table
CREATE TABLE public.project_insights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('strategy', 'software_tip')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_insights ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view insights
CREATE POLICY "Authenticated users can view project insights"
  ON public.project_insights
  FOR SELECT
  TO authenticated
  USING (true);

-- Users can create insights (author_id must match their profile)
CREATE POLICY "Users can create their own project insights"
  ON public.project_insights
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = author_id AND p.user_id = auth.uid())
  );

-- Users can update their own insights
CREATE POLICY "Users can update their own project insights"
  ON public.project_insights
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = author_id AND p.user_id = auth.uid())
  );

-- Users can delete their own insights
CREATE POLICY "Users can delete their own project insights"
  ON public.project_insights
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = author_id AND p.user_id = auth.uid())
  );

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_project_insights_updated_at
  BEFORE UPDATE ON public.project_insights
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for performance
CREATE INDEX idx_project_insights_author ON public.project_insights(author_id);
CREATE INDEX idx_project_insights_category ON public.project_insights(category);