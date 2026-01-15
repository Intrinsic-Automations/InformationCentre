-- Remove the public SELECT policy that exposes action steps to everyone
DROP POLICY IF EXISTS "Allow public read access on opportunity_action_steps" ON public.opportunity_action_steps;

-- The existing "Authenticated users can view action steps" policy remains and properly restricts to authenticated users