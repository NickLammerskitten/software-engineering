alter table public.image add column image_path text;

CREATE POLICY "Enable read access for authenticated users" ON "storage"."objects"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for trader users" ON "storage"."objects"
    AS PERMISSIVE FOR INSERT
    TO trader
    WITH CHECK (true);

CREATE POLICY "Enable update for trader user" ON "storage"."objects"
    AS PERMISSIVE FOR UPDATE
    TO trader
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete for trader user" ON "storage"."objects"
    AS PERMISSIVE FOR DELETE
    TO trader
    USING (true);

-- Policies for the "storage"."buckets" table
CREATE POLICY "Enable read access for authenticated users" ON "storage"."buckets"
    AS PERMISSIVE FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Enable insert for trader user" ON "storage"."buckets"
    AS PERMISSIVE FOR INSERT
    TO trader
    WITH CHECK (true);

CREATE POLICY "Enable update for trader user" ON "storage"."buckets"
    AS PERMISSIVE FOR UPDATE
    TO trader
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable delete for trader user" ON "storage"."buckets"
    AS PERMISSIVE FOR DELETE
    TO trader
    USING (true);