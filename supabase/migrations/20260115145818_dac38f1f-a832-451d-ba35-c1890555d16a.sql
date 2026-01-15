-- Make customer creation robust: allow any authenticated user to insert,
-- while a trigger enforces the correct author_id (prevents spoofing).

DROP POLICY IF EXISTS "Authenticated users can insert customers" ON public.customers;
CREATE POLICY "Authenticated users can insert customers" ON public.customers
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Ensure trigger always overwrites any client-provided author_id
CREATE OR REPLACE FUNCTION public.set_customer_author_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.author_id := public.current_profile_id();
  RETURN NEW;
END;
$$;
