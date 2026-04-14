ALTER TABLE lifecycle_items ADD COLUMN method_tags text[] NOT NULL DEFAULT '{}';
ALTER TABLE lifecycle_meetings_tasks ADD COLUMN method_tags text[] NOT NULL DEFAULT '{}';