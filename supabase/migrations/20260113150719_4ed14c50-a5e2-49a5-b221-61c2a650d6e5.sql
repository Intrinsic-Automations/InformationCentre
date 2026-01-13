-- Create table for opportunity action steps
CREATE TABLE public.opportunity_action_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  action_description TEXT NOT NULL,
  owner TEXT NOT NULL,
  due_date DATE,
  rag_status TEXT NOT NULL DEFAULT 'green' CHECK (rag_status IN ('red', 'amber', 'green')),
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.opportunity_action_steps ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Allow public read access on opportunity_action_steps"
  ON public.opportunity_action_steps FOR SELECT USING (true);

CREATE POLICY "Allow public insert on opportunity_action_steps"
  ON public.opportunity_action_steps FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on opportunity_action_steps"
  ON public.opportunity_action_steps FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on opportunity_action_steps"
  ON public.opportunity_action_steps FOR DELETE USING (true);

-- Create index for faster lookups
CREATE INDEX idx_opportunity_action_steps_opportunity_id ON public.opportunity_action_steps(opportunity_id);

-- Create trigger for updated_at
CREATE TRIGGER update_opportunity_action_steps_updated_at
  BEFORE UPDATE ON public.opportunity_action_steps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.opportunity_action_steps (opportunity_id, action_description, owner, due_date, rag_status) VALUES
  ((SELECT id FROM public.opportunities LIMIT 1), 'Schedule follow-up demo with technical team', 'John Smith', '2026-01-20', 'green'),
  ((SELECT id FROM public.opportunities LIMIT 1), 'Send revised pricing proposal', 'Sarah Jones', '2026-01-15', 'amber'),
  ((SELECT id FROM public.opportunities LIMIT 1), 'Obtain sign-off from legal department', 'Mike Wilson', '2026-01-25', 'red');