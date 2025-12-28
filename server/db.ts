import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, businessProfiles, InsertBusinessProfile, scoreReports, InsertScoreReport, scoreHistory, InsertScoreHistory } from "../drizzle/schema";
import { ENV } from './_core/env';
import { nanoid } from 'nanoid';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Business Profile queries
export async function createBusinessProfile(profile: Omit<InsertBusinessProfile, 'scoreToken'> & { generateToken?: boolean }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const values: InsertBusinessProfile = {
    ...profile,
    scoreToken: profile.generateToken ? nanoid(32) : undefined,
  };

  const result = await db.insert(businessProfiles).values(values);
  return result[0].insertId;
}

export async function getBusinessProfileById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(businessProfiles).where(eq(businessProfiles.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getBusinessProfileByToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(businessProfiles).where(eq(businessProfiles.scoreToken, token)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateBusinessProfileSubscription(
  id: number,
  data: {
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionStatus?: "none" | "active" | "canceled" | "past_due";
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(businessProfiles).set(data).where(eq(businessProfiles.id, id));
}

// Score Report queries
export async function createScoreReport(report: InsertScoreReport) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(scoreReports).values(report);
  return result[0].insertId;
}

export async function getScoreReportById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(scoreReports).where(eq(scoreReports.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getLatestScoreReportByBusinessId(businessProfileId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(scoreReports)
    .where(eq(scoreReports.businessProfileId, businessProfileId))
    .orderBy(desc(scoreReports.createdAt))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateScoreReport(
  id: number,
  data: Partial<Omit<InsertScoreReport, 'businessProfileId' | 'scanType'>>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(scoreReports).set(data).where(eq(scoreReports.id, id));
}

export async function getScoreReportsByBusinessId(businessProfileId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(scoreReports)
    .where(eq(scoreReports.businessProfileId, businessProfileId))
    .orderBy(desc(scoreReports.createdAt));
}

// Score History queries
export async function createScoreHistory(history: InsertScoreHistory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(scoreHistory).values(history);
  return result[0].insertId;
}

export async function getScoreHistoryByBusinessId(businessProfileId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(scoreHistory)
    .where(eq(scoreHistory.businessProfileId, businessProfileId))
    .orderBy(desc(scoreHistory.createdAt));
}
