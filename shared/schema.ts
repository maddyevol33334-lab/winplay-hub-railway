
import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"), // 'user' | 'admin'
  points: integer("points").notNull().default(0),
  isBlocked: boolean("is_blocked").notNull().default(false),
  phoneNumber: text("phone_number").notNull().unique(),
  deviceId: text("device_id").notNull(), // To prevent multiple accounts on same device
  createdAt: timestamp("created_at").defaultNow(),
});

export const withdrawals = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amountPoints: integer("amount_points").notNull(),
  amountUsd: text("amount_usd").notNull(),
  amountInr: text("amount_inr").notNull(), // Added INR
  method: text("method").notNull(), // 'paypal', 'upi', 'bank'
  details: text("details").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // 'daily_login', 'game_math', 'game_scramble', 'ad_watch'
  pointsEarned: integer("points_earned").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  points: true, 
  role: true, 
  isBlocked: true, 
  createdAt: true 
}).extend({
  phoneNumber: z.string().min(10, "Invalid phone number"),
  deviceId: z.string()
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

// === TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Withdrawal = typeof withdrawals.$inferSelect;
export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

// === CONSTANTS ===

export const POINTS_PER_USD = 1000 / 1.5;
export const USD_TO_INR = 83.5; // Example conversion
export const POINTS_PER_INR = POINTS_PER_USD / USD_TO_INR;

export const REWARD_RATES = {
  AD_WATCH: 20, // Updated to 20
  GAME_PLAY: 5,
  GAME_WIN: 15, // Harder to get
  DAILY_LOGIN: 30,
};
