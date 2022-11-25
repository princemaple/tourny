--
-- PostgreSQL database dump
--

-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.3 (Debian 14.3-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- CREATE SCHEMA "public";


ALTER SCHEMA "public" OWNER TO "postgres";

--
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "public";


--
-- Name: EXTENSION "pg_graphql"; Type: COMMENT; Schema: -; Owner: 
--

-- COMMENT ON EXTENSION "pg_graphql" IS 'GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";


--
-- Name: EXTENSION "pg_stat_statements"; Type: COMMENT; Schema: -; Owner: 
--

-- COMMENT ON EXTENSION "pg_stat_statements" IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";


--
-- Name: EXTENSION "pgcrypto"; Type: COMMENT; Schema: -; Owner: 
--

-- COMMENT ON EXTENSION "pgcrypto" IS 'cryptographic functions';


--
-- Name: pgjwt; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";


--
-- Name: EXTENSION "pgjwt"; Type: COMMENT; Schema: -; Owner: 
--

-- COMMENT ON EXTENSION "pgjwt" IS 'JSON Web Token API for Postgresql';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

-- COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: stage_types; Type: TYPE; Schema: public; Owner: supabase_admin
--

CREATE TYPE "public"."stage_types" AS ENUM (
    'round_robin',
    'elimination',
    'upper_lower'
);


ALTER TYPE "public"."stage_types" OWNER TO "supabase_admin";

SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: group; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE "public"."group" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "tournament_id" "uuid" NOT NULL,
    "stage_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "winner_count" smallint DEFAULT '1'::smallint NOT NULL
);


ALTER TABLE "public"."group" OWNER TO "supabase_admin";

--
-- Name: group_participants; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE "public"."group_participants" (
    "group_id" "uuid" NOT NULL,
    "participant_id" "uuid" NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."group_participants" OWNER TO "supabase_admin";

--
-- Name: match; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE "public"."match" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "group_id" "uuid" NOT NULL,
    "stage_id" "uuid" NOT NULL,
    "tournament_id" "uuid" NOT NULL,
    "left" "uuid",
    "right" "uuid",
    "games" "jsonb" DEFAULT '[]'::"jsonb",
    "result" "jsonb",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "start_at" timestamp with time zone,
    "end_at" timestamp with time zone,
    "next_match_id" "uuid",
    "best_of" smallint DEFAULT '1'::smallint NOT NULL
);


ALTER TABLE "public"."match" OWNER TO "supabase_admin";

--
-- Name: participant; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE "public"."participant" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying NOT NULL,
    "tournament_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."participant" OWNER TO "supabase_admin";

--
-- Name: stage; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE "public"."stage" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "tournament_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "type" "public"."stage_types" NOT NULL,
    "default_best_of" smallint DEFAULT '1'::smallint NOT NULL,
    "default_winner_count" smallint DEFAULT '1'::smallint NOT NULL
);


ALTER TABLE "public"."stage" OWNER TO "supabase_admin";

--
-- Name: tournament; Type: TABLE; Schema: public; Owner: supabase_admin
--

CREATE TABLE "public"."tournament" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying NOT NULL,
    "description" "text",
    "meta" "jsonb" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "start_at" timestamp with time zone,
    "end_at" timestamp with time zone
);


ALTER TABLE "public"."tournament" OWNER TO "supabase_admin";

--
-- Name: group_participants group_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."group_participants"
    ADD CONSTRAINT "group_participants_pkey" PRIMARY KEY ("group_id", "participant_id");


--
-- Name: group group_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."group"
    ADD CONSTRAINT "group_pkey" PRIMARY KEY ("id");


--
-- Name: match match_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."match"
    ADD CONSTRAINT "match_pkey" PRIMARY KEY ("id");


--
-- Name: participant participant_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."participant"
    ADD CONSTRAINT "participant_pkey" PRIMARY KEY ("id");


--
-- Name: stage stage_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."stage"
    ADD CONSTRAINT "stage_pkey" PRIMARY KEY ("id");


--
-- Name: tournament tornament_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."tournament"
    ADD CONSTRAINT "tornament_pkey" PRIMARY KEY ("id");


--
-- Name: group auto_updated_at_on_group; Type: TRIGGER; Schema: public; Owner: supabase_admin
--

