-- =============================================
-- FIX SECURITY ISSUES
-- =============================================

-- Fix 1: Profiles should require authentication to view
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles 
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Fix 2: Partnerships should require authentication to view
DROP POLICY IF EXISTS "Partnerships are viewable by everyone" ON public.partnerships;
CREATE POLICY "Partnerships are viewable by authenticated users" ON public.partnerships 
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Fix 3: Training progress policies have a bug - fix them
DROP POLICY IF EXISTS "Users can view their own progress" ON public.training_progress;
DROP POLICY IF EXISTS "Users can update their own progress" ON public.training_progress;

CREATE POLICY "Users can view their own progress" ON public.training_progress 
  FOR SELECT USING (
    user_id IN (SELECT id FROM public.profiles WHERE profiles.user_id = auth.uid())
  );

CREATE POLICY "Users can manage their own progress" ON public.training_progress 
  FOR ALL USING (
    user_id IN (SELECT id FROM public.profiles WHERE profiles.user_id = auth.uid())
  );

-- =============================================
-- INSERT SAMPLE PROFILES (without user_id for demo data)
-- We'll create system profiles for demo content
-- =============================================

-- First, let's allow inserting demo profiles without auth
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_key;
ALTER TABLE public.profiles ALTER COLUMN user_id DROP NOT NULL;

-- Insert sample profiles
INSERT INTO public.profiles (id, full_name, initials, email, department, role, level, skills, is_active) VALUES
  ('11111111-1111-1111-1111-111111111001', 'Alexandra Chen', 'AC', 'alexandra.chen@company.com', 'Executive', 'Chief Executive Officer', 'CEO', ARRAY['Strategic Leadership', 'Business Development', 'Stakeholder Management'], true),
  ('11111111-1111-1111-1111-111111111002', 'Marcus Williams', 'MW', 'marcus.williams@company.com', 'Engineering', 'VP of Engineering', 'VP', ARRAY['Technical Architecture', 'Team Building', 'Agile Methodologies'], true),
  ('11111111-1111-1111-1111-111111111003', 'Rachel Foster', 'RF', 'rachel.foster@company.com', 'Sales', 'VP of Sales', 'VP', ARRAY['Enterprise Sales', 'Negotiation', 'Client Relations'], true),
  ('11111111-1111-1111-1111-111111111004', 'Daniel Kumar', 'DK', 'daniel.kumar@company.com', 'Operations', 'VP of Operations', 'VP', ARRAY['Process Optimization', 'Resource Planning', 'Quality Assurance'], true),
  ('11111111-1111-1111-1111-111111111005', 'Sarah Johnson', 'SJ', 'sarah.johnson@company.com', 'Product', 'Head of Product Development', 'Head', ARRAY['Product Strategy', 'UX Design', 'Cross-functional Leadership'], true),
  ('11111111-1111-1111-1111-111111111006', 'Kevin O''Brien', 'KO', 'kevin.obrien@company.com', 'Engineering', 'Head of DevOps', 'Head', ARRAY['CI/CD', 'Kubernetes', 'Infrastructure as Code'], true),
  ('11111111-1111-1111-1111-111111111007', 'Thomas Wright', 'TW', 'thomas.wright@company.com', 'Sales', 'Head of Enterprise Sales', 'Head', ARRAY['Account Management', 'Solution Selling', 'CRM'], true),
  ('11111111-1111-1111-1111-111111111008', 'Maria Garcia', 'MG', 'maria.garcia@company.com', 'Operations', 'Head of Customer Success', 'Head', ARRAY['Customer Retention', 'Onboarding', 'Support Strategy'], true),
  ('11111111-1111-1111-1111-111111111009', 'David Park', 'DP', 'david.park@company.com', 'Engineering', 'Senior Software Architect', 'Senior', ARRAY['System Design', 'Cloud Architecture', 'Performance Optimization'], true),
  ('11111111-1111-1111-1111-111111111010', 'Lisa Chang', 'LC', 'lisa.chang@company.com', 'Engineering', 'Senior DevOps Engineer', 'Senior', ARRAY['AWS', 'Terraform', 'Monitoring'], true),
  ('11111111-1111-1111-1111-111111111011', 'Jennifer Adams', 'JA', 'jennifer.adams@company.com', 'Sales', 'Senior Account Executive', 'Senior', ARRAY['B2B Sales', 'Presentations', 'Pipeline Management'], true),
  ('11111111-1111-1111-1111-111111111012', 'Robert Kim', 'RK', 'robert.kim@company.com', 'Operations', 'Senior Customer Success Manager', 'Senior', ARRAY['Account Health', 'Training', 'Escalation Management'], true),
  ('11111111-1111-1111-1111-111111111013', 'Emily Torres', 'ET', 'emily.torres@company.com', 'Engineering', 'Team Lead - Frontend', 'Lead', ARRAY['React', 'TypeScript', 'Design Systems'], true),
  ('11111111-1111-1111-1111-111111111014', 'Michael Brown', 'MB', 'michael.brown@company.com', 'Engineering', 'Team Lead - Backend', 'Lead', ARRAY['Node.js', 'PostgreSQL', 'Microservices'], true),
  ('11111111-1111-1111-1111-111111111015', 'Sophie Anderson', 'SA', 'sophie.anderson@company.com', 'Operations', 'Team Lead - Support', 'Lead', ARRAY['Technical Support', 'Team Coaching', 'Documentation'], true),
  ('11111111-1111-1111-1111-111111111016', 'James Liu', 'JL', 'james.liu@company.com', 'Engineering', 'Senior Developer', 'Developer', ARRAY['React', 'Next.js', 'Testing'], true),
  ('11111111-1111-1111-1111-111111111017', 'Priya Sharma', 'PS', 'priya.sharma@company.com', 'Engineering', 'Developer', 'Developer', ARRAY['JavaScript', 'CSS', 'Accessibility'], true),
  ('11111111-1111-1111-1111-111111111018', 'Ana Rodriguez', 'AR', 'ana.rodriguez@company.com', 'Engineering', 'Senior Developer', 'Developer', ARRAY['Python', 'APIs', 'Database Design'], true),
  ('11111111-1111-1111-1111-111111111019', 'Chris Taylor', 'CT', 'chris.taylor@company.com', 'Operations', 'Support Specialist', 'Developer', ARRAY['Troubleshooting', 'Communication', 'Ticketing'], true),
  ('11111111-1111-1111-1111-111111111020', 'Alex Chen', 'ACh', 'alex.chen@company.com', 'Engineering', 'Software Engineer', 'Developer', ARRAY['Full-Stack', 'Scalable Solutions', 'Cloud'], true);

