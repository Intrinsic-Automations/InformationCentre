-- COMPLETE cleanup of mock users
-- Reassigning ALL content to Arran Johnson: 8fee531a-32c4-4162-a354-4cbb2aa199b7

-- Step 1: Update all tables with author_id references
UPDATE public.news SET author_id = '8fee531a-32c4-4162-a354-4cbb2aa199b7'
WHERE author_id IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

UPDATE public.posts SET author_id = '8fee531a-32c4-4162-a354-4cbb2aa199b7'
WHERE author_id IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

UPDATE public.comments SET author_id = '8fee531a-32c4-4162-a354-4cbb2aa199b7'
WHERE author_id IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

UPDATE public.announcements SET author_id = '8fee531a-32c4-4162-a354-4cbb2aa199b7'
WHERE author_id IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

UPDATE public.project_insights SET author_id = '8fee531a-32c4-4162-a354-4cbb2aa199b7'
WHERE author_id IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

UPDATE public.partnerships SET author_id = '8fee531a-32c4-4162-a354-4cbb2aa199b7'
WHERE author_id IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

UPDATE public.solutions SET author_id = '8fee531a-32c4-4162-a354-4cbb2aa199b7'
WHERE author_id IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

UPDATE public.customers SET author_id = '8fee531a-32c4-4162-a354-4cbb2aa199b7'
WHERE author_id IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

UPDATE public.projects SET author_id = '8fee531a-32c4-4162-a354-4cbb2aa199b7'
WHERE author_id IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

-- Step 2: Delete from tables with user_id references
DELETE FROM public.likes WHERE user_id IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

DELETE FROM public.notifications WHERE user_id IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

DELETE FROM public.notification_preferences WHERE user_id IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

DELETE FROM public.user_roles WHERE user_id IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

DELETE FROM public.training_progress WHERE user_id IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

DELETE FROM public.customer_access WHERE user_id IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

DELETE FROM public.customer_access WHERE granted_by IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

DELETE FROM public.project_members WHERE profile_id IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

-- Step 3: Delete from tables with uploaded_by / created_by references
DELETE FROM public.project_documents WHERE uploaded_by IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

DELETE FROM public.project_insight_documents WHERE uploaded_by IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

DELETE FROM public.hr_topic_documents WHERE uploaded_by IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

DELETE FROM public.execution_documents WHERE uploaded_by IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

DELETE FROM public.training_resource_links WHERE created_by IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

-- Step 4: Clear reports_to self-references
UPDATE public.profiles SET reports_to = NULL
WHERE reports_to IN (SELECT id FROM public.profiles WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User'));

-- Step 5: Finally delete the mock profiles
DELETE FROM public.profiles 
WHERE full_name NOT IN ('Alan Walker', 'Arran Johnson', 'Francis Gresham', 'Test User');