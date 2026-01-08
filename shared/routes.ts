
import { z } from 'zod';
import { insertUserSchema, insertWithdrawalSchema, users, withdrawals, activities } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  forbidden: z.object({
    message: z.string(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
  method: 'POST' as const,
  path: '/api/register',
  input: z.object({
    username: z.string(),
    password: z.string(),
    phoneNumber: z.string(),
    deviceId: z.string(),
  }),
  responses: {
    201: z.custom<typeof users.$inferSelect>(),
    400: errorSchemas.validation,
  },
},
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.object({ message: z.string().optional() }),
      },
    },
  },
  user: {
    earn: {
      method: 'POST' as const,
      path: '/api/earn',
      input: z.object({
        type: z.enum(['daily_login', 'game_tap', 'game_trivia', 'game_memory', 'ad_watch']),
        score: z.number().optional(),
      }),
      responses: {
        200: z.object({
          pointsAdded: z.number(),
          newBalance: z.number(),
          message: z.string(),
        }),
        400: errorSchemas.validation,
      },
    },
    getActivities: {
      method: 'GET' as const,
      path: '/api/activities',
      responses: {
        200: z.array(z.custom<typeof activities.$inferSelect>()),
      },
    },
  },
  withdrawals: {
    create: {
      method: 'POST' as const,
      path: '/api/withdrawals',
      input: z.object({
        amountPoints: z.number().min(100), // Minimum withdrawal
        method: z.enum(['paypal', 'upi', 'bank']),
        details: z.string(),
      }),
      responses: {
        201: z.custom<typeof withdrawals.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/withdrawals',
      responses: {
        200: z.array(z.custom<typeof withdrawals.$inferSelect>()),
      },
    },
  },
  admin: {
    users: {
      method: 'GET' as const,
      path: '/api/admin/users',
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      },
    },
    blockUser: {
      method: 'POST' as const,
      path: '/api/admin/users/:id/block',
      input: z.object({ isBlocked: z.boolean() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
      },
    },
    withdrawals: {
      method: 'GET' as const,
      path: '/api/admin/withdrawals',
      responses: {
        200: z.array(z.custom<typeof withdrawals.$inferSelect>()),
      },
    },
    approveWithdrawal: {
      method: 'POST' as const,
      path: '/api/admin/withdrawals/:id/status',
      input: z.object({ status: z.enum(['approved', 'rejected']) }),
      responses: {
        200: z.custom<typeof withdrawals.$inferSelect>(),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
