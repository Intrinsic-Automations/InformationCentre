-- Add new columns to opportunities table
ALTER TABLE public.opportunities 
ADD COLUMN industry TEXT,
ADD COLUMN exec_owner TEXT,
ADD COLUMN opportunity_owner TEXT,
ADD COLUMN quarter_to_close TEXT,
ADD COLUMN services_value DECIMAL(15,2) DEFAULT 0,
ADD COLUMN software_sales DECIMAL(15,2) DEFAULT 0;

-- Create stakeholders table
CREATE TABLE public.opportunity_stakeholders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  relationship_owner TEXT,
  comments TEXT,
  is_decision_maker BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.opportunity_stakeholders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Stakeholders are viewable by everyone" ON public.opportunity_stakeholders FOR SELECT USING (true);
CREATE POLICY "Stakeholders can be inserted by everyone" ON public.opportunity_stakeholders FOR INSERT WITH CHECK (true);
CREATE POLICY "Stakeholders can be updated by everyone" ON public.opportunity_stakeholders FOR UPDATE USING (true);
CREATE POLICY "Stakeholders can be deleted by everyone" ON public.opportunity_stakeholders FOR DELETE USING (true);

-- Create index for performance
CREATE INDEX idx_opportunity_stakeholders_opportunity_id ON public.opportunity_stakeholders(opportunity_id);

-- Create trigger for updated_at
CREATE TRIGGER update_opportunity_stakeholders_updated_at
  BEFORE UPDATE ON public.opportunity_stakeholders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update existing opportunities with sample data
UPDATE public.opportunities SET 
  industry = 'Manufacturing',
  exec_owner = 'James Wilson',
  opportunity_owner = 'Mike Jones',
  quarter_to_close = 'Q2 2026',
  services_value = 150000.00,
  software_sales = 100000.00
WHERE opportunity_name = 'ERP Migration Project';

UPDATE public.opportunities SET 
  industry = 'Technology',
  exec_owner = 'James Wilson',
  opportunity_owner = 'Mike Jones',
  quarter_to_close = 'Q1 2026',
  services_value = 80000.00,
  software_sales = 100000.00
WHERE opportunity_name = 'Analytics Platform Implementation';

UPDATE public.opportunities SET 
  industry = 'Financial Services',
  exec_owner = 'Sarah Chen',
  opportunity_owner = 'Lisa Park',
  quarter_to_close = 'Q2 2026',
  services_value = 120000.00,
  software_sales = 200000.00
WHERE opportunity_name = 'Cloud Security Suite';

UPDATE public.opportunities SET 
  industry = 'Healthcare',
  exec_owner = 'Sarah Chen',
  opportunity_owner = 'Tom Richards',
  quarter_to_close = 'Q3 2026',
  services_value = 100000.00,
  software_sales = 50000.00
WHERE opportunity_name = 'Patient Portal Upgrade';

-- Insert sample stakeholders
INSERT INTO public.opportunity_stakeholders (opportunity_id, name, role, relationship_owner, comments, is_decision_maker)
SELECT o.id, 'John Smith', 'VP of Operations', 'Mike Jones', 'Primary sponsor, very engaged', true
FROM public.opportunities o
JOIN public.customers c ON o.customer_id = c.id
WHERE c.company_name = 'Acme Corporation' AND o.opportunity_name = 'ERP Migration Project';

INSERT INTO public.opportunity_stakeholders (opportunity_id, name, role, relationship_owner, comments, is_decision_maker)
SELECT o.id, 'Patricia Lee', 'CFO', 'James Wilson', 'Budget holder, needs ROI justification', true
FROM public.opportunities o
JOIN public.customers c ON o.customer_id = c.id
WHERE c.company_name = 'Acme Corporation' AND o.opportunity_name = 'ERP Migration Project';

INSERT INTO public.opportunity_stakeholders (opportunity_id, name, role, relationship_owner, comments, is_decision_maker)
SELECT o.id, 'David Chen', 'IT Director', 'Mike Jones', 'Technical evaluator', false
FROM public.opportunities o
JOIN public.customers c ON o.customer_id = c.id
WHERE c.company_name = 'Acme Corporation' AND o.opportunity_name = 'ERP Migration Project';

INSERT INTO public.opportunity_stakeholders (opportunity_id, name, role, relationship_owner, comments, is_decision_maker)
SELECT o.id, 'Sarah Johnson', 'CTO', 'Mike Jones', 'Final decision maker', true
FROM public.opportunities o
JOIN public.customers c ON o.customer_id = c.id
WHERE c.company_name = 'TechStart Inc' AND o.opportunity_name = 'Analytics Platform Implementation';

INSERT INTO public.opportunity_stakeholders (opportunity_id, name, role, relationship_owner, comments, is_decision_maker)
SELECT o.id, 'Mark Thompson', 'Data Science Lead', 'Lisa Park', 'Technical champion', false
FROM public.opportunities o
JOIN public.customers c ON o.customer_id = c.id
WHERE c.company_name = 'TechStart Inc' AND o.opportunity_name = 'Analytics Platform Implementation';