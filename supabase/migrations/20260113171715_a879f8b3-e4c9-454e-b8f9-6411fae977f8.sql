-- Drop overly permissive policies and replace with authenticated user policies

-- customer_documents
DROP POLICY IF EXISTS "Customer documents can be deleted by everyone" ON customer_documents;
DROP POLICY IF EXISTS "Customer documents can be inserted by everyone" ON customer_documents;
DROP POLICY IF EXISTS "Customer documents can be updated by everyone" ON customer_documents;

CREATE POLICY "Authenticated users can insert customer documents" 
ON customer_documents FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update customer documents" 
ON customer_documents FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete customer documents" 
ON customer_documents FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- customers
DROP POLICY IF EXISTS "Customers can be deleted by everyone" ON customers;
DROP POLICY IF EXISTS "Customers can be inserted by everyone" ON customers;
DROP POLICY IF EXISTS "Customers can be updated by everyone" ON customers;

CREATE POLICY "Authenticated users can insert customers" 
ON customers FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update customers" 
ON customers FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete customers" 
ON customers FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- opportunities
DROP POLICY IF EXISTS "Opportunities can be deleted by everyone" ON opportunities;
DROP POLICY IF EXISTS "Opportunities can be inserted by everyone" ON opportunities;
DROP POLICY IF EXISTS "Opportunities can be updated by everyone" ON opportunities;

CREATE POLICY "Authenticated users can insert opportunities" 
ON opportunities FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update opportunities" 
ON opportunities FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete opportunities" 
ON opportunities FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- opportunity_action_steps
DROP POLICY IF EXISTS "Allow public delete on opportunity_action_steps" ON opportunity_action_steps;
DROP POLICY IF EXISTS "Allow public insert on opportunity_action_steps" ON opportunity_action_steps;
DROP POLICY IF EXISTS "Allow public update on opportunity_action_steps" ON opportunity_action_steps;

CREATE POLICY "Authenticated users can insert opportunity_action_steps" 
ON opportunity_action_steps FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update opportunity_action_steps" 
ON opportunity_action_steps FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete opportunity_action_steps" 
ON opportunity_action_steps FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- opportunity_interactions
DROP POLICY IF EXISTS "Opportunity interactions can be deleted by everyone" ON opportunity_interactions;
DROP POLICY IF EXISTS "Opportunity interactions can be inserted by everyone" ON opportunity_interactions;
DROP POLICY IF EXISTS "Opportunity interactions can be updated by everyone" ON opportunity_interactions;

CREATE POLICY "Authenticated users can insert opportunity_interactions" 
ON opportunity_interactions FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update opportunity_interactions" 
ON opportunity_interactions FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete opportunity_interactions" 
ON opportunity_interactions FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- opportunity_stakeholders
DROP POLICY IF EXISTS "Stakeholders can be deleted by everyone" ON opportunity_stakeholders;
DROP POLICY IF EXISTS "Stakeholders can be inserted by everyone" ON opportunity_stakeholders;
DROP POLICY IF EXISTS "Stakeholders can be updated by everyone" ON opportunity_stakeholders;

CREATE POLICY "Authenticated users can insert stakeholders" 
ON opportunity_stakeholders FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update stakeholders" 
ON opportunity_stakeholders FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete stakeholders" 
ON opportunity_stakeholders FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- profiles - fix insert policy to only allow users to insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);