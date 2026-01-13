-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customer_documents table
CREATE TABLE public.customer_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL, -- 'nda', 'presentation', 'proposal', 'contract', 'other'
  document_url TEXT,
  shared_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create opportunities table
CREATE TABLE public.opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  opportunity_name TEXT NOT NULL,
  deal_summary TEXT,
  value_proposition TEXT,
  compelling_reasons TEXT,
  key_issues TEXT,
  blockers TEXT,
  estimated_value DECIMAL(15,2),
  stage TEXT DEFAULT 'prospecting', -- 'prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'
  probability INTEGER DEFAULT 0,
  expected_close_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create opportunity_interactions table
CREATE TABLE public.opportunity_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- 'conversation', 'presentation', 'meeting', 'email', 'call'
  interaction_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  summary TEXT NOT NULL,
  attendees TEXT,
  presentation_shared TEXT, -- name/description of presentation if shared
  outcome TEXT,
  next_steps TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_interactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for customers (publicly readable for now, can be restricted later with auth)
CREATE POLICY "Customers are viewable by everyone" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Customers can be inserted by everyone" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Customers can be updated by everyone" ON public.customers FOR UPDATE USING (true);
CREATE POLICY "Customers can be deleted by everyone" ON public.customers FOR DELETE USING (true);

-- Create RLS policies for customer_documents
CREATE POLICY "Customer documents are viewable by everyone" ON public.customer_documents FOR SELECT USING (true);
CREATE POLICY "Customer documents can be inserted by everyone" ON public.customer_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Customer documents can be updated by everyone" ON public.customer_documents FOR UPDATE USING (true);
CREATE POLICY "Customer documents can be deleted by everyone" ON public.customer_documents FOR DELETE USING (true);

-- Create RLS policies for opportunities
CREATE POLICY "Opportunities are viewable by everyone" ON public.opportunities FOR SELECT USING (true);
CREATE POLICY "Opportunities can be inserted by everyone" ON public.opportunities FOR INSERT WITH CHECK (true);
CREATE POLICY "Opportunities can be updated by everyone" ON public.opportunities FOR UPDATE USING (true);
CREATE POLICY "Opportunities can be deleted by everyone" ON public.opportunities FOR DELETE USING (true);

-- Create RLS policies for opportunity_interactions
CREATE POLICY "Opportunity interactions are viewable by everyone" ON public.opportunity_interactions FOR SELECT USING (true);
CREATE POLICY "Opportunity interactions can be inserted by everyone" ON public.opportunity_interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Opportunity interactions can be updated by everyone" ON public.opportunity_interactions FOR UPDATE USING (true);
CREATE POLICY "Opportunity interactions can be deleted by everyone" ON public.opportunity_interactions FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX idx_customer_documents_customer_id ON public.customer_documents(customer_id);
CREATE INDEX idx_opportunities_customer_id ON public.opportunities(customer_id);
CREATE INDEX idx_opportunity_interactions_opportunity_id ON public.opportunity_interactions(opportunity_id);

-- Create triggers for updated_at
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_documents_updated_at
  BEFORE UPDATE ON public.customer_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_opportunity_interactions_updated_at
  BEFORE UPDATE ON public.opportunity_interactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for customers
INSERT INTO public.customers (company_name, industry, website, contact_name, contact_email, contact_phone, status) VALUES
('Acme Corporation', 'Manufacturing', 'https://acme.example.com', 'John Smith', 'john.smith@acme.com', '+1-555-0101', 'active'),
('TechStart Inc', 'Technology', 'https://techstart.example.com', 'Sarah Johnson', 'sarah@techstart.com', '+1-555-0102', 'active'),
('Global Finance Ltd', 'Financial Services', 'https://globalfinance.example.com', 'Michael Brown', 'mbrown@globalfinance.com', '+1-555-0103', 'active'),
('Healthcare Plus', 'Healthcare', 'https://healthcareplus.example.com', 'Emily Davis', 'emily.davis@healthcareplus.com', '+1-555-0104', 'active'),
('Retail Giants', 'Retail', 'https://retailgiants.example.com', 'Robert Wilson', 'rwilson@retailgiants.com', '+1-555-0105', 'active');

-- Insert sample customer documents
INSERT INTO public.customer_documents (customer_id, document_name, document_type, notes)
SELECT id, 'Mutual NDA Agreement', 'nda', 'Signed on initial meeting'
FROM public.customers WHERE company_name = 'Acme Corporation';

INSERT INTO public.customer_documents (customer_id, document_name, document_type, notes)
SELECT id, 'Solution Overview Presentation', 'presentation', 'Presented at discovery meeting'
FROM public.customers WHERE company_name = 'Acme Corporation';

INSERT INTO public.customer_documents (customer_id, document_name, document_type, notes)
SELECT id, 'Confidentiality Agreement', 'nda', 'Standard NDA signed'
FROM public.customers WHERE company_name = 'TechStart Inc';

INSERT INTO public.customer_documents (customer_id, document_name, document_type, notes)
SELECT id, 'Technical Architecture Deck', 'presentation', 'Deep dive presentation'
FROM public.customers WHERE company_name = 'TechStart Inc';

