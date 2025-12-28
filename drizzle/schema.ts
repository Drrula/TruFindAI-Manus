import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Business profiles for contractors who request TruFindAI scores
 */
export const businessProfiles = mysqlTable("business_profiles", {
  id: int("id").autoincrement().primaryKey(),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  website: varchar("website", { length: 500 }).notNull(),
  contactName: varchar("contactName", { length: 255 }),
  contactEmail: varchar("contactEmail", { length: 320 }),
  contactPhone: varchar("contactPhone", { length: 50 }),
  leadSource: mysqlEnum("leadSource", ["inbound", "outbound"]).notNull(),
  /** Unique token for personalized score links (outbound leads) */
  scoreToken: varchar("scoreToken", { length: 64 }).unique(),
  /** Stripe customer ID for subscription management */
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  /** Stripe subscription ID for active monitoring service */
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  subscriptionStatus: mysqlEnum("subscriptionStatus", ["none", "active", "canceled", "past_due"]).default("none").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BusinessProfile = typeof businessProfiles.$inferSelect;
export type InsertBusinessProfile = typeof businessProfiles.$inferInsert;

/**
 * Score reports storing both fast and full scan results
 */
export const scoreReports = mysqlTable("score_reports", {
  id: int("id").autoincrement().primaryKey(),
  businessProfileId: int("businessProfileId").notNull(),
  /** Overall TruFindAI Score (0-100) */
  overallScore: decimal("overallScore", { precision: 5, scale: 2 }),
  /** SEO sub-score */
  seoScore: decimal("seoScore", { precision: 5, scale: 2 }),
  /** Visibility sub-score */
  visibilityScore: decimal("visibilityScore", { precision: 5, scale: 2 }),
  /** Local presence sub-score */
  localPresenceScore: decimal("localPresenceScore", { precision: 5, scale: 2 }),
  /** Online reputation sub-score */
  reputationScore: decimal("reputationScore", { precision: 5, scale: 2 }),
  /** Type of scan performed */
  scanType: mysqlEnum("scanType", ["fast", "full"]).notNull(),
  /** Status of score generation */
  status: mysqlEnum("status", ["pending", "processing", "completed", "failed"]).default("pending").notNull(),
  /** JSON string storing next 2 fixes recommendations */
  recommendations: text("recommendations"),
  /** JSON string storing competitor benchmark data */
  competitorBenchmarks: text("competitorBenchmarks"),
  /** Error message if generation failed */
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type ScoreReport = typeof scoreReports.$inferSelect;
export type InsertScoreReport = typeof scoreReports.$inferInsert;

/**
 * Score history tracking for biweekly updates
 */
export const scoreHistory = mysqlTable("score_history", {
  id: int("id").autoincrement().primaryKey(),
  businessProfileId: int("businessProfileId").notNull(),
  scoreReportId: int("scoreReportId").notNull(),
  /** Previous overall score for comparison */
  previousScore: decimal("previousScore", { precision: 5, scale: 2 }),
  /** New overall score */
  currentScore: decimal("currentScore", { precision: 5, scale: 2 }),
  /** Score change (positive or negative) */
  scoreChange: decimal("scoreChange", { precision: 5, scale: 2 }),
  /** JSON string describing what changed */
  changesSummary: text("changesSummary"),
  /** Whether this was a biweekly courtesy update */
  isBiweeklyUpdate: boolean("isBiweeklyUpdate").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ScoreHistory = typeof scoreHistory.$inferSelect;
export type InsertScoreHistory = typeof scoreHistory.$inferInsert;
