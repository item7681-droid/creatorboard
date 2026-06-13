CREATE TABLE "diagnoses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"session_id" text NOT NULL,
	"reason" text NOT NULL,
	"expected_result" text NOT NULL,
	"known_field" text NOT NULL,
	"interest_topic" text NOT NULL,
	"face_preference" text NOT NULL,
	"available_time" text NOT NULL,
	"avoid_topic" text,
	"shooting_burden" integer NOT NULL,
	"recommended_keywords" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generation_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"diagnosis_id" uuid NOT NULL,
	"session_id" text NOT NULL,
	"recommended_keywords" jsonb NOT NULL,
	"template_type" text DEFAULT 'profit' NOT NULL,
	"status" text DEFAULT 'started' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"generation_session_id" uuid NOT NULL,
	"search_summary" text NOT NULL,
	"final_title" text NOT NULL,
	"final_thumbnail_text" text NOT NULL,
	"title_candidates" jsonb NOT NULL,
	"thumbnail_candidates" jsonb NOT NULL,
	"video_outline" jsonb NOT NULL,
	"seven_day_plan" jsonb NOT NULL,
	"memo" text,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "selected_videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"generation_session_id" uuid NOT NULL,
	"video_cache_id" uuid NOT NULL,
	"rank" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "selected_videos_rank_check" CHECK ("selected_videos"."rank" between 1 and 3)
);
--> statement-breakpoint
CREATE TABLE "usage_limits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"session_id" text,
	"date_key" text NOT NULL,
	"generation_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"google_id" text NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"avatar_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "video_cache" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"keyword" text NOT NULL,
	"youtube_video_id" text NOT NULL,
	"title" text NOT NULL,
	"thumbnail_url" text NOT NULL,
	"thumbnail_text" text,
	"channel_title" text NOT NULL,
	"view_count" integer DEFAULT 0 NOT NULL,
	"like_count" integer DEFAULT 0 NOT NULL,
	"comment_count" integer DEFAULT 0 NOT NULL,
	"published_at" timestamp with time zone,
	"duration_seconds" integer DEFAULT 0 NOT NULL,
	"raw_json" jsonb,
	"cached_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "diagnoses" ADD CONSTRAINT "diagnoses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generation_sessions" ADD CONSTRAINT "generation_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generation_sessions" ADD CONSTRAINT "generation_sessions_diagnosis_id_diagnoses_id_fk" FOREIGN KEY ("diagnosis_id") REFERENCES "public"."diagnoses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_results" ADD CONSTRAINT "saved_results_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_results" ADD CONSTRAINT "saved_results_generation_session_id_generation_sessions_id_fk" FOREIGN KEY ("generation_session_id") REFERENCES "public"."generation_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "selected_videos" ADD CONSTRAINT "selected_videos_generation_session_id_generation_sessions_id_fk" FOREIGN KEY ("generation_session_id") REFERENCES "public"."generation_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "selected_videos" ADD CONSTRAINT "selected_videos_video_cache_id_video_cache_id_fk" FOREIGN KEY ("video_cache_id") REFERENCES "public"."video_cache"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_limits" ADD CONSTRAINT "usage_limits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "diagnoses_session_id_idx" ON "diagnoses" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "diagnoses_user_id_idx" ON "diagnoses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "generation_sessions_session_id_idx" ON "generation_sessions" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "generation_sessions_user_id_idx" ON "generation_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "generation_sessions_diagnosis_id_idx" ON "generation_sessions" USING btree ("diagnosis_id");--> statement-breakpoint
CREATE INDEX "saved_results_user_idx" ON "saved_results" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "saved_results_created_idx" ON "saved_results" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "saved_results_session_idx" ON "saved_results" USING btree ("generation_session_id");--> statement-breakpoint
CREATE INDEX "selected_videos_session_idx" ON "selected_videos" USING btree ("generation_session_id");--> statement-breakpoint
CREATE UNIQUE INDEX "usage_limits_user_date_idx" ON "usage_limits" USING btree ("user_id","date_key");--> statement-breakpoint
CREATE UNIQUE INDEX "usage_limits_session_date_idx" ON "usage_limits" USING btree ("session_id","date_key");--> statement-breakpoint
CREATE UNIQUE INDEX "users_google_id_idx" ON "users" USING btree ("google_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "video_cache_keyword_idx" ON "video_cache" USING btree ("keyword");--> statement-breakpoint
CREATE INDEX "video_cache_keyword_expires_idx" ON "video_cache" USING btree ("keyword","expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "video_cache_video_keyword_idx" ON "video_cache" USING btree ("youtube_video_id","keyword");