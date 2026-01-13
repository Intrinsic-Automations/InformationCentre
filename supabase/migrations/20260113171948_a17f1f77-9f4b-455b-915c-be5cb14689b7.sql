-- Allow authenticated users to insert announcements (with their own author_id)
CREATE POLICY "Authenticated users can insert announcements" 
ON announcements FOR INSERT 
WITH CHECK (auth.uid() = author_id);

-- Allow users to update their own announcements
CREATE POLICY "Users can update their own announcements" 
ON announcements FOR UPDATE 
USING (auth.uid() = author_id);