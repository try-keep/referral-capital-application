CREATE TABLE IF NOT EXISTS "public"."bank_statements" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "application_id" bigint,
    "application_upload_id" uuid NOT NULL,
    "file_url" text NOT NULL,
    "file_name" character varying(255) NOT NULL,
    "file_size" bigint,
    "mime_type" character varying(100),
    "uploaded_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."bank_statements" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."bank_statements_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE "public"."bank_statements_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."bank_statements_id_seq" OWNED BY "public"."bank_statements"."id";

ALTER TABLE ONLY "public"."bank_statements" ALTER COLUMN "id" SET DEFAULT "nextval"('public.bank_statements_id_seq'::regclass);

ALTER TABLE ONLY "public"."bank_statements"
    ADD CONSTRAINT "bank_statements_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."bank_statements"
    ADD CONSTRAINT "bank_statements_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE CASCADE;

CREATE INDEX "idx_bank_statements_application_id" ON "public"."bank_statements" USING "btree" ("application_id");

CREATE INDEX "idx_bank_statements_application_upload_id" ON "public"."bank_statements" USING "btree" ("application_upload_id");

ALTER TABLE "public"."bank_statements" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon access to bank_statements" ON "public"."bank_statements" TO "anon" USING (true) WITH CHECK (true);
CREATE POLICY "Service role can manage bank_statements" ON "public"."bank_statements" TO "service_role" USING (true) WITH CHECK (true);
