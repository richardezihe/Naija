import { 
  users, 
  type User, 
  type InsertUser, 
  withdrawals, 
  type Withdrawal, 
  type InsertWithdrawal
} from "@shared/schema";
import { v4 as uuidv4 } from 'uuid';

// Storage interface for our application
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByTelegramId(telegramId: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateBalance(userId: number, amount: number): Promise<User | undefined>;
  updateVerificationStatus(userId: number, isVerified: boolean): Promise<User | undefined>;
  addReferral(userId: number): Promise<User | undefined>;
  
  // Withdrawal operations
  createWithdrawal(withdrawal: InsertWithdrawal): Promise<Withdrawal>;
  getWithdrawalsByUserId(userId: number): Promise<Withdrawal[]>;
  updateWithdrawalStatus(withdrawalId: number, status: string): Promise<Withdrawal | undefined>;
  
  // Stats and ranks
  getUserRank(userId: number): Promise<number>;
  getAllUsers(): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private withdrawals: Map<number, Withdrawal>;
  private currentUserId: number;
  private currentWithdrawalId: number;

  constructor() {
    this.users = new Map();
    this.withdrawals = new Map();
    this.currentUserId = 1;
    this.currentWithdrawalId = 1;
    
    // No sample users - only real users from Telegram will be added
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByTelegramId(telegramId: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.telegramId === telegramId
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.referralCode === referralCode
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const joinedAt = new Date();
    
    // Create user with explicit properties to avoid type issues
    const user: User = {
      id,
      username: insertUser.username,
      telegramId: insertUser.telegramId,
      referralCode: insertUser.referralCode,
      referredBy: insertUser.referredBy || null,
      balance: 0,
      totalEarnings: 0,
      totalReferrals: 0,
      isActive: true,
      isVerified: false,
      joinedAt
    };
    
    this.users.set(id, user);
    return user;
  }

  async updateBalance(userId: number, amount: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;

    const updatedUser = { 
      ...user, 
      balance: user.balance + amount,
      totalEarnings: amount > 0 ? user.totalEarnings + amount : user.totalEarnings
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateVerificationStatus(userId: number, isVerified: boolean): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;

    const updatedUser = { 
      ...user, 
      isVerified
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async addReferral(userId: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;

    const updatedUser = { 
      ...user, 
      totalReferrals: user.totalReferrals + 1
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async createWithdrawal(insertWithdrawal: InsertWithdrawal): Promise<Withdrawal> {
    const id = this.currentWithdrawalId++;
    const requestedAt = new Date();
    
    const withdrawal: Withdrawal = {
      ...insertWithdrawal,
      id,
      status: "pending",
      requestedAt,
      processedAt: null
    };
    
    this.withdrawals.set(id, withdrawal);
    return withdrawal;
  }

  async getWithdrawalsByUserId(userId: number): Promise<Withdrawal[]> {
    return Array.from(this.withdrawals.values()).filter(
      (withdrawal) => withdrawal.userId === userId
    );
  }

  async updateWithdrawalStatus(withdrawalId: number, status: string): Promise<Withdrawal | undefined> {
    const withdrawal = this.withdrawals.get(withdrawalId);
    if (!withdrawal) return undefined;

    const updatedWithdrawal = {
      ...withdrawal,
      status,
      processedAt: status !== "pending" ? new Date() : withdrawal.processedAt
    };
    
    this.withdrawals.set(withdrawalId, updatedWithdrawal);
    return updatedWithdrawal;
  }

  async getUserRank(userId: number): Promise<number> {
    const users = Array.from(this.users.values())
      .sort((a, b) => b.totalReferrals - a.totalReferrals);
    
    const index = users.findIndex(user => user.id === userId);
    return index !== -1 ? index + 1 : 0;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Helper method to generate a unique referral code
  static generateReferralCode(): string {
    return uuidv4().substring(0, 8);
  }
}

export const storage = new MemStorage();
