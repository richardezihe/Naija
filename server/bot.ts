import { BotCommand, User } from '@shared/schema';
import { storage } from './storage';
import { processCommand, registerUser } from './commands';
import TelegramBot from 'node-telegram-bot-api';
import { log } from './vite';

export class TelegramBotService {
  private bot: TelegramBot;
  private webAppUrl: string;

  constructor(token: string, webAppUrl: string) {
    this.bot = new TelegramBot(token, { 
      polling: {
        autoStart: true,
        params: {
          timeout: 10,
          allowed_updates: ['message', 'callback_query']
        }
      }
    });
    this.webAppUrl = webAppUrl;
    
    this.setupCommandHandlers();
    this.setupCallbackQueryHandler();

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
    
    log('Telegram bot service started', 'telegram-bot');
  }

  private async getUserFromMessage(msg: TelegramBot.Message): Promise<User | undefined> {
    if (!msg.from) return undefined;
    
    const telegramId = msg.from.id.toString();
    const user = await storage.getUserByTelegramId(telegramId);
    
    return user;
  }
  
  // Helper function to check if a command is allowed without verification
  private isCommandAllowedWithoutVerification(command: BotCommand): boolean {
    return command.type === 'start' || command.type === 'joined';
  }
  
  // Method to redirect user to verification if needed
  private async shouldRedirectToVerification(command: BotCommand, user?: User): Promise<boolean> {
    // If command is allowed without verification, no need to redirect
    if (this.isCommandAllowedWithoutVerification(command)) {
      return false;
    }
    
    // If user doesn't exist or isn't verified, redirect to verification
    return !user || !user.isVerified;
  }

  private setupCommandHandlers() {
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
      } else if (data.startsWith('/payment_info')) {
        command = { type: 'payment_info' };
      } else if (data.startsWith('/payment_method')) {
        command = { type: 'payment_method' };
      } else if (data.startsWith('/withdrawal_request')) {
        command = { type: 'withdrawal_request' };
      }
      
      if (command) {
        // Check if user needs to verify first (except for allowed commands)
        if (await this.shouldRedirectToVerification(command, user)) {
          const verificationResponse = await processCommand({ type: 'start' }, user);
          await this.sendBotResponse(chatId, verificationResponse);
          
          // Answer callback query to remove loading state
          await this.bot.answerCallbackQuery(query.id);
          return;
        }
        
        const response = await processCommand(command, user);
        await this.sendBotResponse(chatId, response);
        
        // Answer callback query to remove loading state
        await this.bot.answerCallbackQuery(query.id);
      }
    });
  }

  private async sendBotResponse(chatId: number, response: any) {
    try {
      // Special handling for withdrawal success or withdrawal request
      if ((response.type === 'success' && response.message.includes('Withdrawal of')) || 
          (response.type === 'success' && response.message.includes('withdrawal request')) ||
          (response.message && response.message.includes('Withdrawal Request Form')) ||
          (response.data?.requestType === 'bank_details_form')) {
        
        // Forward withdrawal request to admin groups
        const adminGroups = ['-1002490760080', '-1002655638682'];
        const username = response.data?.username || "Unknown user";
        const balance = response.data?.balance || 0;
        let amount;
        if (response.type === 'success' && response.message.includes('₦')) {
          amount = response.message.match(/₦(\d+)/)?.[1] || "unknown amount";
        } else if (response.data?.requestType === 'bank_details_form') {
          amount = "Bank details requested";
        } else {
          amount = "Form requested";
        }
        
        const adminMessage = `🔔 *NEW WITHDRAWAL REQUEST* 🔔\n\n👤 *User:* ${username}\n💰 *Amount:* ₦${amount}\n💵 *Remaining Balance:* ₦${balance}\n⏱️ *Request Time:* ${new Date().toLocaleString()}\n\n✅ Request has been automatically forwarded to this channel.`;
        
        // Forward to admin groups
        for (const groupId of adminGroups) {
          try {
            await this.bot.sendMessage(groupId, adminMessage, {
              parse_mode: 'Markdown',
            });
            console.log(`[telegram-bot] Successfully forwarded withdrawal request for ₦${amount} from ${username} to group ${groupId}`);
          } catch (err) {
            console.error(`[telegram-bot] Failed to forward withdrawal to group ${groupId}:`, err);
          }
        }
      }
      
      // Send response to user
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
