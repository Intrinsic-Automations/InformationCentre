ALTER TABLE public.lifecycle_meetings_tasks
  ADD COLUMN description text,
  ADD COLUMN responsible_role text,
  ADD COLUMN inputs text[] DEFAULT '{}'::text[],
  ADD COLUMN outputs text[] DEFAULT '{}'::text[];