-- Set up reporting hierarchy
UPDATE public.profiles SET reports_to = '11111111-1111-1111-1111-111111111001' WHERE id IN ('11111111-1111-1111-1111-111111111002', '11111111-1111-1111-1111-111111111003', '11111111-1111-1111-1111-111111111004');
UPDATE public.profiles SET reports_to = '11111111-1111-1111-1111-111111111002' WHERE id IN ('11111111-1111-1111-1111-111111111005', '11111111-1111-1111-1111-111111111006');
UPDATE public.profiles SET reports_to = '11111111-1111-1111-1111-111111111003' WHERE id = '11111111-1111-1111-1111-111111111007';
UPDATE public.profiles SET reports_to = '11111111-1111-1111-1111-111111111004' WHERE id = '11111111-1111-1111-1111-111111111008';
UPDATE public.profiles SET reports_to = '11111111-1111-1111-1111-111111111005' WHERE id = '11111111-1111-1111-1111-111111111009';
UPDATE public.profiles SET reports_to = '11111111-1111-1111-1111-111111111006' WHERE id = '11111111-1111-1111-1111-111111111010';
UPDATE public.profiles SET reports_to = '11111111-1111-1111-1111-111111111007' WHERE id = '11111111-1111-1111-1111-111111111011';
UPDATE public.profiles SET reports_to = '11111111-1111-1111-1111-111111111008' WHERE id = '11111111-1111-1111-1111-111111111012';
UPDATE public.profiles SET reports_to = '11111111-1111-1111-1111-111111111009' WHERE id IN ('11111111-1111-1111-1111-111111111013', '11111111-1111-1111-1111-111111111014');
UPDATE public.profiles SET reports_to = '11111111-1111-1111-1111-111111111012' WHERE id = '11111111-1111-1111-1111-111111111015';
UPDATE public.profiles SET reports_to = '11111111-1111-1111-1111-111111111013' WHERE id IN ('11111111-1111-1111-1111-111111111016', '11111111-1111-1111-1111-111111111017');
UPDATE public.profiles SET reports_to = '11111111-1111-1111-1111-111111111014' WHERE id = '11111111-1111-1111-1111-111111111018';
UPDATE public.profiles SET reports_to = '11111111-1111-1111-1111-111111111015' WHERE id = '11111111-1111-1111-1111-111111111019';