CREATE TRIGGER "auto_updated_at_on_group" BEFORE UPDATE ON "public"."group" FOR EACH STATEMENT EXECUTE FUNCTION "storage"."update_updated_at_column"();


--
-- Name: match auto_updated_at_on_match; Type: TRIGGER; Schema: public; Owner: supabase_admin
--

CREATE TRIGGER "auto_updated_at_on_match" BEFORE UPDATE ON "public"."match" FOR EACH ROW EXECUTE FUNCTION "storage"."update_updated_at_column"();


--
-- Name: participant auto_updated_at_on_participant; Type: TRIGGER; Schema: public; Owner: supabase_admin
--

CREATE TRIGGER "auto_updated_at_on_participant" BEFORE UPDATE ON "public"."participant" FOR EACH STATEMENT EXECUTE FUNCTION "storage"."update_updated_at_column"();


--
-- Name: stage auto_updated_at_on_stage; Type: TRIGGER; Schema: public; Owner: supabase_admin
--

CREATE TRIGGER "auto_updated_at_on_stage" BEFORE UPDATE ON "public"."stage" FOR EACH STATEMENT EXECUTE FUNCTION "storage"."update_updated_at_column"();


--
-- Name: tournament auto_updated_at_on_tournament; Type: TRIGGER; Schema: public; Owner: supabase_admin
--

CREATE TRIGGER "auto_updated_at_on_tournament" BEFORE UPDATE ON "public"."tournament" FOR EACH STATEMENT EXECUTE FUNCTION "storage"."update_updated_at_column"();


--
-- Name: group_participants group_participants_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."group_participants"
    ADD CONSTRAINT "group_participants_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id");


--
-- Name: group_participants group_participants_participant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."group_participants"
    ADD CONSTRAINT "group_participants_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "public"."participant"("id");


--
-- Name: group group_stage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."group"
    ADD CONSTRAINT "group_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "public"."stage"("id");


--
-- Name: group group_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."group"
    ADD CONSTRAINT "group_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournament"("id");


--
-- Name: group group_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."group"
    ADD CONSTRAINT "group_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");


--
-- Name: match match_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."match"
    ADD CONSTRAINT "match_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id");


--
-- Name: match match_left_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."match"
    ADD CONSTRAINT "match_left_fkey" FOREIGN KEY ("left") REFERENCES "public"."participant"("id");


--
-- Name: match match_next_match_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."match"
    ADD CONSTRAINT "match_next_match_id_fkey" FOREIGN KEY ("next_match_id") REFERENCES "public"."match"("id");


--
-- Name: match match_right_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."match"
    ADD CONSTRAINT "match_right_fkey" FOREIGN KEY ("right") REFERENCES "public"."participant"("id");


--
-- Name: match match_stage_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."match"
    ADD CONSTRAINT "match_stage_id_fkey" FOREIGN KEY ("stage_id") REFERENCES "public"."stage"("id");


--
-- Name: match match_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."match"
    ADD CONSTRAINT "match_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournament"("id");


--
-- Name: participant participant_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."participant"
    ADD CONSTRAINT "participant_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournament"("id");


--
-- Name: participant participant_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."participant"
    ADD CONSTRAINT "participant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");


--
-- Name: stage stage_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."stage"
    ADD CONSTRAINT "stage_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "public"."tournament"("id");


--
-- Name: stage stage_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."stage"
    ADD CONSTRAINT "stage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");


--
-- Name: tournament tournament_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--

ALTER TABLE ONLY "public"."tournament"
    ADD CONSTRAINT "tournament_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");


--
-- Name: group_participants Enable delete for tournament creator; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable delete for tournament creator" ON "public"."group_participants" FOR DELETE TO "authenticated" USING (("auth"."uid"() IN ( SELECT "tournament"."user_id"
   FROM ("public"."tournament"
     JOIN "public"."group" ON (("tournament"."id" = "group"."tournament_id")))
  WHERE ("group"."id" = "group_participants"."group_id"))));


--
-- Name: match Enable delete for tournament creator; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable delete for tournament creator" ON "public"."match" FOR DELETE TO "authenticated" USING (("auth"."uid"() IN ( SELECT "tournament"."user_id"
   FROM "public"."tournament"
  WHERE ("tournament"."id" = "match"."tournament_id"))));


