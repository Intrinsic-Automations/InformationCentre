-- Assign all partnerships to Arran Johnson
UPDATE public.partnerships 
SET author_id = '8fee531a-32c4-4162-a354-4cbb2aa199b7'
WHERE author_id IS NULL OR author_id != '8fee531a-32c4-4162-a354-4cbb2aa199b7';