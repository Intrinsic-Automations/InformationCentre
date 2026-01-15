-- Drop any existing trigger first
DROP TRIGGER IF EXISTS set_customer_author_id ON public.customers;

-- Create the trigger in the correct schema
CREATE TRIGGER set_customer_author_id
BEFORE INSERT ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.set_customer_author_id();

-- Verify the trigger was created
SELECT trigger_name FROM information_schema.triggers WHERE event_object_table = 'customers';