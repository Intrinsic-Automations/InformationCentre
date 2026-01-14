-- Add author_id column to partnerships table for ownership tracking
ALTER TABLE public.partnerships ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES public.profiles(id);

-- Add additional columns for richer partnership data
ALTER TABLE public.partnerships ADD COLUMN IF NOT EXISTS since_year TEXT;
ALTER TABLE public.partnerships ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
ALTER TABLE public.partnerships ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE public.partnerships ADD COLUMN IF NOT EXISTS key_benefits TEXT[];
ALTER TABLE public.partnerships ADD COLUMN IF NOT EXISTS focus_areas TEXT[];

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can manage partnerships" ON public.partnerships;

-- Create new policies that allow users to manage their own partnerships
CREATE POLICY "Users can create partnerships" 
ON public.partnerships 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = author_id));

CREATE POLICY "Users can update their own partnerships" 
ON public.partnerships 
FOR UPDATE 
TO authenticated
USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = author_id));

CREATE POLICY "Users can delete their own partnerships" 
ON public.partnerships 
FOR DELETE 
TO authenticated
USING (auth.uid() IN (SELECT user_id FROM public.profiles WHERE id = author_id));

-- Update the select policy to allow all authenticated users to view
DROP POLICY IF EXISTS "Partnerships are viewable by authenticated users" ON public.partnerships;
CREATE POLICY "Partnerships are viewable by authenticated users" 
ON public.partnerships 
FOR SELECT 
TO authenticated
USING (true);