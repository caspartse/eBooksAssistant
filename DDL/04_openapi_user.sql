-- ----------------------------
-- Table structure for openapi_user
-- ----------------------------
DROP TABLE IF EXISTS "public"."openapi_user" CASCADE;
CREATE TABLE "public"."openapi_user" (
  "user_id" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "api_key" varchar(255) COLLATE "pg_catalog"."default",
  "quota" int4 DEFAULT 1000,
  "credit" int4,
  "usage" int4 DEFAULT 0,
  "is_blocked" bool DEFAULT false,
  "is_premium" bool DEFAULT false,
  "_created_at" timestamp(6) DEFAULT now(),
  "_updated_at" timestamp(6)
)
;
ALTER TABLE "public"."openapi_user" OWNER TO "postgres";

-- ----------------------------
-- Triggers structure for table openapi_user
-- ----------------------------
CREATE TRIGGER "trigger_set_timestamp" BEFORE UPDATE ON "public"."openapi_user"
FOR EACH ROW
EXECUTE PROCEDURE "public"."trigger_set_timestamp"();

-- ----------------------------
-- Primary Key structure for table openapi_user
-- ----------------------------
ALTER TABLE "public"."openapi_user" ADD CONSTRAINT "openapi_user_pkey" PRIMARY KEY ("user_id");
