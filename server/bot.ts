import { BotCommand, User } from '@shared/schema';
import { storage } from './storage';
import { processCommand, registerUser } from './commands';
import TelegramBot from 'node-telegram-bot-api';
import { log } from './vite';

export class TelegramBotService {
  private bot: TelegramBot;
  private webAppUrl: string;

  constructor(token: string, webAppUrl: string) {
    this.bot = new TelegramBot(token, { polling: true });
    this.webAppUrl = webAppUrl;
    
    this.setupCommandHandlers();
    this.setupCallbackQueryHandler();
    
    log('Telegram bot service started', 'telegram-bot');
  }

  private async getUserFromMessage(msg: TelegramBot.Message): Promise<User | undefined> {
    if (!msg.from) return undefined;
    
    const telegramId = msg.from.id.toString();
    const user = await storage.getUserByTelegramId(telegramId);
    
    return user;
  }

  private setupCommandHandlers() {
    // Handle /start command
    this.bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
      const telegramId = msg.from?.id.toString();
      const username = msg.from?.username || `user${msg.from?.id}`;
      const referralCode = match?.[1]; // Extract referral code if present
      
      if (!telegramId) return;
      
      // Register user if new
      const user = await registerUser(telegramId, username, referralCode);
      
      // Process the start command
      const response = await processCommand({ type: 'start', referralCode }, user);
      
      // Send response
      await this.sendBotResponse(msg.chat.id, response);
    });

    // Handle balance command
    this.bot.onText(/\/balance/, async (msg) => {
      const user = await this.getUserFromMessage(msg);
      const response = await processCommand({ type: 'balance' }, user);
      await this.sendBotResponse(msg.chat.id, response);
    });

    // Handle stats command
    this.bot.onText(/\/stats/, async (msg) => {
      const user = await this.getUserFromMessage(msg);
      const response = await processCommand({ type: 'stats' }, user);
      await this.sendBotResponse(msg.chat.id, response);
    });

    // Handle refer command
    this.bot.onText(/\/refer/, async (msg) => {
      const user = await this.getUserFromMessage(msg);
      const response = await processCommand({ type: 'refer' }, user);
      await this.sendBotResponse(msg.chat.id, response);
    });

    // Handle withdraw command
    this.bot.onText(/\/withdraw(?:\s+(\d+))?/, async (msg, match) => {
      const user = await this.getUserFromMessage(msg);
      const amount = match?.[1] ? parseInt(match[1]) : 0;
      const response = await processCommand({ type: 'withdraw', amount }, user);
      await this.sendBotResponse(msg.chat.id, response);
    });

    // Handle help command
    this.bot.onText(/\/help/, async (msg) => {
      const user = await this.getUserFromMessage(msg);
      const response = await processCommand({ type: 'help' }, user);
      await this.sendBotResponse(msg.chat.id, response);
    });

    // Handle text without commands (for button interactions)
    this.bot.on('text', async (msg) => {
      if (msg.text?.startsWith('/')) return; // Skip if it's a command

      // Handle predefined button texts
      let command: BotCommand | undefined;
      const text = msg.text?.trim();

      switch (text) {
        case '💰 Balance':
          command = { type: 'balance' };
          break;
        case '📊 Stats':
          command = { type: 'stats' };
          break;
        case '🔗 Refer':
          command = { type: 'refer' };
          break;
        case '💳 Withdraw':
          command = { type: 'withdraw', amount: 0 };
          break;
        case '✅ I\'ve Joined Both':
          command = { type: 'joined' };
          break;
      }

      if (command) {
        const user = await this.getUserFromMessage(msg);
        const response = await processCommand(command, user);
        await this.sendBotResponse(msg.chat.id, response);
      }
    });
  }

  private setupCallbackQueryHandler() {
    // Handle callback queries from inline buttons
    this.bot.on('callback_query', async (query) => {
      if (!query.data || !query.message) return;
      
      const chatId = query.message.chat.id;
      const data = query.data;
      const user = query.from?.id ? 
        await storage.getUserByTelegramId(query.from.id.toString()) : 
        undefined;
      
      let command: BotCommand | undefined;
      
      // Parse command from callback data
      if (data.startsWith('/balance')) {
        command = { type: 'balance' };
      } else if (data.startsWith('/stats')) {
        command = { type: 'stats' };
      } else if (data.startsWith('/refer')) {
        command = { type: 'refer' };
      } else if (data.startsWith('/withdraw')) {
        const match = data.match(/\/withdraw(?:\s+(\d+))?/);
        const amount = match?.[1] ? parseInt(match[1]) : 0;
        command = { type: 'withdraw', amount };
      } else if (data.startsWith('/joined')) {
        command = { type: 'joined' };
      } else if (data.startsWith('/help')) {
        command = { type: 'help' };
      } else if (data.startsWith('/start')) {
        const match = data.match(/\/start(?:\s+(.+))?/);
        command = { type: 'start', referralCode: match?.[1] };
      }
      
      if (command) {
        const response = await processCommand(command, user);
        await this.sendBotResponse(chatId, response);
        
        // Answer callback query to remove loading state
        await this.bot.answerCallbackQuery(query.id);
      }
    });
  }

  private async sendBotResponse(chatId: number, response: any) {
    try {
      if (response.buttons) {
        // Create inline keyboard markup
        const inlineKeyboard = response.buttons.map(row => 
          row.map(btn => {
            if (btn.url) {
              return { text: btn.text, url: btn.url };
            } else {
              return { text: btn.text, callback_data: btn.data || btn.text };
            }
          })
        );
        
        await this.bot.sendMessage(chatId, response.message, {
          parse_mode: 'HTML',
          reply_markup: {
            inline_keyboard: inlineKeyboard
          }
        });
      } else {
        await this.bot.sendMessage(chatId, response.message, {
          parse_mode: 'HTML'
        });
      }
    } catch (error) {
      console.error('Error sending bot response:', error);
      await this.bot.sendMessage(chatId, 'Sorry, an error occurred. Please try again later.');
    }
  }

  // Method to get the web app URL
  getWebAppUrl(): string {
    return this.webAppUrl;
  }
}
