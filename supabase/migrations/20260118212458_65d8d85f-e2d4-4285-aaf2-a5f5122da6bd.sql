-- Insert a sample current project assigned to Arran Johnson
INSERT INTO public.projects (
  name,
  type,
  status,
  stage,
  description,
  client_name,
  start_date,
  deadline,
  author_id
) VALUES (
  'Acme Corp Integration',
  'Integration',
  'current',
  'development',
  'Full ERP integration project for Acme Corporation including data migration and API connections.',
  'Acme Corporation',
  '2026-01-06',
  '2026-03-31',
  '8fee531a-32c4-4162-a354-4cbb2aa199b7'
);