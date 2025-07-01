
CREATE TABLE IF NOT EXISTS "public"."existing_loans" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "application_id" bigint NOT NULL,
    "lender_name" character varying(255) NOT NULL,
    "loan_amount" numeric(15, 2) NOT NULL
);

ALTER TABLE "public"."existing_loans" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."existing_loans_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."existing_loans_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."existing_loans_id_seq" OWNED BY "public"."existing_loans"."id";

ALTER TABLE ONLY "public"."existing_loans" ALTER COLUMN "id" SET DEFAULT "nextval"('public.existing_loans_id_seq'::regclass);

ALTER TABLE ONLY "public"."existing_loans"
    ADD CONSTRAINT "existing_loans_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."existing_loans"
    ADD CONSTRAINT "existing_loans_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE CASCADE;

CREATE INDEX "idx_existing_loans_application_id" ON "public"."existing_loans" USING "btree" ("application_id");

ALTER TABLE "public"."existing_loans" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon access to existing_loans" ON "public"."existing_loans" TO "anon" USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage existing_loans" ON "public"."existing_loans" TO "service_role" USING (true) WITH CHECK (true);
