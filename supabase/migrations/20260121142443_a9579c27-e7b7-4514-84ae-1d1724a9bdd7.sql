-- Add new fields to opportunities table for expanded detail view
ALTER TABLE public.opportunities 
ADD COLUMN IF NOT EXISTS partner_prime_quotations text,
ADD COLUMN IF NOT EXISTS eq_products text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS eq_employees text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS start_date date,
ADD COLUMN IF NOT EXISTS end_date date,
ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium';