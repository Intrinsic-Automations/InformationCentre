-- Ensure customers.author_id is always set to the current user's profile id

-- Helper to get the current user's profile id
CREATE OR REPLACE FUNCTION public.current_profile_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id
  FROM public.profiles
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

-- Trigger function to enforce author_id
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

DROP TRIGGER IF EXISTS set_customer_author_id ON public.customers;
CREATE TRIGGER set_customer_author_id
BEFORE INSERT ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.set_customer_author_id();

-- Relax INSERT policy (trigger enforces correct author_id)
DROP POLICY IF EXISTS "Authenticated users can insert customers" ON public.customers;
CREATE POLICY "Authenticated users can insert customers" ON public.customers
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);
