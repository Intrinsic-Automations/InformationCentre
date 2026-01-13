-- Insert 3 project insights for Arran Johnson
INSERT INTO public.project_insights (author_id, title, description, category, tags) VALUES
(
  '8fee531a-32c4-4162-a354-4cbb2aa199b7',
  'Agile Sprint Planning for Large Migrations',
  'Break down complex migrations into 2-week sprints with clear deliverables. Use daily standups to identify blockers early and maintain momentum. Always ensure each sprint ends with a demonstrable outcome that stakeholders can review.',
  'strategy',
  ARRAY['Agile', 'Migration', 'Planning']
),
(
  '8fee531a-32c4-4162-a354-4cbb2aa199b7',
  'Mastering JIRA Workflows',
  'Configure custom workflows to match your team''s process. Use automation rules to auto-assign tickets and send notifications for status changes. Set up dashboards for quick visibility into sprint progress and blockers.',
  'software_tip',
  ARRAY['JIRA', 'Automation', 'Workflows']
),
(
  '8fee531a-32c4-4162-a354-4cbb2aa199b7',
  'Risk Mitigation in Integration Projects',
  'Identify integration points early and create fallback plans. Test in staging environments before production deployment to minimize disruption. Document all API contracts and maintain version compatibility matrices.',
  'strategy',
  ARRAY['Risk Management', 'Integration', 'Testing']
);