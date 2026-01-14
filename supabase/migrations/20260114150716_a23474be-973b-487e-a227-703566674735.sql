-- Fix 1: Update opportunity_action_steps to require authentication for reading
DROP POLICY IF EXISTS "Anyone can view action steps" ON public.opportunity_action_steps;
CREATE POLICY "Authenticated users can view action steps" 
ON public.opportunity_action_steps 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Fix 2: Update profiles table to require authentication for reading
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Authenticated users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Fix 3: Update customers table to require authentication for reading
DROP POLICY IF EXISTS "Anyone can view customers" ON public.customers;
DROP POLICY IF EXISTS "Customers are viewable by everyone" ON public.customers;
CREATE POLICY "Authenticated users can view customers" 
ON public.customers 
FOR SELECT 
USING (auth.uid() IS NOT NULL);