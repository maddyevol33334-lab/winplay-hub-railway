import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ================= USERS =================
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  phoneNumber: text("phone_number"),
deviceId: text("device_id"),

  role: text("role").notNull().default("user"),
  points: integer("points").notNull().default(0),
  isBlocked: boolean("is_blocked").notNull().default(false),

  referralCode: text("referral_code").notNull().unique(),
  referredBy: text("referred_by"),
  referralEarnings: integer("referral_earnings").notNull().default(0),

  createdAt: timestamp("created_at").defaultNow(),
});

// ================= WITHDRAWALS =================
export const withdrawals = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amountPoints: integer("amount_points").notNull(),
  amountUsd: text("amount_usd").notNull(),
  amountInr: text("amount_inr").notNull(),
  currency: text("currency").notNull().default("USD"),
  method: text("method").notNull(),
  details: text("details").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= ACTIVITIES =================
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  pointsEarned: integer("points_earned").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ================= SCHEMAS =================
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  points: true,
  role: true,
  isBlocked: true,
  referralEarnings: true,
  createdAt: true
}).extend({
  phoneNumber: z.string().min(10).optional(),
  deviceId: z.string().min(1).optional(),
});

export const insertWithdrawalSchema = createInsertSchema(withdrawals).omit({
  id: true,
  status: true,
  createdAt: true
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true
});

// ================= TYPES =================
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Withdrawal = typeof withdrawals.$inferSelect;
export type Activity = typeof activities.$inferSelect;

// ================= CONSTANTS =================
export const POINTS_PER_USD = 1500 / 1.2;
export const USD_TO_INR = 87.5; // Updated to match user's ~21000 INR for $240 (21000/240 = 87.5)

export const REWARD_RATES = {
  AD_WATCH: 20,
  GAME_PLAY: 5,
  GAME_WIN: 15,
  DAILY_LOGIN: 20,
};
