-- Create table to track customer access permissions
CREATE TABLE public.customer_access (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  granted_by uuid NOT NULL REFERENCES public.profiles(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(customer_id, user_id)
);

-- Enable RLS
ALTER TABLE public.customer_access ENABLE ROW LEVEL SECURITY;

-- Customer access policies
CREATE POLICY "Users can view access for their customers" ON public.customer_access
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM customers c
    JOIN profiles p ON p.id = c.author_id
    WHERE c.id = customer_access.customer_id AND p.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = customer_access.user_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Customer owners can manage access" ON public.customer_access
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM customers c
    JOIN profiles p ON p.id = c.author_id
    WHERE c.id = customer_access.customer_id AND p.user_id = auth.uid()
  )
);

CREATE POLICY "Customer owners can revoke access" ON public.customer_access
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM customers c
    JOIN profiles p ON p.id = c.author_id
    WHERE c.id = customer_access.customer_id AND p.user_id = auth.uid()
  )
);

-- Update customers SELECT policy to only allow owner or granted users
DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;
CREATE POLICY "Users can view their own or granted customers" ON public.customers
FOR SELECT USING (
  -- User is the owner
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = customers.author_id AND p.user_id = auth.uid()
  )
  OR
  -- User has been granted access
  EXISTS (
    SELECT 1 FROM customer_access ca
    JOIN profiles p ON p.id = ca.user_id
    WHERE ca.customer_id = customers.id AND p.user_id = auth.uid()
  )
);