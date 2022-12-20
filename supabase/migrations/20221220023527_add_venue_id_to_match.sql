-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

ALTER TABLE IF EXISTS public.match
    ADD COLUMN venue_id uuid;

ALTER TABLE IF EXISTS public.match
    ADD CONSTRAINT match_venue_id_fkey FOREIGN KEY (venue_id)
    REFERENCES public.venue (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;