INSERT INTO public.customer_documents (customer_id, document_name, document_type, notes)
SELECT id, 'Enterprise NDA', 'nda', 'Legal reviewed and approved'
FROM public.customers WHERE company_name = 'Global Finance Ltd';

-- Insert sample opportunities
INSERT INTO public.opportunities (customer_id, opportunity_name, deal_summary, value_proposition, compelling_reasons, key_issues, blockers, estimated_value, stage, probability)
SELECT id, 'ERP Migration Project', 
'Complete ERP system migration from legacy system to cloud-based solution',
'Reduce operational costs by 40% and improve data accessibility across all departments',
'Current system reaching end of life, compliance requirements for cloud backup, need for real-time reporting',
'Data migration complexity, user training requirements, integration with existing tools',
'Budget approval pending from CFO, IT resource availability',
250000.00, 'proposal', 60
FROM public.customers WHERE company_name = 'Acme Corporation';

INSERT INTO public.opportunities (customer_id, opportunity_name, deal_summary, value_proposition, compelling_reasons, key_issues, blockers, estimated_value, stage, probability)
SELECT id, 'Analytics Platform Implementation',
'Deploy advanced analytics platform with AI-powered insights',
'Enable data-driven decision making with predictive analytics capabilities',
'Competitive pressure to leverage data, CEO mandate for digital transformation',
'Data quality concerns, skill gap in analytics team',
'None identified',
180000.00, 'negotiation', 75
FROM public.customers WHERE company_name = 'TechStart Inc';

INSERT INTO public.opportunities (customer_id, opportunity_name, deal_summary, value_proposition, compelling_reasons, key_issues, blockers, estimated_value, stage, probability)
SELECT id, 'Cloud Security Suite',
'Enterprise security suite for cloud infrastructure protection',
'Comprehensive security coverage with 24/7 monitoring and threat detection',
'Recent security audit findings, regulatory compliance requirements',
'Integration with existing SIEM, false positive concerns',
'Competing vendor in final stages',
320000.00, 'qualification', 40
FROM public.customers WHERE company_name = 'Global Finance Ltd';

INSERT INTO public.opportunities (customer_id, opportunity_name, deal_summary, value_proposition, compelling_reasons, key_issues, blockers, estimated_value, stage, probability)
SELECT id, 'Patient Portal Upgrade',
'Modernize patient portal with mobile-first approach',
'Improve patient engagement and reduce administrative overhead',
'Patient satisfaction scores declining, HIPAA compliance updates needed',
'Legacy system dependencies, patient data migration',
'Board approval required for healthcare IT investments',
150000.00, 'prospecting', 25
FROM public.customers WHERE company_name = 'Healthcare Plus';

-- Insert sample opportunity interactions
INSERT INTO public.opportunity_interactions (opportunity_id, interaction_type, summary, attendees, presentation_shared, outcome, next_steps)
SELECT o.id, 'meeting', 
'Initial discovery meeting to understand current ERP challenges',
'John Smith (Acme), Mike Jones (Sales), Lisa Chen (Solutions)',
NULL,
'Identified key pain points and requirements. Client interested in cloud migration.',
'Schedule technical deep dive with IT team'
FROM public.opportunities o
JOIN public.customers c ON o.customer_id = c.id
WHERE c.company_name = 'Acme Corporation' AND o.opportunity_name = 'ERP Migration Project';

INSERT INTO public.opportunity_interactions (opportunity_id, interaction_type, summary, attendees, presentation_shared, outcome, next_steps)
SELECT o.id, 'presentation',
'Technical architecture presentation and demo',
'John Smith (Acme), IT Team, Mike Jones (Sales), Solutions Team',
'ERP Cloud Architecture Overview v2.0',
'Positive reception from IT team. Some concerns about migration timeline.',
'Prepare detailed migration plan and timeline'
FROM public.opportunities o
JOIN public.customers c ON o.customer_id = c.id
WHERE c.company_name = 'Acme Corporation' AND o.opportunity_name = 'ERP Migration Project';

INSERT INTO public.opportunity_interactions (opportunity_id, interaction_type, summary, attendees, presentation_shared, outcome, next_steps)
SELECT o.id, 'call',
'Follow-up call to discuss budget and timeline',
'Sarah Johnson (TechStart), Mike Jones (Sales)',
NULL,
'Budget approved. Ready to move forward with contract negotiation.',
'Send draft contract for review'
FROM public.opportunities o
JOIN public.customers c ON o.customer_id = c.id
WHERE c.company_name = 'TechStart Inc' AND o.opportunity_name = 'Analytics Platform Implementation';

INSERT INTO public.opportunity_interactions (opportunity_id, interaction_type, summary, attendees, presentation_shared, outcome, next_steps)
SELECT o.id, 'presentation',
'ROI presentation to executive team',
'Sarah Johnson, CTO, CFO, Mike Jones (Sales)',
'Analytics ROI Business Case',
'CFO impressed with ROI projections. CTO wants security review.',
'Schedule security architecture review'
FROM public.opportunities o
JOIN public.customers c ON o.customer_id = c.id
WHERE c.company_name = 'TechStart Inc' AND o.opportunity_name = 'Analytics Platform Implementation';