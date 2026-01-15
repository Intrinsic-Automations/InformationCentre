-- Add author_id column to customers table
ALTER TABLE public.customers ADD COLUMN author_id uuid REFERENCES public.profiles(id);

-- Update all existing customers to be owned by Arran Johnson
UPDATE public.customers SET author_id = '8fee531a-32c4-4162-a354-4cbb2aa199b7';

-- Make author_id NOT NULL after populating existing records
ALTER TABLE public.customers ALTER COLUMN author_id SET NOT NULL;

-- Update RLS policies to use author for modifications
DROP POLICY IF EXISTS "Authenticated users can update customers" ON public.customers;
CREATE POLICY "Users can update their own customers" ON public.customers
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = customers.author_id AND p.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Authenticated users can delete customers" ON public.customers;
CREATE POLICY "Users can delete their own customers" ON public.customers
FOR DELETE USING (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = customers.author_id AND p.user_id = auth.uid()
  )
);

-- Update insert policy to set author_id correctly
DROP POLICY IF EXISTS "Authenticated users can insert customers" ON public.customers;
CREATE POLICY "Authenticated users can insert customers" ON public.customers
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = customers.author_id AND p.user_id = auth.uid()
  )
);