-- =============================================
-- INSERT ANNOUNCEMENTS
-- =============================================
INSERT INTO public.announcements (author_id, title, content, category, is_pinned, published_at) VALUES
  ('11111111-1111-1111-1111-111111111001', 'Q1 2024 All-Hands Meeting', 'Join us for our quarterly all-hands meeting where we''ll discuss company updates, celebrate wins, and outline our goals for the upcoming quarter.', 'Company', true, '2024-01-15'),
  ('11111111-1111-1111-1111-111111111005', 'New Training Modules Available', 'We''ve added new training modules covering advanced sales techniques and product updates. Check out the Learning section to get started.', 'Training', true, '2024-01-10'),
  ('11111111-1111-1111-1111-111111111004', 'Holiday Schedule Update', 'Please review the updated holiday schedule for 2024. The calendar has been updated in the Resources section.', 'HR', false, '2024-01-05');

-- =============================================
-- INSERT NEWS
-- =============================================
INSERT INTO public.news (author_id, title, content, category, published_at) VALUES
  ('11111111-1111-1111-1111-111111111001', 'Industry Report: Digital Transformation Trends 2024', 'A comprehensive look at the key digital transformation trends shaping enterprises this year.', 'Tech Insights', '2024-01-12'),
  ('11111111-1111-1111-1111-111111111003', 'New Partnership Opportunities in APAC Region', 'Exploring emerging markets and partnership possibilities across the Asia-Pacific region.', 'Business Weekly', '2024-01-10'),
  ('11111111-1111-1111-1111-111111111004', 'Best Practices for Remote Team Collaboration', 'Expert insights on building effective remote work cultures and collaboration strategies.', 'HR Today', '2024-01-08');

-- =============================================
-- INSERT POSTS (Chats, Introductions, Wins)
-- =============================================

-- India Chat posts
INSERT INTO public.posts (id, author_id, channel, content, created_at) VALUES
  ('22222222-2222-2222-2222-222222222001', '11111111-1111-1111-1111-111111111017', 'india_chat', 'Just shared my project proposal for the new CRM integration! Would love some feedback on the timeline estimates 🙏 https://docs.company.com/projects/crm-integration', '2024-01-15 09:00:00'),
  ('22222222-2222-2222-2222-222222222002', '11111111-1111-1111-1111-111111111014', 'india_chat', 'Reviewed it! The architecture looks solid. One suggestion - consider adding a buffer week for the API testing phase. Here''s my migration project doc if anyone can take a look: https://docs.company.com/projects/data-migration', '2024-01-15 09:05:00'),
  ('22222222-2222-2222-2222-222222222003', '11111111-1111-1111-1111-111111111018', 'india_chat', 'Great work on both! 👍 I''m putting together a project plan for the client onboarding automation. Should I prioritize the workflow engine or the notification system first? Would appreciate input before the stakeholder meeting.', '2024-01-15 09:15:00'),
  ('22222222-2222-2222-2222-222222222004', '11111111-1111-1111-1111-111111111009', 'india_chat', '@Anita I''d recommend workflow engine first - it''s the foundation everything else depends on. Happy to jump on a quick call to review the scope if needed!', '2024-01-15 09:22:00'),
  ('22222222-2222-2222-2222-222222222005', '11111111-1111-1111-1111-111111111017', 'india_chat', 'Thanks everyone for the valuable feedback! Already incorporated the suggestions. This kind of collaboration really helps improve our project quality 🚀', '2024-01-15 09:30:00');

