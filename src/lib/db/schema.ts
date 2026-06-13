import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    googleId: text("google_id").notNull(),
    email: text("email").notNull(),
    name: text("name"),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    googleIdIdx: uniqueIndex("users_google_id_idx").on(table.googleId),
    emailIdx: uniqueIndex("users_email_idx").on(table.email)
  })
);

export const diagnoses = pgTable(
  "diagnoses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    sessionId: text("session_id").notNull(),
    reason: text("reason").notNull(),
    expectedResult: text("expected_result").notNull(),
    knownField: text("known_field").notNull(),
    interestTopic: text("interest_topic").notNull(),
    facePreference: text("face_preference").notNull(),
    availableTime: text("available_time").notNull(),
    avoidTopic: text("avoid_topic"),
    shootingBurden: integer("shooting_burden").notNull(),
    recommendedKeywords: jsonb("recommended_keywords").$type<string[]>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    sessionIdx: index("diagnoses_session_id_idx").on(table.sessionId),
    userIdx: index("diagnoses_user_id_idx").on(table.userId)
  })
);

export const videoCache = pgTable(
  "video_cache",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    keyword: text("keyword").notNull(),
    youtubeVideoId: text("youtube_video_id").notNull(),
    title: text("title").notNull(),
    thumbnailUrl: text("thumbnail_url").notNull(),
    thumbnailText: text("thumbnail_text"),
    channelTitle: text("channel_title").notNull(),
    viewCount: integer("view_count").default(0).notNull(),
    likeCount: integer("like_count").default(0).notNull(),
    commentCount: integer("comment_count").default(0).notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    durationSeconds: integer("duration_seconds").default(0).notNull(),
    rawJson: jsonb("raw_json").$type<Record<string, unknown>>(),
    cachedAt: timestamp("cached_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull()
  },
  (table) => ({
    keywordIdx: index("video_cache_keyword_idx").on(table.keyword),
    keywordExpiresIdx: index("video_cache_keyword_expires_idx").on(table.keyword, table.expiresAt),
    videoKeywordIdx: uniqueIndex("video_cache_video_keyword_idx").on(table.youtubeVideoId, table.keyword)
  })
);

export const generationSessions = pgTable(
  "generation_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    diagnosisId: uuid("diagnosis_id").references(() => diagnoses.id, { onDelete: "cascade" }).notNull(),
    sessionId: text("session_id").notNull(),
    recommendedKeywords: jsonb("recommended_keywords").$type<string[]>().notNull(),
    templateType: text("template_type").default("profit").notNull(),
    status: text("status").default("started").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    sessionIdx: index("generation_sessions_session_id_idx").on(table.sessionId),
    userIdx: index("generation_sessions_user_id_idx").on(table.userId),
    diagnosisIdx: index("generation_sessions_diagnosis_id_idx").on(table.diagnosisId)
  })
);

export const selectedVideos = pgTable(
  "selected_videos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    generationSessionId: uuid("generation_session_id")
      .references(() => generationSessions.id, { onDelete: "cascade" })
      .notNull(),
    videoCacheId: uuid("video_cache_id").references(() => videoCache.id, { onDelete: "restrict" }).notNull(),
    rank: integer("rank").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    sessionIdx: index("selected_videos_session_idx").on(table.generationSessionId),
    rankCheck: check("selected_videos_rank_check", sql`${table.rank} between 1 and 3`)
  })
);

export const savedResults = pgTable(
  "saved_results",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    generationSessionId: uuid("generation_session_id")
      .references(() => generationSessions.id, { onDelete: "cascade" })
      .notNull(),
    searchSummary: text("search_summary").notNull(),
    finalTitle: text("final_title").notNull(),
    finalThumbnailText: text("final_thumbnail_text").notNull(),
    titleCandidates: jsonb("title_candidates").$type<string[]>().notNull(),
    thumbnailCandidates: jsonb("thumbnail_candidates").$type<string[]>().notNull(),
    videoOutline: jsonb("video_outline").$type<string[]>().notNull(),
    sevenDayPlan: jsonb("seven_day_plan").$type<Array<{ day: number; title: string; task: string }>>().notNull(),
    memo: text("memo"),
    isDeleted: boolean("is_deleted").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    userIdx: index("saved_results_user_idx").on(table.userId),
    createdIdx: index("saved_results_created_idx").on(table.createdAt),
    sessionIdx: uniqueIndex("saved_results_session_idx").on(table.generationSessionId)
  })
);

export const usageLimits = pgTable(
  "usage_limits",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    sessionId: text("session_id"),
    dateKey: text("date_key").notNull(),
    generationCount: integer("generation_count").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
  },
  (table) => ({
    userDateIdx: uniqueIndex("usage_limits_user_date_idx").on(table.userId, table.dateKey),
    sessionDateIdx: uniqueIndex("usage_limits_session_date_idx").on(table.sessionId, table.dateKey)
  })
);
