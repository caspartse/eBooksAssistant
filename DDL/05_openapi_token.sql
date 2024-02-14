-- ----------------------------
-- Table structure for openapi_token
-- ----------------------------
DROP TABLE IF EXISTS "public"."openapi_token" CASCADE;
CREATE TABLE "public"."openapi_token" (
  "api_key" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "user_id" varchar(255) COLLATE "pg_catalog"."default",
  "jwt_token" text COLLATE "pg_catalog"."default",
  "iat" timestamptz(6),
  "exp" timestamptz(6),
  "is_valid" bool DEFAULT true,
  "_created_at" timestamp(6) DEFAULT now(),
  "_updated_at" timestamp(6)
)
;
ALTER TABLE "public"."openapi_token" OWNER TO "postgres";

-- ----------------------------
-- Triggers structure for table openapi_token
-- ----------------------------
CREATE TRIGGER "trigger_set_timestamp" BEFORE UPDATE ON "public"."openapi_token"
FOR EACH ROW
EXECUTE PROCEDURE "public"."trigger_set_timestamp"();

-- ----------------------------
-- Primary Key structure for table openapi_token
-- ----------------------------
ALTER TABLE "public"."openapi_token" ADD CONSTRAINT "openapi_token_pkey" PRIMARY KEY ("api_key");

-- ----------------------------
-- Foreign Keys structure for table openapi_token
-- ----------------------------
ALTER TABLE "public"."openapi_token" ADD CONSTRAINT "fk_openapi_token_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."openapi_user" ("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
