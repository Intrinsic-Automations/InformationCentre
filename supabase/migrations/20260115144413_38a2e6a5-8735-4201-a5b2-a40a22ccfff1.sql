-- Fix customers RLS INSERT policy to avoid false negatives

DROP POLICY IF EXISTS "Authenticated users can insert customers" ON public.customers;
CREATE POLICY "Authenticated users can insert customers" ON public.customers
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND author_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

-- Also simplify UPDATE/DELETE policies to match the same ownership check
DROP POLICY IF EXISTS "Users can update their own customers" ON public.customers;
CREATE POLICY "Users can update their own customers" ON public.customers
FOR UPDATE
USING (
  author_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
)
WITH CHECK (
  author_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "Users can delete their own customers" ON public.customers;
CREATE POLICY "Users can delete their own customers" ON public.customers
FOR DELETE
USING (
  author_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
);
