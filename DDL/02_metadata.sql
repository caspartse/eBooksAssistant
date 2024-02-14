-- ----------------------------
-- Table structure for metadata
-- ----------------------------
DROP TABLE IF EXISTS "public"."metadata";
CREATE TABLE "public"."metadata" (
  "isbn" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "title" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "subtitle" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "original_title" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "author" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "translator" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "producer" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "publisher" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "published" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "pages" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "binding" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "series" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "price" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "description" text COLLATE "pg_catalog"."default" DEFAULT ''::text,
  "cover_url" text COLLATE "pg_catalog"."default" DEFAULT ''::text,
  "douban_sid" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "douban_url" text COLLATE "pg_catalog"."default" DEFAULT ''::text,
  "douban_rating_score" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "_created_at" timestamp(6) DEFAULT now(),
  "_updated_at" timestamp(6) DEFAULT now()
)
;
ALTER TABLE "public"."metadata" OWNER TO "postgres";

-- ----------------------------
-- Triggers structure for table metadata
-- ----------------------------
CREATE TRIGGER "trigger_set_timestamp" BEFORE UPDATE ON "public"."metadata"
FOR EACH ROW
EXECUTE PROCEDURE "public"."trigger_set_timestamp"();

-- ----------------------------
-- Primary Key structure for table metadata
-- ----------------------------
ALTER TABLE "public"."metadata" ADD CONSTRAINT "metadata_pkey" PRIMARY KEY ("isbn");