--
-- Name: group Enable delete for users based on user_id; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable delete for users based on user_id" ON "public"."group" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));


--
-- Name: participant Enable delete for users based on user_id; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable delete for users based on user_id" ON "public"."participant" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));


--
-- Name: stage Enable delete for users based on user_id; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable delete for users based on user_id" ON "public"."stage" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));


--
-- Name: tournament Enable delete for users based on user_id; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable delete for users based on user_id" ON "public"."tournament" FOR DELETE TO "authenticated" USING (("auth"."uid"() = "user_id"));


--
-- Name: tournament Enable insert for authenticated users only; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable insert for authenticated users only" ON "public"."tournament" FOR INSERT TO "authenticated" WITH CHECK (true);


--
-- Name: group Enable insert for tournament creator; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable insert for tournament creator" ON "public"."group" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() IN ( SELECT "tournament"."user_id"
   FROM "public"."tournament"
  WHERE ("tournament"."id" = "group"."tournament_id"))));


--
-- Name: group_participants Enable insert for tournament creator; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable insert for tournament creator" ON "public"."group_participants" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() IN ( SELECT "tournament"."user_id"
   FROM ("public"."tournament"
     JOIN "public"."group" ON (("tournament"."id" = "group"."tournament_id")))
  WHERE ("group"."id" = "group_participants"."group_id"))));


--
-- Name: match Enable insert for tournament creator; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable insert for tournament creator" ON "public"."match" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() IN ( SELECT "tournament"."user_id"
   FROM "public"."tournament"
  WHERE ("tournament"."id" = "match"."tournament_id"))));


--
-- Name: participant Enable insert for tournament creator; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable insert for tournament creator" ON "public"."participant" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() IN ( SELECT "tournament"."user_id"
   FROM "public"."tournament"
  WHERE ("tournament"."id" = "participant"."tournament_id"))));


--
-- Name: stage Enable insert for tournament creator; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable insert for tournament creator" ON "public"."stage" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() IN ( SELECT "tournament"."user_id"
   FROM "public"."tournament"
  WHERE ("tournament"."id" = "stage"."tournament_id"))));


--
-- Name: group Enable read access for all users; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable read access for all users" ON "public"."group" FOR SELECT USING (true);


--
-- Name: group_participants Enable read access for all users; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable read access for all users" ON "public"."group_participants" FOR SELECT USING (true);


--
-- Name: match Enable read access for all users; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable read access for all users" ON "public"."match" FOR SELECT USING (true);


--
-- Name: participant Enable read access for all users; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable read access for all users" ON "public"."participant" FOR SELECT USING (true);


--
-- Name: stage Enable read access for all users; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable read access for all users" ON "public"."stage" FOR SELECT USING (true);


--
-- Name: tournament Enable read access for all users; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable read access for all users" ON "public"."tournament" FOR SELECT USING (true);


--
-- Name: group_participants Enable update for tournament creator; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable update for tournament creator" ON "public"."group_participants" FOR UPDATE TO "authenticated" USING (("auth"."uid"() IN ( SELECT "tournament"."user_id"
   FROM ("public"."tournament"
     JOIN "public"."group" ON (("tournament"."id" = "group"."tournament_id")))
  WHERE ("group"."id" = "group_participants"."group_id")))) WITH CHECK (true);


--
-- Name: match Enable update for tournament creator; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable update for tournament creator" ON "public"."match" FOR UPDATE TO "authenticated" USING (("auth"."uid"() IN ( SELECT "tournament"."user_id"
   FROM "public"."tournament"
  WHERE ("tournament"."id" = "match"."tournament_id")))) WITH CHECK (true);


--
-- Name: tournament Enable update for user that created it; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable update for user that created it" ON "public"."tournament" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));


--
-- Name: group Enable update for users based on user_id; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable update for users based on user_id" ON "public"."group" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));


--
-- Name: participant Enable update for users based on user_id; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable update for users based on user_id" ON "public"."participant" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));


--
-- Name: stage Enable update for users based on user_id; Type: POLICY; Schema: public; Owner: supabase_admin
--