-- Europe Chat posts
INSERT INTO public.posts (id, author_id, channel, content, created_at) VALUES
  ('22222222-2222-2222-2222-222222222011', '11111111-1111-1111-1111-111111111005', 'europe_chat', 'New design specs for the dashboard are ready for review. Let me know your thoughts! https://figma.com/design/dashboard', '2024-01-15 10:00:00'),
  ('22222222-2222-2222-2222-222222222012', '11111111-1111-1111-1111-111111111013', 'europe_chat', 'Looking great! The color scheme aligns well with our brand guidelines. Minor suggestion on the data grid spacing.', '2024-01-15 10:15:00');

-- Introductions
INSERT INTO public.posts (id, author_id, channel, title, content, created_at) VALUES
  ('22222222-2222-2222-2222-222222222021', '11111111-1111-1111-1111-111111111005', 'introductions', 'Product Manager - London', 'Hi everyone! I''m Sarah, joining the product team. Previously worked at a fintech startup. Excited to collaborate with this amazing team!', '2024-01-08'),
  ('22222222-2222-2222-2222-222222222022', '11111111-1111-1111-1111-111111111020', 'introductions', 'Software Engineer - Singapore', 'Hello! I''m Alex, a full-stack developer with 5 years of experience. Love building scalable solutions and always up for a coffee chat!', '2024-01-05'),
  ('22222222-2222-2222-2222-222222222023', '11111111-1111-1111-1111-111111111008', 'introductions', 'Sales Director - Madrid', 'Hola! Maria here, leading the EMEA sales team. Looking forward to connecting with everyone and driving growth together.', '2024-01-03');

