import { BotCommand, User } from '@shared/schema';
import { storage } from './storage';
import { processCommand, registerUser } from './commands';
import TelegramBot from 'node-telegram-bot-api';
import { log } from './vite';

export class TelegramBotService {
  private bot: TelegramBot;
  private webAppUrl: string;

  constructor(token: string, webAppUrl: string) {
    if (!token || token === 'YOUR_BOT_TOKEN') {
      throw new Error('Invalid Telegram bot token. Please set a valid TELEGRAM_BOT_TOKEN environment variable.');
    }

    this.bot = new TelegramBot(token, { 
      polling: {
        autoStart: true,
        params: {
          timeout: 10,
          allowed_updates: ['message', 'callback_query']
        }
      }
    });

    // Add error handler
    this.bot.on('error', (error) => {
      console.error('Telegram bot error:', error.message);
    });

    // Add polling error handler
    this.bot.on('polling_error', (error) => {
      console.error('Telegram bot polling error:', error.message);
    });

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

  private isCommandAllowedWithoutVerification(command: BotCommand): boolean {
    return command.type === 'start' || command.type === 'joined';
  }

  private async shouldRedirectToVerification(command: BotCommand, user?: User): Promise<boolean> {
    if (this.isCommandAllowedWithoutVerification(command)) {
      return false;
    }
    return !user || !user.isVerified;
  }

  private setupCommandHandlers() {
    // Handle earn bonus command
    this.bot.onText(/\/earn_bonus/, async (msg) => {
      const user = await this.getUserFromMessage(msg);
      const command = { type: 'earn_bonus' as const };
      
      // Check if user needs to verify first
      if (await this.shouldRedirectToVerification(command, user)) {
        const verificationResponse = await processCommand({ type: 'start' }, user);
        await this.sendBotResponse(msg.chat.id, verificationResponse);
        return;
      }
      
      const response = await processCommand(command, user);
      await this.sendBotResponse(msg.chat.id, response);
    });

    // Handle payment method command
    this.bot.onText(/\/payment_method/, async (msg) => {
      const user = await this.getUserFromMessage(msg);
      const command = { type: 'payment_method' as const };
      
      // Check if user needs to verify first
      if (await this.shouldRedirectToVerification(command, user)) {
        const verificationResponse = await processCommand({ type: 'start' }, user);
        await this.sendBotResponse(msg.chat.id, verificationResponse);
        return;
      }
      
      const response = await processCommand(command, user);
      await this.sendBotResponse(msg.chat.id, response);
    });
    // Handle /start command
    this.bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
      const telegramId = msg.from?.id.toString();
      const username = msg.from?.username || `user${msg.from?.id}`;
      const referralCode = match?.[1]; // Extract referral code if present
      
      if (!telegramId) return;
      
      // Register user if new
      const user = await registerUser(telegramId, username, referralCode);
      
      // Always show join verification first
      const response = await processCommand({ type: 'start', referralCode }, user);
      
      // Send response
      await this.sendBotResponse(msg.chat.id, response);
    });

    // Handle balance command
    this.bot.onText(/\/balance/, async (msg) => {
      const user = await this.getUserFromMessage(msg);
      const command = { type: 'balance' as const };
      
      // Check if user needs to verify first
      if (await this.shouldRedirectToVerification(command, user)) {
        const verificationResponse = await processCommand({ type: 'start' }, user);
        await this.sendBotResponse(msg.chat.id, verificationResponse);
        return;
      }
      
      const response = await processCommand(command, user);
      await this.sendBotResponse(msg.chat.id, response);
    });

    // Handle stats command
    this.bot.onText(/\/stats/, async (msg) => {
      const user = await this.getUserFromMessage(msg);
      const command = { type: 'stats' as const };
      
      // Check if user needs to verify first
      if (await this.shouldRedirectToVerification(command, user)) {
        const verificationResponse = await processCommand({ type: 'start' }, user);
        await this.sendBotResponse(msg.chat.id, verificationResponse);
        return;
      }
      
      const response = await processCommand(command, user);
      await this.sendBotResponse(msg.chat.id, response);
    });

    // Handle refer command
    this.bot.onText(/\/refer/, async (msg) => {
      const user = await this.getUserFromMessage(msg);
      const command = { type: 'refer' as const };
      
      // Check if user needs to verify first
      if (await this.shouldRedirectToVerification(command, user)) {
        const verificationResponse = await processCommand({ type: 'start' }, user);
        await this.sendBotResponse(msg.chat.id, verificationResponse);
        return;
      }
      
      const response = await processCommand(command, user);
      await this.sendBotResponse(msg.chat.id, response);
    });