CREATE POLICY "Enable update for users based on user_id" ON "public"."stage" FOR UPDATE TO "authenticated" USING (("auth"."uid"() = "user_id")) WITH CHECK (("auth"."uid"() = "user_id"));


--
-- Name: group; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE "public"."group" ENABLE ROW LEVEL SECURITY;

--
-- Name: group_participants; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE "public"."group_participants" ENABLE ROW LEVEL SECURITY;

--
-- Name: match; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE "public"."match" ENABLE ROW LEVEL SECURITY;

--
-- Name: participant; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE "public"."participant" ENABLE ROW LEVEL SECURITY;

--
-- Name: stage; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE "public"."stage" ENABLE ROW LEVEL SECURITY;

--
-- Name: tournament; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--

ALTER TABLE "public"."tournament" ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA "public"; Type: ACL; Schema: -; Owner: postgres
--

GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";


--
-- Name: FUNCTION "algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."algorithm_sign"("signables" "text", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "armor"("bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."armor"("bytea") TO "dashboard_user";


--
-- Name: FUNCTION "armor"("bytea", "text"[], "text"[]); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."armor"("bytea", "text"[], "text"[]) TO "dashboard_user";


--
-- Name: FUNCTION "crypt"("text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."crypt"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "dearmor"("text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."dearmor"("text") TO "dashboard_user";


--
-- Name: FUNCTION "decrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."decrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "decrypt_iv"("bytea", "bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."decrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "digest"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."digest"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "digest"("text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."digest"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "encrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."encrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "encrypt_iv"("bytea", "bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."encrypt_iv"("bytea", "bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "gen_random_bytes"(integer); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."gen_random_bytes"(integer) TO "dashboard_user";


--
-- Name: FUNCTION "gen_random_uuid"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."gen_random_uuid"() TO "dashboard_user";


--
-- Name: FUNCTION "gen_salt"("text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."gen_salt"("text") TO "dashboard_user";


--
-- Name: FUNCTION "gen_salt"("text", integer); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."gen_salt"("text", integer) TO "dashboard_user";


--
-- Name: FUNCTION "hmac"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."hmac"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "hmac"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."hmac"("text", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pg_stat_statements"("showtext" boolean, OUT "userid" "oid", OUT "dbid" "oid", OUT "toplevel" boolean, OUT "queryid" bigint, OUT "query" "text", OUT "plans" bigint, OUT "total_plan_time" double precision, OUT "min_plan_time" double precision, OUT "max_plan_time" double precision, OUT "mean_plan_time" double precision, OUT "stddev_plan_time" double precision, OUT "calls" bigint, OUT "total_exec_time" double precision, OUT "min_exec_time" double precision, OUT "max_exec_time" double precision, OUT "mean_exec_time" double precision, OUT "stddev_exec_time" double precision, OUT "rows" bigint, OUT "shared_blks_hit" bigint, OUT "shared_blks_read" bigint, OUT "shared_blks_dirtied" bigint, OUT "shared_blks_written" bigint, OUT "local_blks_hit" bigint, OUT "local_blks_read" bigint, OUT "local_blks_dirtied" bigint, OUT "local_blks_written" bigint, OUT "temp_blks_read" bigint, OUT "temp_blks_written" bigint, OUT "blk_read_time" double precision, OUT "blk_write_time" double precision, OUT "wal_records" bigint, OUT "wal_fpi" bigint, OUT "wal_bytes" numeric) TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_info"(OUT "dealloc" bigint, OUT "stats_reset" timestamp with time zone) TO "dashboard_user";


--
-- Name: FUNCTION "pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pg_stat_statements_reset"("userid" "oid", "dbid" "oid", "queryid" bigint) TO "dashboard_user";


--
-- Name: FUNCTION "pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_armor_headers"("text", OUT "key" "text", OUT "value" "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_key_id"("bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_key_id"("bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt"("bytea", "bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt"("bytea", "bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_decrypt_bytea"("bytea", "bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt"("text", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt"("text", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt"("text", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt_bytea"("bytea", "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_pub_encrypt_bytea"("bytea", "bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_pub_encrypt_bytea"("bytea", "bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt_bytea"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_decrypt_bytea"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_decrypt_bytea"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt"("text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt"("text", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt"("text", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt_bytea"("bytea", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text") TO "dashboard_user";


--
-- Name: FUNCTION "pgp_sym_encrypt_bytea"("bytea", "text", "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."pgp_sym_encrypt_bytea"("bytea", "text", "text") TO "dashboard_user";


--
-- Name: FUNCTION "sign"("payload" "json", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."sign"("payload" "json", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: FUNCTION "try_cast_double"("inp" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."try_cast_double"("inp" "text") TO "dashboard_user";


--
-- Name: FUNCTION "url_decode"("data" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."url_decode"("data" "text") TO "dashboard_user";


--
-- Name: FUNCTION "url_encode"("data" "bytea"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."url_encode"("data" "bytea") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v1"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v1mc"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v1mc"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v3"("namespace" "uuid", "name" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v3"("namespace" "uuid", "name" "text") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v4"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v4"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_generate_v5"("namespace" "uuid", "name" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_generate_v5"("namespace" "uuid", "name" "text") TO "dashboard_user";


--
-- Name: FUNCTION "uuid_nil"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_nil"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_dns"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_dns"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_oid"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_oid"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_url"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_url"() TO "dashboard_user";


--
-- Name: FUNCTION "uuid_ns_x500"(); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."uuid_ns_x500"() TO "dashboard_user";


--
-- Name: FUNCTION "verify"("token" "text", "secret" "text", "algorithm" "text"); Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON FUNCTION "extensions"."verify"("token" "text", "secret" "text", "algorithm" "text") TO "dashboard_user";


--
-- Name: TABLE "pg_stat_statements"; Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON TABLE "extensions"."pg_stat_statements" TO "dashboard_user";


--
-- Name: TABLE "pg_stat_statements_info"; Type: ACL; Schema: extensions; Owner: postgres
--

GRANT ALL ON TABLE "extensions"."pg_stat_statements_info" TO "dashboard_user";


--
-- Name: TABLE "group"; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE "public"."group" TO "postgres";
GRANT ALL ON TABLE "public"."group" TO "anon";
GRANT ALL ON TABLE "public"."group" TO "authenticated";
GRANT ALL ON TABLE "public"."group" TO "service_role";


--
-- Name: TABLE "group_participants"; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE "public"."group_participants" TO "postgres";
GRANT ALL ON TABLE "public"."group_participants" TO "anon";
GRANT ALL ON TABLE "public"."group_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."group_participants" TO "service_role";


--
-- Name: TABLE "match"; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE "public"."match" TO "postgres";
GRANT ALL ON TABLE "public"."match" TO "anon";
GRANT ALL ON TABLE "public"."match" TO "authenticated";
GRANT ALL ON TABLE "public"."match" TO "service_role";


--
-- Name: TABLE "participant"; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE "public"."participant" TO "postgres";
GRANT ALL ON TABLE "public"."participant" TO "anon";
GRANT ALL ON TABLE "public"."participant" TO "authenticated";
GRANT ALL ON TABLE "public"."participant" TO "service_role";


--
-- Name: TABLE "stage"; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE "public"."stage" TO "postgres";
GRANT ALL ON TABLE "public"."stage" TO "anon";
GRANT ALL ON TABLE "public"."stage" TO "authenticated";
GRANT ALL ON TABLE "public"."stage" TO "service_role";


--
-- Name: TABLE "tournament"; Type: ACL; Schema: public; Owner: supabase_admin
--

GRANT ALL ON TABLE "public"."tournament" TO "postgres";
GRANT ALL ON TABLE "public"."tournament" TO "anon";
GRANT ALL ON TABLE "public"."tournament" TO "authenticated";
GRANT ALL ON TABLE "public"."tournament" TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON SEQUENCES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON SEQUENCES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON SEQUENCES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON SEQUENCES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON FUNCTIONS  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON FUNCTIONS  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON FUNCTIONS  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON FUNCTIONS  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: graphql; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON TABLES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON TABLES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON TABLES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "graphql" GRANT ALL ON TABLES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
-- ALTER DEFAULT PRIVILEGES FOR ROLE "supabase_admin" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";


--
-- PostgreSQL database dump complete
--

