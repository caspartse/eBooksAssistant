-- ----------------------------
-- Table structure for openapi_log
-- ----------------------------
DROP TABLE IF EXISTS "public"."openapi_log";
CREATE TABLE "public"."openapi_log" (
  "api_key" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "ip" varchar(255) COLLATE "pg_catalog"."default",
  "receive_time" timestamp(6) DEFAULT now(),
  "request_id" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "request_url" text COLLATE "pg_catalog"."default",
  "request_headers" text COLLATE "pg_catalog"."default",
  "status_code" int2,
  "result" text COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."openapi_log" OWNER TO "postgres";

-- ----------------------------
-- Indexes structure for table openapi_log
-- ----------------------------
CREATE INDEX "idx_openapi_log_api_key" ON "public"."openapi_log" USING btree (
  "api_key" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE INDEX "idx_openapi_log_receive_time" ON "public"."openapi_log" USING btree (
  "receive_time" "pg_catalog"."timestamp_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table openapi_log
-- ----------------------------
ALTER TABLE "public"."openapi_log" ADD CONSTRAINT "openapi_request_log_pkey" PRIMARY KEY ("request_id");

-- ----------------------------
-- Foreign Keys structure for table openapi_log
-- ----------------------------
ALTER TABLE "public"."openapi_log" ADD CONSTRAINT "fk_openapi_log_api_key" FOREIGN KEY ("api_key") REFERENCES "public"."openapi_token" ("api_key") ON DELETE CASCADE ON UPDATE NO ACTION;