-- Wins
INSERT INTO public.posts (id, author_id, channel, title, content, created_at) VALUES
  ('22222222-2222-2222-2222-222222222031', '11111111-1111-1111-1111-111111111012', 'wins', 'Healthcare Integration Project Goes Live! 🏥', 'Huge milestone - our healthcare client''s patient portal integration is now live and running smoothly!

**The client:** Regional hospital network with 12 facilities across 3 states.

**What we built:** Full EHR integration connecting their legacy systems to a modern patient portal. Patients can now view records, schedule appointments, and message providers - all in one place.

**Key challenges overcome:** Legacy system APIs were poorly documented. Our team spent 3 weeks reverse-engineering the data flows. Shoutout to the engineering team for their persistence!

**Business impact:** Client reports 40% reduction in phone call volume and patient satisfaction scores up 25%.', '2024-01-15'),
  ('22222222-2222-2222-2222-222222222032', '11111111-1111-1111-1111-111111111003', 'wins', 'Q4 Revenue Target Exceeded by 15%! 📈', 'Thrilled to announce we''ve closed Q4 with revenue 15% above our target!

**The wins that got us here:**
• Closed 3 new enterprise accounts in November
• Renewed our largest client with a 2-year extension
• Expanded into the APAC region with our first Singapore client

**What made the difference:** The new sales methodology we implemented in September is paying off. Deal cycles shortened by an average of 2 weeks.', '2024-01-14'),
  ('22222222-2222-2222-2222-222222222033', '11111111-1111-1111-1111-111111111017', 'wins', 'Migration Project Completed 2 Weeks Early! ⚡', 'Our largest cloud migration project just wrapped up - 2 weeks ahead of schedule!

**The project:** Migrating a financial services client from on-premise infrastructure to Azure cloud.

**Scope:** 200+ applications, 15TB of data, and zero tolerance for downtime during trading hours.

**How we did it:** Our phased migration approach and weekend cutover windows kept the client operational throughout.', '2024-01-13');

-- =============================================
-- INSERT COMMENTS
-- =============================================
INSERT INTO public.comments (post_id, author_id, content, created_at) VALUES
  ('22222222-2222-2222-2222-222222222001', '11111111-1111-1111-1111-111111111004', 'Great proposal! The phased approach makes sense.', '2024-01-15 09:10:00'),
  ('22222222-2222-2222-2222-222222222021', '11111111-1111-1111-1111-111111111020', 'Welcome Sarah! Looking forward to working with you!', '2024-01-08 10:00:00'),
  ('22222222-2222-2222-2222-222222222022', '11111111-1111-1111-1111-111111111008', 'Great to have you on the team Alex!', '2024-01-05 14:00:00'),
  ('22222222-2222-2222-2222-222222222022', '11111111-1111-1111-1111-111111111005', 'Welcome! Let''s grab that coffee sometime!', '2024-01-08 09:00:00');

-- =============================================
-- INSERT LIKES
-- =============================================
INSERT INTO public.likes (post_id, user_id) VALUES
  ('22222222-2222-2222-2222-222222222001', '11111111-1111-1111-1111-111111111004'),
  ('22222222-2222-2222-2222-222222222001', '11111111-1111-1111-1111-111111111005'),
  ('22222222-2222-2222-2222-222222222001', '11111111-1111-1111-1111-111111111009'),
  ('22222222-2222-2222-2222-222222222021', '11111111-1111-1111-1111-111111111020'),
  ('22222222-2222-2222-2222-222222222021', '11111111-1111-1111-1111-111111111008'),
  ('22222222-2222-2222-2222-222222222031', '11111111-1111-1111-1111-111111111001'),
  ('22222222-2222-2222-2222-222222222031', '11111111-1111-1111-1111-111111111002'),
  ('22222222-2222-2222-2222-222222222031', '11111111-1111-1111-1111-111111111003');

-- =============================================
-- INSERT PROJECTS
-- =============================================

-- Current Projects
INSERT INTO public.projects (id, name, description, type, status, stage, deadline, client_name) VALUES
  ('33333333-3333-3333-3333-333333333001', 'Healthcare Analytics Migration', 'Migrating healthcare client data to Analytics Suite with real-time dashboards.', 'Migration', 'current', 'sit_vat', '2026-01-31', 'Regional Healthcare Network'),
  ('33333333-3333-3333-3333-333333333002', 'SAP ERP Integration', 'Building unified API gateway for SAP ERP system integration.', 'Integration', 'current', 'development', '2026-02-14', 'Global Manufacturing Corp'),
  ('33333333-3333-3333-3333-333333333003', 'Financial KPI Dashboard', 'Implementing real-time financial analytics using Analytics Foundation.', 'Analytics', 'current', 'delivery', '2026-01-25', 'Financial Services Ltd'),
  ('33333333-3333-3333-3333-333333333004', 'CRM Data Migration', 'Migrating legacy CRM data to cloud-native infrastructure.', 'Migration', 'current', 'design', '2026-02-28', 'Enterprise Solutions Inc');

-- Upcoming Projects
INSERT INTO public.projects (id, name, description, type, status, start_date) VALUES
  ('33333333-3333-3333-3333-333333333011', 'Healthcare Analytics Migration Phase 2', 'Full data migration from legacy healthcare reporting system to Analytics Suite.', 'Migration', 'upcoming', '2026-02-01'),
  ('33333333-3333-3333-3333-333333333012', 'CRM Integration - Phase 2', 'Integration of Salesforce CRM with internal project management tools.', 'Integration', 'upcoming', '2026-02-15'),
  ('33333333-3333-3333-3333-333333333013', 'Financial Analytics Dashboard', 'Implementation of real-time financial KPI dashboards using Analytics Foundation.', 'Analytics', 'upcoming', '2026-03-01'),
  ('33333333-3333-3333-3333-333333333014', 'ERP System Integration', 'End-to-end integration of SAP ERP with existing business intelligence platforms.', 'Integration', 'upcoming', '2026-03-15'),
  ('33333333-3333-3333-3333-333333333015', 'Legacy Database Migration', 'Migration of Oracle database to cloud-native analytics infrastructure.', 'Migration', 'upcoming', '2026-04-01');

-- Past Projects
INSERT INTO public.projects (id, name, description, type, status, end_date, summary, challenges, tools_used, tickets_raised) VALUES
  ('33333333-3333-3333-3333-333333333021', 'Enterprise Analytics Migration', 'Full migration of enterprise analytics platform with 500+ dashboards.', 'Migration', 'past', '2025-12-15', 'Successfully migrated 500+ dashboards and 2TB of data to cloud-native infrastructure.', 'Data validation complexity, legacy system dependencies, tight timeline', ARRAY['Analytics Suite', 'Azure Data Factory', 'Power BI'], 127),
  ('33333333-3333-3333-3333-333333333022', 'Salesforce CRM Integration', 'Complete integration with Salesforce CRM for real-time sales analytics.', 'Integration', 'past', '2025-11-30', 'Integrated Salesforce CRM with internal analytics platform enabling real-time sales insights.', 'API rate limits, data mapping inconsistencies, SSO configuration', ARRAY['Salesforce API', 'MuleSoft', 'Analytics Foundation'], 84),
  ('33333333-3333-3333-3333-333333333023', 'Global Analytics Dashboard', 'Multi-region analytics dashboard supporting 5 global data centers.', 'Analytics', 'past', '2025-10-20', 'Deployed multi-region dashboard with geo-distributed data processing and caching.', 'Latency optimization, data consistency across regions, timezone handling', ARRAY['Analytics Advanced', 'Redis', 'CloudFront CDN'], 156),
  ('33333333-3333-3333-3333-333333333024', 'Legacy System Migration', 'Migration from Oracle to cloud-native analytics infrastructure.', 'Migration', 'past', '2025-09-15', 'Migrated Oracle-based reporting to modern cloud infrastructure with cost savings.', 'Complex stored procedures, data transformation logic, user training', ARRAY['AWS RDS', 'Snowflake', 'dbt', 'Analytics Suite'], 203);

-- =============================================
-- INSERT PROJECT MEMBERS
-- =============================================
INSERT INTO public.project_members (project_id, profile_id, role) VALUES
  ('33333333-3333-3333-3333-333333333001', '11111111-1111-1111-1111-111111111016', 'Lead'),
  ('33333333-3333-3333-3333-333333333001', '11111111-1111-1111-1111-111111111020', 'Developer'),
  ('33333333-3333-3333-3333-333333333001', '11111111-1111-1111-1111-111111111008', 'PM'),
  ('33333333-3333-3333-3333-333333333002', '11111111-1111-1111-1111-111111111013', 'Lead'),
  ('33333333-3333-3333-3333-333333333002', '11111111-1111-1111-1111-111111111014', 'Developer'),
  ('33333333-3333-3333-3333-333333333002', '11111111-1111-1111-1111-111111111017', 'Developer'),
  ('33333333-3333-3333-3333-333333333003', '11111111-1111-1111-1111-111111111017', 'Lead'),
  ('33333333-3333-3333-3333-333333333003', '11111111-1111-1111-1111-111111111005', 'PM'),
  ('33333333-3333-3333-3333-333333333004', '11111111-1111-1111-1111-111111111010', 'Lead'),
  ('33333333-3333-3333-3333-333333333004', '11111111-1111-1111-1111-111111111004', 'PM');

-- =============================================
-- INSERT TRAINING MODULES
-- =============================================
INSERT INTO public.training_modules (suite, title, description, duration_minutes, order_index) VALUES
  -- Analytics Suite
  ('analytics', 'Analytics ADA', 'Learn the fundamentals of Analytics Data Architecture for building scalable data solutions.', 120, 1),
  ('analytics', 'Analytics Admin', 'Master administration and configuration of the Analytics platform.', 90, 2),
  ('analytics', 'Analytics Foundation', 'Core concepts and best practices for analytics implementation.', 150, 3),
  ('analytics', 'Analytics Advanced', 'Advanced techniques for complex analytics scenarios and optimization.', 180, 4),
  -- Integration Suite
  ('integration', 'Integration Admin', 'Administration and management of integration pipelines and connectors.', 90, 1),
  ('integration', 'Integration Foundation', 'Foundational concepts for building robust integrations.', 120, 2),
  ('integration', 'Integration Advanced', 'Advanced integration patterns and enterprise scenarios.', 150, 3),
  -- Sales Training
  ('sales', 'Consultative Selling', 'Master the art of consultative selling to build lasting client relationships.', 60, 1),
  ('sales', 'Objection Handling', 'Techniques for effectively handling and overcoming sales objections.', 45, 2),
  ('sales', 'Enterprise Sales Strategy', 'Strategic approaches for complex enterprise sales cycles.', 90, 3),
  ('sales', 'SPIN Selling', 'Apply the SPIN selling methodology to improve sales conversations.', 75, 4),
  -- Generic Training
  ('generic', 'Effective Communication', 'Develop clear and impactful communication skills for professional success.', 60, 1),
  ('generic', 'Time Management', 'Strategies and tools for maximizing productivity and managing time effectively.', 45, 2),
  ('generic', 'Leadership Essentials', 'Core leadership principles for emerging and established leaders.', 90, 3),
  ('generic', 'V-Model Methodology', 'Understanding and applying the V-Model for software development and testing.', 120, 4);

-- =============================================
-- INSERT COMPANY SITES
-- =============================================
INSERT INTO public.company_sites (name, description, url, category, icon, order_index) VALUES
  ('IT-Hub', 'Central IT service desk for support tickets, hardware requests, and technical assistance.', 'https://ithub.company.com', 'Internal', 'Monitor', 1),
  ('Expensify', 'Submit and manage expense reports, receipts, and reimbursement claims.', 'https://expensify.com', 'Finance', 'Receipt', 2),
  ('OpenAir', 'Time tracking, project management, and resource allocation platform.', 'https://openair.company.com', 'Internal', 'Clock', 3),
  ('License Generator', 'Generate and manage software licenses for customer deployments.', 'https://licenses.company.com', 'Internal', 'Key', 4),
  ('Customer Portal', 'Customer-facing portal for account management, support tickets, and documentation.', 'https://portal.company.com', 'Portal', 'Users', 5),
  ('SI Partner Portal', 'System Integrator partner resources, certifications, and deal registration.', 'https://partners.company.com', 'Portal', 'Handshake', 6),
  ('Company Website', 'Main corporate website with company information, products, and news.', 'https://www.company.com', 'External', 'Globe', 7),
  ('Leave Application', 'Apply for leave, view balances, and manage time-off requests.', 'https://leave.company.com', 'HR', 'Calendar', 8);

-- =============================================
-- INSERT PARTNERSHIPS
-- =============================================
INSERT INTO public.partnerships (partner_name, description, website_url, contact_email, partnership_type, is_active) VALUES
  ('Microsoft', 'Strategic technology partner for cloud infrastructure and enterprise solutions.', 'https://microsoft.com', 'partnerships@microsoft.com', 'Technology', true),
  ('Salesforce', 'CRM integration partner for customer relationship management solutions.', 'https://salesforce.com', 'partners@salesforce.com', 'Integration', true),
  ('AWS', 'Cloud infrastructure partner for scalable hosting and analytics.', 'https://aws.amazon.com', 'partners@aws.com', 'Technology', true),
  ('Accenture', 'System integrator partner for large-scale enterprise implementations.', 'https://accenture.com', 'alliances@accenture.com', 'SI Partner', true),
  ('Deloitte', 'Consulting partner for digital transformation initiatives.', 'https://deloitte.com', 'partnerships@deloitte.com', 'Consulting', true);

-- =============================================
-- INSERT SOLUTIONS
-- =============================================
INSERT INTO public.solutions (title, description, category, tags, author_id) VALUES
  ('Healthcare Data Migration Template', 'Comprehensive template for migrating healthcare data with HIPAA compliance considerations.', 'Migration', ARRAY['healthcare', 'compliance', 'data-migration'], '11111111-1111-1111-1111-111111111009'),
  ('Salesforce Integration Playbook', 'Step-by-step guide for integrating Salesforce CRM with analytics platforms.', 'Integration', ARRAY['salesforce', 'crm', 'api'], '11111111-1111-1111-1111-111111111014'),
  ('Real-time Dashboard Architecture', 'Reference architecture for building real-time analytics dashboards at scale.', 'Analytics', ARRAY['dashboards', 'real-time', 'architecture'], '11111111-1111-1111-1111-111111111009'),
  ('Enterprise SSO Configuration Guide', 'Guide for configuring Single Sign-On across enterprise applications.', 'Security', ARRAY['sso', 'authentication', 'security'], '11111111-1111-1111-1111-111111111006'),
  ('Cloud Cost Optimization Strategies', 'Best practices for optimizing cloud infrastructure costs while maintaining performance.', 'Infrastructure', ARRAY['cloud', 'cost', 'optimization'], '11111111-1111-1111-1111-111111111010');