

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


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE SCHEMA IF NOT EXISTS "snowflake";


ALTER SCHEMA "snowflake" OWNER TO "postgres";


CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "wrappers" WITH SCHEMA "public";






CREATE OR REPLACE FUNCTION "public"."compute_business_derived_fields"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Compute business age category from incorporation date
  IF NEW.date_incorporated IS NOT NULL THEN
    CASE
      WHEN EXTRACT(YEAR FROM AGE(NEW.date_incorporated)) < 1 THEN
        NEW.business_age_category := 'under-1-year';
      WHEN EXTRACT(YEAR FROM AGE(NEW.date_incorporated)) <= 2 THEN
        NEW.business_age_category := '1-2-years';
      WHEN EXTRACT(YEAR FROM AGE(NEW.date_incorporated)) <= 5 THEN
        NEW.business_age_category := '2-5-years';
      WHEN EXTRACT(YEAR FROM AGE(NEW.date_incorporated)) <= 10 THEN
        NEW.business_age_category := '5-10-years';
      ELSE
        NEW.business_age_category := 'over-10-years';
    END CASE;
  END IF;

  -- Map entity type to our business type options
  IF NEW.entity_type IS NOT NULL THEN
    CASE
      WHEN LOWER(NEW.entity_type) LIKE '%restaurant%' OR LOWER(NEW.entity_type) LIKE '%food%' THEN
        NEW.estimated_business_type := 'restaurant';
      WHEN LOWER(NEW.entity_type) LIKE '%retail%' THEN
        NEW.estimated_business_type := 'retail';
      WHEN LOWER(NEW.entity_type) LIKE '%construction%' THEN
        NEW.estimated_business_type := 'construction';
      WHEN LOWER(NEW.entity_type) LIKE '%health%' THEN
        NEW.estimated_business_type := 'healthcare';
      WHEN LOWER(NEW.entity_type) LIKE '%tech%' OR LOWER(NEW.entity_type) LIKE '%software%' THEN
        NEW.estimated_business_type := 'technology';
      WHEN LOWER(NEW.entity_type) LIKE '%manufact%' THEN
        NEW.estimated_business_type := 'manufacturing';
      WHEN LOWER(NEW.entity_type) LIKE '%transport%' THEN
        NEW.estimated_business_type := 'transportation';
      WHEN LOWER(NEW.entity_type) LIKE '%real estate%' THEN
        NEW.estimated_business_type := 'real-estate';
      ELSE
        NEW.estimated_business_type := 'professional-services';
    END CASE;
  END IF;

  -- Set updated timestamp
  NEW.updated_at := NOW();

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."compute_business_derived_fields"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."create_form_data_table"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS form_data (
    id SERIAL PRIMARY KEY,
    full_name TEXT,
    phone TEXT,
    business_name TEXT,
    ssn TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
END;
$$;


ALTER FUNCTION "public"."create_form_data_table"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."applications" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "loan_type" character varying(50) NOT NULL,
    "is_business_owner" character varying(10) NOT NULL,
    "monthly_sales" character varying(50) NOT NULL,
    "has_existing_loans" character varying(10) NOT NULL,
    "total_loan_amount" character varying(50),
    "business_name" character varying(255) NOT NULL,
    "business_search_verified" character varying(50),
    "bank_connected" character varying(50),
    "bank_connection_method" character varying(100),
    "first_name" character varying(100) NOT NULL,
    "last_name" character varying(100) NOT NULL,
    "email" character varying(255) NOT NULL,
    "phone" character varying(50) NOT NULL,
    "title" character varying(100) NOT NULL,
    "ssn_last_4" character varying(4) NOT NULL,
    "funding_amount" character varying(50) NOT NULL,
    "funding_timeline" character varying(50) NOT NULL,
    "funding_purpose" character varying(50) NOT NULL,
    "business_type" character varying(50) NOT NULL,
    "business_age" character varying(50) NOT NULL,
    "number_of_employees" character varying(50) NOT NULL,
    "annual_revenue" character varying(50) NOT NULL,
    "cash_flow" character varying(50) NOT NULL,
    "credit_score" character varying(50) NOT NULL,
    "time_in_business" character varying(100) NOT NULL,
    "bank_connection_completed" boolean DEFAULT false,
    "skipped_bank_connection" boolean DEFAULT false,
    "business_address" "text" NOT NULL,
    "business_phone" character varying(50) NOT NULL,
    "website_url" character varying(500),
    "additional_info" "text",
    "agrees_to_terms" boolean DEFAULT false NOT NULL,
    "authorizes_credit_check" boolean DEFAULT false NOT NULL,
    "status" character varying(50) DEFAULT 'submitted'::character varying,
    "submitted_at" timestamp with time zone DEFAULT "now"(),
    "business_id" bigint,
    "ip_address" "text",
    "user_id" "uuid",
    "date_of_birth" "date"
);


