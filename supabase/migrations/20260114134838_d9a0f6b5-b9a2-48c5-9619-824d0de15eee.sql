-- Add author_id to projects table for tracking who uploaded each project
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.profiles(id);

-- Update existing projects to be owned by Arran Johnson
UPDATE public.projects SET author_id = '8fee531a-32c4-4162-a354-4cbb2aa199b7' WHERE author_id IS NULL;

-- Create RLS policy for users to update their own projects
CREATE POLICY "Users can update their own projects"
ON public.projects
FOR UPDATE
USING (
  author_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Create RLS policy for users to insert projects
CREATE POLICY "Authenticated users can insert projects"
ON public.projects
FOR INSERT
WITH CHECK (
  author_id IN (
    SELECT id FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Insert the hardcoded past projects into the database if they don't exist
INSERT INTO public.projects (name, status, type, description, summary, challenges, tools_used, tickets_raised, end_date, author_id)
SELECT 
  'Enterprise Analytics Migration',
  'completed',
  'Migration',
  'Full migration of enterprise analytics platform with 500+ dashboards.',
  'Successfully migrated 500+ dashboards and 2TB of data to cloud-native infrastructure.',
  'Data validation complexity, legacy system dependencies, tight timeline',
  ARRAY['Analytics Suite', 'Azure Data Factory', 'Power BI'],
  127,
  '2025-12-15',
  '8fee531a-32c4-4162-a354-4cbb2aa199b7'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Enterprise Analytics Migration');

INSERT INTO public.projects (name, status, type, description, summary, challenges, tools_used, tickets_raised, end_date, author_id)
SELECT 
  'Salesforce CRM Integration',
  'completed',
  'Integration',
  'Complete integration with Salesforce CRM for real-time sales analytics.',
  'Integrated Salesforce CRM with internal analytics platform enabling real-time sales insights.',
  'API rate limits, data mapping inconsistencies, SSO configuration',
  ARRAY['Salesforce API', 'MuleSoft', 'Analytics Foundation'],
  84,
  '2025-11-30',
  '8fee531a-32c4-4162-a354-4cbb2aa199b7'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Salesforce CRM Integration');

INSERT INTO public.projects (name, status, type, description, summary, challenges, tools_used, tickets_raised, end_date, author_id)
SELECT 
  'Global Analytics Dashboard',
  'completed',
  'Analytics',
  'Multi-region analytics dashboard supporting 5 global data centers.',
  'Deployed multi-region dashboard with geo-distributed data processing and caching.',
  'Latency optimization, data consistency across regions, timezone handling',
  ARRAY['Analytics Advanced', 'Redis', 'CloudFront CDN'],
  156,
  '2025-10-20',
  '8fee531a-32c4-4162-a354-4cbb2aa199b7'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Global Analytics Dashboard');

INSERT INTO public.projects (name, status, type, description, summary, challenges, tools_used, tickets_raised, end_date, author_id)
SELECT 
  'Legacy System Migration',
  'completed',
  'Migration',
  'Migration from Oracle to cloud-native analytics infrastructure.',
  'Migrated Oracle-based reporting to modern cloud infrastructure with cost savings.',
  'Complex stored procedures, data transformation logic, user training',
  ARRAY['AWS RDS', 'Snowflake', 'dbt', 'Analytics Suite'],
  203,
  '2025-09-15',
  '8fee531a-32c4-4162-a354-4cbb2aa199b7'
WHERE NOT EXISTS (SELECT 1 FROM public.projects WHERE name = 'Legacy System Migration');