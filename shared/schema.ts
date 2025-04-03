import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  telegramId: text("telegram_id").notNull().unique(),
  balance: integer("balance").notNull().default(0),
  totalEarnings: integer("total_earnings").notNull().default(0),
  totalReferrals: integer("total_referrals").notNull().default(0),
  referralCode: text("referral_code").notNull().unique(),
  referredBy: text("referred_by"),
  isActive: boolean("is_active").notNull().default(true),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

export const withdrawals = pgTable("withdrawals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: integer("amount").notNull(),
  status: text("status").notNull().default("pending"),
  requestedAt: timestamp("requested_at").notNull().defaultNow(),
  processedAt: timestamp("processed_at"),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  joinedAt: true,
  totalEarnings: true,
  totalReferrals: true,
  balance: true,
  isActive: true,
});

export const insertWithdrawalSchema = createInsertSchema(withdrawals).omit({
  id: true,
  status: true,
  requestedAt: true,
  processedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Withdrawal = typeof withdrawals.$inferSelect;
export type InsertWithdrawal = z.infer<typeof insertWithdrawalSchema>;

// Command types for the bot
export type BotCommand = 
  | { type: 'start', referralCode?: string }
  | { type: 'balance' }
  | { type: 'stats' }
  | { type: 'refer' }
  | { type: 'withdraw', amount: number }
  | { type: 'help' }
  | { type: 'joined' };

// Response types from the bot
export type BotResponse = {
  type: 'text' | 'buttons' | 'error' | 'success' | 'stats' | 'balance' | 'referral' | 'warning';
  message: string;
  buttons?: { text: string, data?: string, url?: string }[][];
  data?: any;
};