ALTER TABLE "public"."applications" OWNER TO "postgres";


COMMENT ON COLUMN "public"."applications"."ip_address" IS 'IP address of the user when they submitted the application for audit and compliance purposes';



CREATE SEQUENCE IF NOT EXISTS "public"."applications_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."applications_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."applications_id_seq" OWNED BY "public"."applications"."id";



CREATE TABLE IF NOT EXISTS "public"."businesses" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "mras_id" character varying(50) NOT NULL,
    "company_name" character varying(500) NOT NULL,
    "business_number" character varying(20),
    "juri_id" character varying(50),
    "registry_source" character varying(10),
    "jurisdiction" character varying(10),
    "reg_office_city" character varying(200),
    "city" character varying(200),
    "reg_office_province" character varying(100),
    "status_state" character varying(50),
    "status_date" "date",
    "status_notes" "text",
    "date_incorporated" "date",
    "display_date" "date",
    "entity_type" character varying(200),
    "mras_entity_type" character varying(20),
    "alternate_names" "text"[],
    "text_fields" "text"[],
    "score" numeric(10,6),
    "hierarchy" character varying(50),
    "data_source" character varying(50),
    "version_number" bigint,
    "business_age_category" character varying(50),
    "estimated_business_type" character varying(50),
    "raw_registry_data" "jsonb",
    "search_query" character varying(500),
    "times_selected" integer DEFAULT 0,
    "last_selected_at" timestamp with time zone
);


ALTER TABLE "public"."businesses" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."businesses_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."businesses_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."businesses_id_seq" OWNED BY "public"."businesses"."id";



CREATE TABLE IF NOT EXISTS "public"."compliance_checks" (
    "id" integer NOT NULL,
    "application_id" integer,
    "check_type" character varying(50) NOT NULL,
    "status" character varying(20) DEFAULT 'pending'::character varying,
    "risk_score" numeric(3,2),
    "results" "jsonb",
    "input_data" "jsonb",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "completed_at" timestamp without time zone,
    "error_message" "text"
);


ALTER TABLE "public"."compliance_checks" OWNER TO "postgres";


COMMENT ON TABLE "public"."compliance_checks" IS 'Stores compliance check results for applications';



COMMENT ON COLUMN "public"."compliance_checks"."check_type" IS 'Type of compliance check performed';



COMMENT ON COLUMN "public"."compliance_checks"."risk_score" IS 'Risk score from 0.00 (low risk) to 1.00 (high risk)';



COMMENT ON COLUMN "public"."compliance_checks"."results" IS 'JSON object containing check results';



COMMENT ON COLUMN "public"."compliance_checks"."input_data" IS 'JSON object containing input parameters used for the check';



CREATE SEQUENCE IF NOT EXISTS "public"."compliance_checks_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."compliance_checks_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."compliance_checks_id_seq" OWNED BY "public"."compliance_checks"."id";



