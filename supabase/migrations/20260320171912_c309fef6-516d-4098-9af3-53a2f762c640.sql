
-- Convert responsible_role from text to text[] in lifecycle_items
ALTER TABLE public.lifecycle_items 
  ALTER COLUMN responsible_role TYPE text[] 
  USING CASE 
    WHEN responsible_role IS NOT NULL AND responsible_role != '' 
    THEN ARRAY[responsible_role] 
    ELSE '{}'::text[] 
  END;

ALTER TABLE public.lifecycle_items 
  ALTER COLUMN responsible_role SET DEFAULT '{}'::text[];

-- Convert responsible_role from text to text[] in lifecycle_meetings_tasks
ALTER TABLE public.lifecycle_meetings_tasks 
  ALTER COLUMN responsible_role TYPE text[] 
  USING CASE 
    WHEN responsible_role IS NOT NULL AND responsible_role != '' 
    THEN ARRAY[responsible_role] 
    ELSE '{}'::text[] 
  END;

ALTER TABLE public.lifecycle_meetings_tasks 
  ALTER COLUMN responsible_role SET DEFAULT '{}'::text[];
