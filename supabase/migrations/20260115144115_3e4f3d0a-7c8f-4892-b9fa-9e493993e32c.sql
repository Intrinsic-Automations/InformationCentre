-- Fix infinite recursion by using auth.uid() directly and avoiding circular references

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can view their own or granted customers" ON public.customers;
DROP POLICY IF EXISTS "Users can view access for their customers" ON public.customer_access;

-- Create fixed customers SELECT policy using security definer function to avoid recursion
CREATE OR REPLACE FUNCTION public.user_can_access_customer(customer_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    -- User is the owner (author)
    SELECT 1 FROM customers c
    INNER JOIN profiles p ON p.id = c.author_id
    WHERE c.id = customer_id AND p.user_id = auth.uid()
  )
  OR EXISTS (
    -- User has been granted access
    SELECT 1 FROM customer_access ca
    INNER JOIN profiles p ON p.id = ca.user_id
    WHERE ca.customer_id = customer_id AND p.user_id = auth.uid()
  );
$$;

-- Simpler customers policy using the function
CREATE POLICY "Users can view their own or granted customers" ON public.customers
FOR SELECT USING (
  public.user_can_access_customer(id)
);

-- Fixed customer_access SELECT policy - avoid referencing customers table
CREATE POLICY "Users can view their customer access" ON public.customer_access
FOR SELECT USING (
  -- User is the owner of the customer
  granted_by IN (SELECT id FROM profiles WHERE user_id = auth.uid())
  OR
  -- User is the one granted access
  user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())
);