CREATE TABLE IF NOT EXISTS "public"."form_data" (
    "id" integer NOT NULL,
    "full_name" "text",
    "phone" "text",
    "business_name" "text",
    "ssn" "text",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."form_data" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."form_data_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE "public"."form_data_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."form_data_id_seq" OWNED BY "public"."form_data"."id";



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "first_name" character varying(100) NOT NULL,
    "last_name" character varying(100) NOT NULL,
    "email" character varying(255) NOT NULL,
    "phone" character varying(20),
    "role_in_business" character varying(100),
    "ownership_percentage" integer,
    "address_line1" character varying(255),
    "address_line2" character varying(255),
    "city" character varying(100),
    "province" character varying(100),
    "postal_code" character varying(20),
    "source" character varying(100),
    "utm_campaign" character varying(255),
    "utm_source" character varying(255),
    "utm_medium" character varying(255),
    "utm_content" character varying(255),
    "email_marketing_consent" boolean DEFAULT false,
    "sms_marketing_consent" boolean DEFAULT false,
    "status" character varying(50) DEFAULT 'active'::character varying,
    "ip_address" "inet",
    "user_agent" "text",
    CONSTRAINT "users_status_check" CHECK ((("status")::"text" = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'unsubscribed'::character varying])::"text"[]))),
    CONSTRAINT "valid_email" CHECK ((("email")::"text" ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'::"text"))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON TABLE "public"."users" IS 'Users table for referral campaign management (no authentication)';



COMMENT ON COLUMN "public"."users"."source" IS 'Source of user acquisition (e.g., referral_application, direct, campaign)';



COMMENT ON COLUMN "public"."users"."email_marketing_consent" IS 'User consent for email marketing campaigns';



COMMENT ON COLUMN "public"."users"."sms_marketing_consent" IS 'User consent for SMS marketing campaigns';



ALTER TABLE ONLY "public"."applications" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."applications_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."businesses" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."businesses_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."compliance_checks" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."compliance_checks_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."form_data" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."form_data_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."applications"
    ADD CONSTRAINT "applications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."businesses"
    ADD CONSTRAINT "businesses_mras_id_key" UNIQUE ("mras_id");



ALTER TABLE ONLY "public"."businesses"
    ADD CONSTRAINT "businesses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."compliance_checks"
    ADD CONSTRAINT "compliance_checks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."form_data"
    ADD CONSTRAINT "form_data_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_applications_business_id" ON "public"."applications" USING "btree" ("business_id");



CREATE INDEX "idx_applications_business_name" ON "public"."applications" USING "btree" ("business_name");



CREATE INDEX "idx_applications_email" ON "public"."applications" USING "btree" ("email");



CREATE INDEX "idx_applications_status" ON "public"."applications" USING "btree" ("status");



CREATE INDEX "idx_applications_submitted_at" ON "public"."applications" USING "btree" ("submitted_at");



CREATE INDEX "idx_applications_user_id" ON "public"."applications" USING "btree" ("user_id");



CREATE INDEX "idx_businesses_business_number" ON "public"."businesses" USING "btree" ("business_number");



CREATE INDEX "idx_businesses_company_name" ON "public"."businesses" USING "btree" ("company_name");



CREATE INDEX "idx_businesses_company_name_fulltext" ON "public"."businesses" USING "gin" ("to_tsvector"('"english"'::"regconfig", ("company_name")::"text"));



CREATE INDEX "idx_businesses_jurisdiction" ON "public"."businesses" USING "btree" ("jurisdiction");



CREATE INDEX "idx_businesses_mras_id" ON "public"."businesses" USING "btree" ("mras_id");



CREATE INDEX "idx_businesses_search_query" ON "public"."businesses" USING "btree" ("search_query");



CREATE INDEX "idx_businesses_status_state" ON "public"."businesses" USING "btree" ("status_state");



CREATE INDEX "idx_compliance_checks_application_id" ON "public"."compliance_checks" USING "btree" ("application_id");



CREATE INDEX "idx_compliance_checks_status" ON "public"."compliance_checks" USING "btree" ("status");



CREATE INDEX "idx_compliance_checks_type" ON "public"."compliance_checks" USING "btree" ("check_type");



CREATE INDEX "idx_users_created_at" ON "public"."users" USING "btree" ("created_at");



CREATE INDEX "idx_users_email" ON "public"."users" USING "btree" ("email");



CREATE INDEX "idx_users_source" ON "public"."users" USING "btree" ("source");



CREATE INDEX "idx_users_status" ON "public"."users" USING "btree" ("status");



CREATE OR REPLACE TRIGGER "Zapier" AFTER INSERT ON "public"."applications" FOR EACH ROW EXECUTE FUNCTION "supabase_functions"."http_request"('https://hooks.zapier.com/hooks/catch/19644002/uo5k8fe/', 'POST', '{"Content-type":"application/json"}', '{}', '5000');



CREATE OR REPLACE TRIGGER "trigger_compute_business_derived_fields" BEFORE INSERT OR UPDATE ON "public"."businesses" FOR EACH ROW EXECUTE FUNCTION "public"."compute_business_derived_fields"();



CREATE OR REPLACE TRIGGER "update_users_updated_at" BEFORE UPDATE ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."applications"
    ADD CONSTRAINT "applications_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id");



ALTER TABLE ONLY "public"."applications"
    ADD CONSTRAINT "applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL;



CREATE POLICY "Allow anon access to applications" ON "public"."applications" TO "anon" USING (true) WITH CHECK (true);



CREATE POLICY "Allow anon access to users" ON "public"."users" TO "anon" USING (true) WITH CHECK (true);



CREATE POLICY "Anyone can insert applications" ON "public"."applications" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can insert businesses" ON "public"."businesses" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can read applications" ON "public"."applications" FOR SELECT USING (true);



CREATE POLICY "Anyone can read businesses" ON "public"."businesses" FOR SELECT USING (true);



CREATE POLICY "Anyone can update businesses" ON "public"."businesses" FOR UPDATE USING (true) WITH CHECK (true);



CREATE POLICY "Service role can manage applications" ON "public"."applications" TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Service role can manage users" ON "public"."users" TO "service_role" USING (true) WITH CHECK (true);



ALTER TABLE "public"."applications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."businesses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."airtable_fdw_handler"() TO "postgres";
GRANT ALL ON FUNCTION "public"."airtable_fdw_handler"() TO "anon";
GRANT ALL ON FUNCTION "public"."airtable_fdw_handler"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."airtable_fdw_handler"() TO "service_role";



GRANT ALL ON FUNCTION "public"."airtable_fdw_meta"() TO "postgres";
GRANT ALL ON FUNCTION "public"."airtable_fdw_meta"() TO "anon";
GRANT ALL ON FUNCTION "public"."airtable_fdw_meta"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."airtable_fdw_meta"() TO "service_role";



GRANT ALL ON FUNCTION "public"."airtable_fdw_validator"("options" "text"[], "catalog" "oid") TO "postgres";
GRANT ALL ON FUNCTION "public"."airtable_fdw_validator"("options" "text"[], "catalog" "oid") TO "anon";
GRANT ALL ON FUNCTION "public"."airtable_fdw_validator"("options" "text"[], "catalog" "oid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."airtable_fdw_validator"("options" "text"[], "catalog" "oid") TO "service_role";



GRANT ALL ON FUNCTION "public"."auth0_fdw_handler"() TO "postgres";
GRANT ALL ON FUNCTION "public"."auth0_fdw_handler"() TO "anon";
GRANT ALL ON FUNCTION "public"."auth0_fdw_handler"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auth0_fdw_handler"() TO "service_role";



GRANT ALL ON FUNCTION "public"."auth0_fdw_meta"() TO "postgres";
GRANT ALL ON FUNCTION "public"."auth0_fdw_meta"() TO "anon";
GRANT ALL ON FUNCTION "public"."auth0_fdw_meta"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."auth0_fdw_meta"() TO "service_role";



GRANT ALL ON FUNCTION "public"."auth0_fdw_validator"("options" "text"[], "catalog" "oid") TO "postgres";
GRANT ALL ON FUNCTION "public"."auth0_fdw_validator"("options" "text"[], "catalog" "oid") TO "anon";
GRANT ALL ON FUNCTION "public"."auth0_fdw_validator"("options" "text"[], "catalog" "oid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."auth0_fdw_validator"("options" "text"[], "catalog" "oid") TO "service_role";



GRANT ALL ON FUNCTION "public"."big_query_fdw_handler"() TO "postgres";
GRANT ALL ON FUNCTION "public"."big_query_fdw_handler"() TO "anon";
GRANT ALL ON FUNCTION "public"."big_query_fdw_handler"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."big_query_fdw_handler"() TO "service_role";



GRANT ALL ON FUNCTION "public"."big_query_fdw_meta"() TO "postgres";
GRANT ALL ON FUNCTION "public"."big_query_fdw_meta"() TO "anon";
GRANT ALL ON FUNCTION "public"."big_query_fdw_meta"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."big_query_fdw_meta"() TO "service_role";



GRANT ALL ON FUNCTION "public"."big_query_fdw_validator"("options" "text"[], "catalog" "oid") TO "postgres";
GRANT ALL ON FUNCTION "public"."big_query_fdw_validator"("options" "text"[], "catalog" "oid") TO "anon";
GRANT ALL ON FUNCTION "public"."big_query_fdw_validator"("options" "text"[], "catalog" "oid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."big_query_fdw_validator"("options" "text"[], "catalog" "oid") TO "service_role";



GRANT ALL ON FUNCTION "public"."click_house_fdw_handler"() TO "postgres";
GRANT ALL ON FUNCTION "public"."click_house_fdw_handler"() TO "anon";
GRANT ALL ON FUNCTION "public"."click_house_fdw_handler"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."click_house_fdw_handler"() TO "service_role";



GRANT ALL ON FUNCTION "public"."click_house_fdw_meta"() TO "postgres";
GRANT ALL ON FUNCTION "public"."click_house_fdw_meta"() TO "anon";
GRANT ALL ON FUNCTION "public"."click_house_fdw_meta"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."click_house_fdw_meta"() TO "service_role";



GRANT ALL ON FUNCTION "public"."click_house_fdw_validator"("options" "text"[], "catalog" "oid") TO "postgres";
GRANT ALL ON FUNCTION "public"."click_house_fdw_validator"("options" "text"[], "catalog" "oid") TO "anon";
GRANT ALL ON FUNCTION "public"."click_house_fdw_validator"("options" "text"[], "catalog" "oid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."click_house_fdw_validator"("options" "text"[], "catalog" "oid") TO "service_role";



GRANT ALL ON FUNCTION "public"."cognito_fdw_handler"() TO "postgres";
GRANT ALL ON FUNCTION "public"."cognito_fdw_handler"() TO "anon";
GRANT ALL ON FUNCTION "public"."cognito_fdw_handler"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cognito_fdw_handler"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cognito_fdw_meta"() TO "postgres";
GRANT ALL ON FUNCTION "public"."cognito_fdw_meta"() TO "anon";
GRANT ALL ON FUNCTION "public"."cognito_fdw_meta"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."cognito_fdw_meta"() TO "service_role";



GRANT ALL ON FUNCTION "public"."cognito_fdw_validator"("options" "text"[], "catalog" "oid") TO "postgres";
GRANT ALL ON FUNCTION "public"."cognito_fdw_validator"("options" "text"[], "catalog" "oid") TO "anon";
GRANT ALL ON FUNCTION "public"."cognito_fdw_validator"("options" "text"[], "catalog" "oid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."cognito_fdw_validator"("options" "text"[], "catalog" "oid") TO "service_role";



GRANT ALL ON FUNCTION "public"."compute_business_derived_fields"() TO "anon";
GRANT ALL ON FUNCTION "public"."compute_business_derived_fields"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."compute_business_derived_fields"() TO "service_role";



GRANT ALL ON FUNCTION "public"."create_form_data_table"() TO "anon";
GRANT ALL ON FUNCTION "public"."create_form_data_table"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."create_form_data_table"() TO "service_role";



GRANT ALL ON FUNCTION "public"."firebase_fdw_handler"() TO "postgres";
GRANT ALL ON FUNCTION "public"."firebase_fdw_handler"() TO "anon";
GRANT ALL ON FUNCTION "public"."firebase_fdw_handler"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."firebase_fdw_handler"() TO "service_role";



GRANT ALL ON FUNCTION "public"."firebase_fdw_meta"() TO "postgres";
GRANT ALL ON FUNCTION "public"."firebase_fdw_meta"() TO "anon";
GRANT ALL ON FUNCTION "public"."firebase_fdw_meta"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."firebase_fdw_meta"() TO "service_role";



GRANT ALL ON FUNCTION "public"."firebase_fdw_validator"("options" "text"[], "catalog" "oid") TO "postgres";
GRANT ALL ON FUNCTION "public"."firebase_fdw_validator"("options" "text"[], "catalog" "oid") TO "anon";
GRANT ALL ON FUNCTION "public"."firebase_fdw_validator"("options" "text"[], "catalog" "oid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."firebase_fdw_validator"("options" "text"[], "catalog" "oid") TO "service_role";



GRANT ALL ON FUNCTION "public"."hello_world_fdw_handler"() TO "postgres";
GRANT ALL ON FUNCTION "public"."hello_world_fdw_handler"() TO "anon";
GRANT ALL ON FUNCTION "public"."hello_world_fdw_handler"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."hello_world_fdw_handler"() TO "service_role";



GRANT ALL ON FUNCTION "public"."hello_world_fdw_meta"() TO "postgres";
GRANT ALL ON FUNCTION "public"."hello_world_fdw_meta"() TO "anon";
GRANT ALL ON FUNCTION "public"."hello_world_fdw_meta"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."hello_world_fdw_meta"() TO "service_role";



GRANT ALL ON FUNCTION "public"."hello_world_fdw_validator"("options" "text"[], "catalog" "oid") TO "postgres";
GRANT ALL ON FUNCTION "public"."hello_world_fdw_validator"("options" "text"[], "catalog" "oid") TO "anon";
GRANT ALL ON FUNCTION "public"."hello_world_fdw_validator"("options" "text"[], "catalog" "oid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."hello_world_fdw_validator"("options" "text"[], "catalog" "oid") TO "service_role";



GRANT ALL ON FUNCTION "public"."logflare_fdw_handler"() TO "postgres";
GRANT ALL ON FUNCTION "public"."logflare_fdw_handler"() TO "anon";
GRANT ALL ON FUNCTION "public"."logflare_fdw_handler"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."logflare_fdw_handler"() TO "service_role";



GRANT ALL ON FUNCTION "public"."logflare_fdw_meta"() TO "postgres";
GRANT ALL ON FUNCTION "public"."logflare_fdw_meta"() TO "anon";
GRANT ALL ON FUNCTION "public"."logflare_fdw_meta"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."logflare_fdw_meta"() TO "service_role";



GRANT ALL ON FUNCTION "public"."logflare_fdw_validator"("options" "text"[], "catalog" "oid") TO "postgres";
GRANT ALL ON FUNCTION "public"."logflare_fdw_validator"("options" "text"[], "catalog" "oid") TO "anon";
GRANT ALL ON FUNCTION "public"."logflare_fdw_validator"("options" "text"[], "catalog" "oid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."logflare_fdw_validator"("options" "text"[], "catalog" "oid") TO "service_role";



GRANT ALL ON FUNCTION "public"."mssql_fdw_handler"() TO "postgres";
GRANT ALL ON FUNCTION "public"."mssql_fdw_handler"() TO "anon";
GRANT ALL ON FUNCTION "public"."mssql_fdw_handler"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."mssql_fdw_handler"() TO "service_role";



GRANT ALL ON FUNCTION "public"."mssql_fdw_meta"() TO "postgres";
GRANT ALL ON FUNCTION "public"."mssql_fdw_meta"() TO "anon";
GRANT ALL ON FUNCTION "public"."mssql_fdw_meta"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."mssql_fdw_meta"() TO "service_role";



GRANT ALL ON FUNCTION "public"."mssql_fdw_validator"("options" "text"[], "catalog" "oid") TO "postgres";
GRANT ALL ON FUNCTION "public"."mssql_fdw_validator"("options" "text"[], "catalog" "oid") TO "anon";
GRANT ALL ON FUNCTION "public"."mssql_fdw_validator"("options" "text"[], "catalog" "oid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."mssql_fdw_validator"("options" "text"[], "catalog" "oid") TO "service_role";



GRANT ALL ON FUNCTION "public"."redis_fdw_handler"() TO "postgres";
GRANT ALL ON FUNCTION "public"."redis_fdw_handler"() TO "anon";
GRANT ALL ON FUNCTION "public"."redis_fdw_handler"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."redis_fdw_handler"() TO "service_role";



GRANT ALL ON FUNCTION "public"."redis_fdw_meta"() TO "postgres";
GRANT ALL ON FUNCTION "public"."redis_fdw_meta"() TO "anon";
GRANT ALL ON FUNCTION "public"."redis_fdw_meta"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."redis_fdw_meta"() TO "service_role";



GRANT ALL ON FUNCTION "public"."redis_fdw_validator"("options" "text"[], "catalog" "oid") TO "postgres";
GRANT ALL ON FUNCTION "public"."redis_fdw_validator"("options" "text"[], "catalog" "oid") TO "anon";
GRANT ALL ON FUNCTION "public"."redis_fdw_validator"("options" "text"[], "catalog" "oid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."redis_fdw_validator"("options" "text"[], "catalog" "oid") TO "service_role";



GRANT ALL ON FUNCTION "public"."s3_fdw_handler"() TO "postgres";
GRANT ALL ON FUNCTION "public"."s3_fdw_handler"() TO "anon";
GRANT ALL ON FUNCTION "public"."s3_fdw_handler"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."s3_fdw_handler"() TO "service_role";



GRANT ALL ON FUNCTION "public"."s3_fdw_meta"() TO "postgres";
GRANT ALL ON FUNCTION "public"."s3_fdw_meta"() TO "anon";
GRANT ALL ON FUNCTION "public"."s3_fdw_meta"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."s3_fdw_meta"() TO "service_role";



GRANT ALL ON FUNCTION "public"."s3_fdw_validator"("options" "text"[], "catalog" "oid") TO "postgres";
GRANT ALL ON FUNCTION "public"."s3_fdw_validator"("options" "text"[], "catalog" "oid") TO "anon";
GRANT ALL ON FUNCTION "public"."s3_fdw_validator"("options" "text"[], "catalog" "oid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."s3_fdw_validator"("options" "text"[], "catalog" "oid") TO "service_role";



GRANT ALL ON FUNCTION "public"."stripe_fdw_handler"() TO "postgres";
GRANT ALL ON FUNCTION "public"."stripe_fdw_handler"() TO "anon";
GRANT ALL ON FUNCTION "public"."stripe_fdw_handler"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."stripe_fdw_handler"() TO "service_role";



GRANT ALL ON FUNCTION "public"."stripe_fdw_meta"() TO "postgres";
GRANT ALL ON FUNCTION "public"."stripe_fdw_meta"() TO "anon";
GRANT ALL ON FUNCTION "public"."stripe_fdw_meta"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."stripe_fdw_meta"() TO "service_role";



GRANT ALL ON FUNCTION "public"."stripe_fdw_validator"("options" "text"[], "catalog" "oid") TO "postgres";
GRANT ALL ON FUNCTION "public"."stripe_fdw_validator"("options" "text"[], "catalog" "oid") TO "anon";
GRANT ALL ON FUNCTION "public"."stripe_fdw_validator"("options" "text"[], "catalog" "oid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."stripe_fdw_validator"("options" "text"[], "catalog" "oid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."wasm_fdw_handler"() TO "postgres";
GRANT ALL ON FUNCTION "public"."wasm_fdw_handler"() TO "anon";
GRANT ALL ON FUNCTION "public"."wasm_fdw_handler"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."wasm_fdw_handler"() TO "service_role";



GRANT ALL ON FUNCTION "public"."wasm_fdw_meta"() TO "postgres";
GRANT ALL ON FUNCTION "public"."wasm_fdw_meta"() TO "anon";
GRANT ALL ON FUNCTION "public"."wasm_fdw_meta"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."wasm_fdw_meta"() TO "service_role";



GRANT ALL ON FUNCTION "public"."wasm_fdw_validator"("options" "text"[], "catalog" "oid") TO "postgres";
GRANT ALL ON FUNCTION "public"."wasm_fdw_validator"("options" "text"[], "catalog" "oid") TO "anon";
GRANT ALL ON FUNCTION "public"."wasm_fdw_validator"("options" "text"[], "catalog" "oid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."wasm_fdw_validator"("options" "text"[], "catalog" "oid") TO "service_role";



























GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."applications" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."applications" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."applications" TO "service_role";



GRANT ALL ON SEQUENCE "public"."applications_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."applications_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."applications_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."businesses" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."businesses" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."businesses" TO "service_role";



GRANT ALL ON SEQUENCE "public"."businesses_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."businesses_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."businesses_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."compliance_checks" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."compliance_checks" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."compliance_checks" TO "service_role";



GRANT ALL ON SEQUENCE "public"."compliance_checks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."compliance_checks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."compliance_checks_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."form_data" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."form_data" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."form_data" TO "service_role";



GRANT ALL ON SEQUENCE "public"."form_data_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."form_data_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."form_data_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."users" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."users" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."users" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."wrappers_fdw_stats" TO "postgres";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."wrappers_fdw_stats" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."wrappers_fdw_stats" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."wrappers_fdw_stats" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "service_role";






























RESET ALL;
