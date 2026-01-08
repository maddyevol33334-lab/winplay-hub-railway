import { users, withdrawals, activities, type User, type InsertUser, type Withdrawal, type Activity } from "@shared/schema";
import { db, pool } from "./db";
import { eq, desc } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByPhoneNumber(phone: string): Promise<User | undefined>;
  getUserByDeviceId(deviceId: string): Promise<User | undefined>;
  createUser(user: any): Promise<User>;
  updateUserPoints(id: number, points: number): Promise<User>;
  updateUserBlockStatus(id: number, isBlocked: boolean): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Withdrawal
  createWithdrawal(withdrawal: any): Promise<Withdrawal>;
  getWithdrawalsByUser(userId: number): Promise<Withdrawal[]>;
  getAllWithdrawals(): Promise<Withdrawal[]>;
  updateWithdrawalStatus(id: number, status: string): Promise<Withdrawal>;

  // Activity
  createActivity(activity: any): Promise<Activity>;
  getActivitiesByUser(userId: number): Promise<Activity[]>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    return user;
  }

  async getUserByPhoneNumber(phone: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.phoneNumber, phone));
    return user;
  }

  async getUserByDeviceId(deviceId: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.deviceId, deviceId));
    return user;
  }

  async createUser(insertUser: any): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        username: insertUser.username,
        password: insertUser.password,
        phoneNumber: insertUser.phoneNumber || "9123456789",
        deviceId: String(insertUser.deviceId || "unknown"),
        role: insertUser.role || "user",
        points: insertUser.points || 0,
        isBlocked: insertUser.isBlocked || false,
        referralCode: insertUser.referralCode || Math.random().toString(36).substring(2, 8).toUpperCase(),
        referralEarnings: insertUser.referralEarnings || 0
      } as any)
      .returning();
    return user;
  }

  async updateUserPoints(id: number, points: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ points })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateUserBlockStatus(id: number, isBlocked: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isBlocked })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async createWithdrawal(
    insertWithdrawal: any,
  ): Promise<Withdrawal> {
    const [withdrawal] = await db
      .insert(withdrawals)
      .values(insertWithdrawal)
      .returning();
    return withdrawal;
  }

  async getWithdrawalsByUser(userId: number): Promise<Withdrawal[]> {
    return await db
      .select()
      .from(withdrawals)
      .where(eq(withdrawals.userId, userId))
      .orderBy(desc(withdrawals.createdAt));
  }

  async getAllWithdrawals(): Promise<Withdrawal[]> {
    return await db
      .select()
      .from(withdrawals)
      .orderBy(desc(withdrawals.createdAt));
  }

  async updateWithdrawalStatus(
    id: number,
    status: string,
  ): Promise<Withdrawal> {
    const [withdrawal] = await db
      .update(withdrawals)
      .set({ status })
      .where(eq(withdrawals.id, id))
      .returning();
    return withdrawal;
  }

  async createActivity(insertActivity: any): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async getActivitiesByUser(userId: number): Promise<Activity[]> {
    return await db
      .select()
      .from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.createdAt));
  }
}

export const storage = new DatabaseStorage();
export const sessionStore = storage.sessionStore;
