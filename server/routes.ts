
import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { REWARD_RATES, POINTS_PER_USD, USD_TO_INR } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth (Passport)
  setupAuth(app);

  // Middleware to check auth
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) return next();
    res.status(401).json({ message: "Unauthorized" });
  };

  const requireAdmin = (req: any, res: any, next: any) => {
    if (req.isAuthenticated() && req.user.role === 'admin') return next();
    res.status(403).json({ message: "Forbidden" });
  };

  // === USER ROUTES ===

  // Earn Points
  app.post(api.user.earn.path, requireAuth, async (req, res) => {
    try {
      const input = api.user.earn.input.parse(req.body);
      const user = req.user as any;

      if (user.isBlocked) {
        return res.status(403).json({ message: "Account blocked" });
      }

      let pointsToAdd = 0;

      // Logic for points
      switch (input.type) {
        case 'ad_watch':
          pointsToAdd = REWARD_RATES.AD_WATCH;
          break;
        case 'daily_login':
          const today = new Date();
          const startOfDay = new Date(today.setHours(0, 0, 0, 0));
          const existing = (await storage.getActivitiesByUser(user.id)).find(
            a => a.type === 'daily_login' && new Date(a.createdAt!) >= startOfDay
          );
          if (existing) {
            return res.status(400).json({ message: "Already claimed today" });
          }
          pointsToAdd = REWARD_RATES.DAILY_LOGIN;
          break;
        case 'game_tap':
        case 'game_trivia':
        case 'game_memory':
          pointsToAdd = REWARD_RATES.GAME_PLAY;
          if (input.score && input.score > 0) {
             pointsToAdd += REWARD_RATES.GAME_WIN;
          }
          break;
      }

      const newBalance = user.points + pointsToAdd;
      await storage.updateUserPoints(user.id, newBalance);

      await storage.createActivity({
        userId: user.id,
        type: input.type,
        pointsEarned: pointsToAdd,
      });

      res.json({
        pointsAdded: pointsToAdd,
        newBalance: newBalance,
        message: `Earned ${pointsToAdd} points!`,
      });
    } catch (err) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.get(api.user.getActivities.path, requireAuth, async (req, res) => {
    const activities = await storage.getActivitiesByUser((req.user as any).id);
    res.json(activities);
  });

  // === WITHDRAWAL ROUTES ===

  app.post(api.withdrawals.create.path, requireAuth, async (req, res) => {
    try {
      const body = req.body as any;
      const input = api.withdrawals.create.input.parse(body);
      const user = req.user as any;

      if (user.points < input.amountPoints) {
        return res.status(400).json({ message: "Insufficient points" });
      }

      const usdValue = (input.amountPoints / 1000) * 1.5;
      const inrValue = usdValue * USD_TO_INR;
      
      await storage.updateUserPoints(user.id, user.points - input.amountPoints);

      const withdrawal = await storage.createWithdrawal({
        userId: user.id,
        amountPoints: input.amountPoints,
        amountUsd: usdValue.toFixed(2),
        amountInr: inrValue.toFixed(2),
        currency: body.currency || 'USD',
        method: input.method,
        details: input.details,
      });

      res.status(201).json(withdrawal);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.withdrawals.list.path, requireAuth, async (req, res) => {
    const withdrawals = await storage.getWithdrawalsByUser((req.user as any).id);
    res.json(withdrawals);
  });

  // === ADMIN ROUTES ===

  app.get(api.admin.users.path, requireAdmin, async (req, res) => {
    const users = await storage.getAllUsers();
    res.json(users);
  });

  app.post(api.admin.blockUser.path, requireAdmin, async (req, res) => {
    const userId = parseInt(req.params.id);
    const { isBlocked } = req.body;
    const user = await storage.updateUserBlockStatus(userId, isBlocked);
    res.json(user);
  });

  app.get(api.admin.withdrawals.path, requireAdmin, async (req, res) => {
    const withdrawals = await storage.getAllWithdrawals();
    res.json(withdrawals);
  });

  app.post(api.admin.approveWithdrawal.path, requireAdmin, async (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const withdrawal = await storage.updateWithdrawalStatus(id, status);
    res.json(withdrawal);
  });

  return httpServer;
}
