-- ----------------------------
-- Table structure for market
-- ----------------------------
DROP TABLE IF EXISTS "public"."market";
CREATE TABLE "public"."market" (
  "department" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "isbn" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "vendor" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "vbookid" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "url" text COLLATE "pg_catalog"."default" NOT NULL,
  "display_isbn" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "display_title" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "display_author" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "display_translator" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "description" text COLLATE "pg_catalog"."default" DEFAULT ''::text,
  "price" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "anchor" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "relevance" float4,
  "weight" float4,
  "update_time" timestamp(6),
  "_created_at" timestamp(6) DEFAULT now(),
  "_updated_at" timestamp(6) DEFAULT now()
)
;
ALTER TABLE "public"."market" OWNER TO "postgres";

-- ----------------------------
-- Indexes structure for table market
-- ----------------------------
CREATE INDEX "idx_market_vbookid" ON "public"."market" USING btree (
  "vbookid" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Triggers structure for table market
-- ----------------------------
CREATE TRIGGER "trigger_set_timestamp" BEFORE UPDATE ON "public"."market"
FOR EACH ROW
EXECUTE PROCEDURE "public"."trigger_set_timestamp"();

-- ----------------------------
-- Primary Key structure for table market
-- ----------------------------
ALTER TABLE "public"."market" ADD CONSTRAINT "market_pkey" PRIMARY KEY ("isbn", "vendor");
