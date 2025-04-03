import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { TelegramBotService } from "./bot";

// Telegram Bot Token should be provided as an environment variable
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Determine the web app URL based on environment
  let webAppUrl = 'http://localhost:5000';
  if (process.env.REPLIT_DOMAINS) {
    const domains = process.env.REPLIT_DOMAINS.split(',');
    if (domains.length > 0) {
      webAppUrl = `https://${domains[0]}`;
    }
  }

  // Initialize the Telegram bot service
  const botService = new TelegramBotService(TELEGRAM_BOT_TOKEN, webAppUrl);

  // API route to get bot info
  app.get('/api/bot/info', (req, res) => {
    res.json({
      webAppUrl: botService.getWebAppUrl(),
      status: 'active'
    });
  });

  // API route to get user count
  app.get('/api/users/count', async (req, res) => {
    const users = await storage.getAllUsers();
    res.json({ count: users.length });
  });

  // API route to get demo user stats for the frontend demo
  app.get('/api/demo/user', async (req, res) => {
    // Create a demo user for frontend display
    const demoUser = {
      id: 1,
      username: 'Ezihe001',
      telegramId: '123456789',
      balance: 0,
      totalEarnings: 0,
      totalReferrals: 0,
      referralCode: 'Ani68xfC',
      isActive: true,
      joinedAt: new Date().toISOString(),
      rank: 1
    };
    
    res.json(demoUser);
  });

  // API route to get demo messages for the frontend demo
  app.get('/api/demo/messages', (req, res) => {
    const demoMessages = [
      {
        id: 1,
        type: 'bot',
        content: {
          type: 'text',
          message: '✨ Welcome to NaijaValue Bot ✨\n\nMake money by referring new members to our community! 💰\n\nWhat We Offer:\n• Earn ₦1000 for each referral\n• Weekend withdrawals\n• Real-time tracking\n• 24/7 automated system\n\nStart earning today! 💰\nUse /refer to get your referral link\nUse /help to see all command'
        },
        timestamp: '11:17 PM'
      },
      {
        id: 2,
        type: 'bot',
        content: {
          type: 'warning',
          message: '⚠️ MANDATORY REQUIREMENT ⚠️\n\nYou must join our channel and community group to use this bot.\n\nPlease use the buttons below to join, then click "✅ I\'ve Joined Both"'
        },
        timestamp: '11:17 PM'
      },
      {
        id: 3,
        type: 'bot',
        content: {
          type: 'buttons',
          buttons: [
            [
              { text: '📋 Join Channel', url: 'https://t.me/naijavaluechannel' },
              { text: '👥 Join Community', url: 'https://t.me/naijavaluegroup' }
            ],
            [{ text: '✅ I\'ve Joined Both', data: '/joined' }]
          ]
        },
        timestamp: '11:17 PM'
      },
      {
        id: 4,
        type: 'bot',
        content: {
          type: 'success',
          message: '✅ Thank you for joining our community!\n\nYou now have full access to all bot features including:\n• Referring friends\n• Checking your balance\n• Requesting withdrawals\n\nUse the buttons below to navigate:'
        },
        timestamp: '11:26 PM'
      },
      {
        id: 5,
        type: 'bot',
        content: {
          type: 'text',
          message: '👇 Use the buttons below to navigate 👇'
        },
        timestamp: '11:27 PM'
      },
      {
        id: 6,
        type: 'user',
        content: '💰 Balance',
        timestamp: '11:27 PM'
      },
      {
        id: 7,
        type: 'bot',
        content: {
          type: 'balance',
          message: '💰 Your Balance 💰\n\nCurrent Balance: ₦0\n\n📊 Summary:\n• Total Referrals: 0\n• Earnings per Referral: ₦100\n• Total Earnings: ₦0\n\n💳 To withdraw, use:\n/withdraw [amount]\n\nNote: Withdrawals are processed on weekends only (Saturday & Sunday).'
        },
        timestamp: '11:27 PM'
      },
      {
        id: 8,
        type: 'user',
        content: '💳 Withdraw',
        timestamp: '11:27 PM'
      },
      {
        id: 9,
        type: 'bot',
        content: {
          type: 'error',
          message: '❌ Withdrawals are only processed on weekends (Saturday & Sunday).\n\nPlease check back on weekend!'
        },
        timestamp: '11:27 PM'
      },
      {
        id: 10,
        type: 'user',
        content: '/withdraw 1000',
        timestamp: '11:28 PM'
      },
      {
        id: 11,
        type: 'bot',
        content: {
          type: 'error',
          message: '❌ Withdrawals are only processed on weekends (Saturday & Sunday).\n\nPlease check back on weekend!'
        },
        timestamp: '11:28 PM'
      },
      {
        id: 12,
        type: 'user',
        content: '📊 Stats',
        timestamp: '11:28 PM'
      },
      {
        id: 13,
        type: 'bot',
        content: {
          type: 'stats',
          message: '📊 Your Stats 📊\n\n👤 Username: Ezihe001\n💰 Balance: ₦0\n🔗 Referrals: 0\n🏆 Rank: #1\n\n📝 Performance:\n• Earnings per Referral: ₦100\n• Total Earnings: ₦0\n\n✨ Share your referral link to earn more!\nUse /refer to get your link.'
        },
        timestamp: '11:28 PM'
      },
      {
        id: 14,
        type: 'user',
        content: '/refer',
        timestamp: '11:28 PM'
      },
      {
        id: 15,
        type: 'bot',
        content: {
          type: 'referral',
          message: '🔗 Your Referral Link 🔗\n\nhttps://t.me/NaijaValueorg_bot?start=Ani68xfC\n\n💰 Share this link with your friends to earn rewards!\n\n📊 You currently have 0 confirmed referrals.\n\nHow it works:\n1. Share your unique referral link\n2. Friends join using your link\n3. You earn rewards for each verified referral'
        },
        timestamp: '11:28 PM'
      }
    ];
    
    res.json(demoMessages);
  });

  return httpServer;
}