    // Handle withdraw command
    this.bot.onText(/\/withdraw(?:\s+(\d+))?/, async (msg, match) => {
      const user = await this.getUserFromMessage(msg);
      const amount = match?.[1] ? parseInt(match[1]) : 0;
      const command = { type: 'withdraw' as const, amount };
      
      // Check if user needs to verify first
      if (await this.shouldRedirectToVerification(command, user)) {
        const verificationResponse = await processCommand({ type: 'start' }, user);
        await this.sendBotResponse(msg.chat.id, verificationResponse);
        return;
      }
      
      const response = await processCommand(command, user);
      await this.sendBotResponse(msg.chat.id, response);
    });

    // Handle help command
    this.bot.onText(/\/help/, async (msg) => {
      const user = await this.getUserFromMessage(msg);
      const command = { type: 'help' as const };
      
      // Check if user needs to verify first
      if (await this.shouldRedirectToVerification(command, user)) {
        const verificationResponse = await processCommand({ type: 'start' }, user);
        await this.sendBotResponse(msg.chat.id, verificationResponse);
        return;
      }
      
      const response = await processCommand(command, user);
      await this.sendBotResponse(msg.chat.id, response);
    });

    // Handle payment info command
    this.bot.onText(/\/payment_info/, async (msg) => {
      const user = await this.getUserFromMessage(msg);
      const command = { type: 'payment_info' as const };
      
      // Check if user needs to verify first
      if (await this.shouldRedirectToVerification(command, user)) {
        const verificationResponse = await processCommand({ type: 'start' }, user);
        await this.sendBotResponse(msg.chat.id, verificationResponse);
        return;
      }
      
      const response = await processCommand(command, user);
      await this.sendBotResponse(msg.chat.id, response);
    });

    // Handle withdrawal request command
    this.bot.onText(/\/withdrawal_request/, async (msg) => {
      const user = await this.getUserFromMessage(msg);
      const command = { type: 'withdrawal_request' as const };
      
      // Check if user needs to verify first
      if (await this.shouldRedirectToVerification(command, user)) {
        const verificationResponse = await processCommand({ type: 'start' }, user);
        await this.sendBotResponse(msg.chat.id, verificationResponse);
        return;
      }
      
      const response = await processCommand(command, user);
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
        case '🔗 Invite Friends':
          command = { type: 'refer' };
          break;
        case '💳 Withdraw':
          command = { type: 'withdraw', amount: 0 };
          break;
        case '✅ I\'ve Joined Both':
          command = { type: 'joined' };
          break;
        case '💵 Payment Info':
          command = { type: 'payment_info' };
          break;
        case '💳 Payment Method':
          command = { type: 'payment_method' };
          break;
        case '📝 Withdrawal Request':
          command = { type: 'withdrawal_request' };
          break;
      }

      if (command) {
        const user = await this.getUserFromMessage(msg);
        
        // Check if user needs to verify first (except for 'joined' command)
        if (await this.shouldRedirectToVerification(command, user)) {
          const verificationResponse = await processCommand({ type: 'start' }, user);
          await this.sendBotResponse(msg.chat.id, verificationResponse);
          return;
        }
        
        const response = await processCommand(command, user);
        await this.sendBotResponse(msg.chat.id, response);
      }
    });
  }

  private setupCallbackQueryHandler() {
    this.bot.on('callback_query', async (query) => {
      if (!query.data || !query.message) return;

      try {
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
        } else if (data.startsWith('/payment_info')) {
          command = { type: 'payment_info' };
        } else if (data.startsWith('/payment_method')) {
          command = { type: 'payment_method' };
        } else if (data.startsWith('/withdrawal_request')) {
          command = { type: 'withdrawal_request' };
        } else if (data.startsWith('/earn_bonus')) {
          command = { type: 'earn_bonus' };
        }

        if (command) {
          // Check if user needs to verify first
          if (await this.shouldRedirectToVerification(command, user)) {
            const verificationResponse = await processCommand({ type: 'start' }, user);
            await this.sendBotResponse(chatId, verificationResponse);
          } else {
            const response = await processCommand(command, user);
            await this.sendBotResponse(chatId, response);
          }
        }

        // Always answer callback query to remove loading state
        await this.bot.answerCallbackQuery(query.id);
      } catch (error) {
        console.error('Error handling callback query:', error);
        // Try to answer callback query even if there was an error
        try {
          await this.bot.answerCallbackQuery(query.id);
        } catch (err) {
          console.error('Error answering callback query:', err);
        }
      }
    });
  }

  private async sendBotResponse(chatId: number, response: any) {
    try {
      if (response.buttons) {
        const inlineKeyboard = response.buttons.map((row: any) => 
          row.map((btn: any) => {
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

  public getWebAppUrl(): string {
    return this.webAppUrl;
  }
}