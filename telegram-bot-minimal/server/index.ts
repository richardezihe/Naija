import express from "express";
// Add declaration for node-telegram-bot-api
declare module 'node-telegram-bot-api';
import { TelegramBotService } from './bot';
import { storage } from './storage';

const app = express();
app.use(express.json());

// Simple logging function
function log(message: string, source = "express") {
  console.log(`${new Date().toLocaleTimeString()} [${source}] ${message}`);
}

// Start the Telegram bot
(async () => {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!token) {
    console.error('ERROR: TELEGRAM_BOT_TOKEN environment variable is not set');
    process.exit(1);
  }

  // Initialize the Telegram bot service
  const webAppUrl = process.env.WEB_APP_URL || 'https://t.me/NaijaValueorg_bot';
  const botService = new TelegramBotService(token, webAppUrl);
  
  log('Telegram bot service started', 'telegram-bot');

  // Basic health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Bot is running' });
  });

  // Get a list of all users (admin endpoint)
  app.get('/api/users', async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ error: 'Failed to get users' });
    }
  });

  // Start the Express server
  const port = Number(process.env.PORT || 5000);
  app.listen(port, '0.0.0.0', () => {
    log(`Server running on port ${port}`);
  });
})();
