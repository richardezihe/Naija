import { BotCommand, BotResponse, InsertUser, User } from '@shared/schema';
import { storage, MemStorage } from './storage';

const EARNINGS_PER_REFERRAL = 100; // ₦100 per referral

export async function processCommand(command: BotCommand, user?: User): Promise<BotResponse> {
  switch (command.type) {
    case 'start':
      return handleStartCommand(command.referralCode, user);
    case 'balance':
      return handleBalanceCommand(user);
    case 'stats':
      return handleStatsCommand(user);
    case 'refer':
      return handleReferCommand(user);
    case 'withdraw':
      return handleWithdrawCommand(user, command.amount);
    case 'help':
      return handleHelpCommand();
    case 'joined':
      return handleJoinedCommand(user);
    default:
      return { 
        type: 'error', 
        message: 'Unknown command. Type /help to see available commands.' 
      };
  }
}

async function handleStartCommand(referralCode?: string, existingUser?: User): Promise<BotResponse> {
  if (existingUser) {
    return {
      type: 'text',
      message: '✨ Welcome back to NaijaValue Bot ✨\n\nYou are already registered with us. Use the commands below to navigate:',
      buttons: [
        [{ text: '💰 Balance', data: '/balance' }, { text: '📊 Stats', data: '/stats' }],
        [{ text: '🔗 Refer', data: '/refer' }, { text: '💳 Withdraw', data: '/withdraw' }]
      ]
    };
  }

  return {
    type: 'text',
    message: '✨ Welcome to NaijaValue Bot ✨\n\nMake money by referring new members to our community! 💰\n\nWhat We Offer:\n• Earn ₦1000 for each referral\n• Weekend withdrawals\n• Real-time tracking\n• 24/7 automated system\n\nStart earning today! 💰\nUse /refer to get your referral link\nUse /help to see all command',
    buttons: [
      [
        { text: '📋 Join Channel', url: 'https://t.me/naijavaluechannel' },
        { text: '👥 Join Community', url: 'https://t.me/naijavaluegroup' }
      ],
      [{ text: '✅ I\'ve Joined Both', data: '/joined' }]
    ]
  };
}

async function handleBalanceCommand(user?: User): Promise<BotResponse> {
  if (!user) {
    return { 
      type: 'error', 
      message: 'You need to register first. Use /start to begin.' 
    };
  }

  return {
    type: 'balance',
    message: `💰 Your Balance 💰\n\nCurrent Balance: ₦${user.balance}\n\n📊 Summary:\n• Total Referrals: ${user.totalReferrals}\n• Earnings per Referral: ₦${EARNINGS_PER_REFERRAL}\n• Total Earnings: ₦${user.totalEarnings}\n\n💳 To withdraw, use:\n/withdraw [amount]\n\nNote: Withdrawals are processed on weekends only (Saturday & Sunday).`
  };
}

async function handleStatsCommand(user?: User): Promise<BotResponse> {
  if (!user) {
    return { 
      type: 'error', 
      message: 'You need to register first. Use /start to begin.' 
    };
  }

  const rank = await storage.getUserRank(user.id);

  return {
    type: 'stats',
    message: `📊 Your Stats 📊\n\n👤 Username: ${user.username}\n💰 Balance: ₦${user.balance}\n🔗 Referrals: ${user.totalReferrals}\n🏆 Rank: #${rank}\n\n📝 Performance:\n• Earnings per Referral: ₦${EARNINGS_PER_REFERRAL}\n• Total Earnings: ₦${user.totalEarnings}\n\n✨ Share your referral link to earn more!\nUse /refer to get your link.`
  };
}

async function handleReferCommand(user?: User): Promise<BotResponse> {
  if (!user) {
    return { 
      type: 'error', 
      message: 'You need to register first. Use /start to begin.' 
    };
  }

  const referralLink = `https://t.me/NaijaValueorg_bot?start=${user.referralCode}`;

  return {
    type: 'referral',
    message: `🔗 Your Referral Link 🔗\n\n${referralLink}\n\n💰 Share this link with your friends to earn rewards!\n\n📊 You currently have ${user.totalReferrals} confirmed referrals.\n\nHow it works:\n1. Share your unique referral link\n2. Friends join using your link\n3. You earn rewards for each verified referral`
  };
}

async function handleWithdrawCommand(user?: User, amount?: number): Promise<BotResponse> {
  if (!user) {
    return { 
      type: 'error', 
      message: 'You need to register first. Use /start to begin.' 
    };
  }

  // Check if today is weekend (Saturday or Sunday)
  const today = new Date().getDay();
  const isWeekend = today === 0 || today === 6;

  if (!isWeekend) {
    return {
      type: 'error',
      message: '❌ Withdrawals are only processed on weekends (Saturday & Sunday).\n\nPlease check back on weekend!'
    };
  }

  if (!amount || amount <= 0) {
    return {
      type: 'error',
      message: '❌ Please specify a valid amount to withdraw.\n\nExample: /withdraw 1000'
    };
  }

  if (amount > user.balance) {
    return {
      type: 'error',
      message: `❌ Insufficient balance. Your current balance is ₦${user.balance}.`
    };
  }

  // Process the withdrawal
  await storage.createWithdrawal({ userId: user.id, amount });
  await storage.updateBalance(user.id, -amount);

  return {
    type: 'success',
    message: `✅ Withdrawal of ₦${amount} has been processed successfully.\n\nYour new balance: ₦${user.balance - amount}`
  };
}

async function handleHelpCommand(): Promise<BotResponse> {
  return {
    type: 'text',
    message: '📋 Available Commands:\n\n/start - Start or restart the bot\n/balance - Check your current balance\n/stats - View your referral statistics\n/refer - Get your referral link\n/withdraw [amount] - Request a withdrawal (weekends only)\n/help - Show this help message'
  };
}

async function handleJoinedCommand(user?: User): Promise<BotResponse> {
  if (user) {
    return {
      type: 'success',
      message: '✅ Thank you for joining our community!\n\nYou now have full access to all bot features including:\n• Referring friends\n• Checking your balance\n• Requesting withdrawals\n\nUse the buttons below to navigate:',
      buttons: [
        [{ text: '💰 Balance', data: '/balance' }, { text: '📊 Stats', data: '/stats' }],
        [{ text: '🔗 Refer', data: '/refer' }, { text: '💳 Withdraw', data: '/withdraw' }]
      ]
    };
  }

  return {
    type: 'text',
    message: 'Please use /start to register first.'
  };
}

export async function registerUser(telegramId: string, username: string, referralCode?: string): Promise<User> {
  // Check if user exists
  let user = await storage.getUserByTelegramId(telegramId);
  
  if (user) {
    return user;
  }

  // Generate a unique referral code
  const newReferralCode = MemStorage.generateReferralCode();
  
  const userData: InsertUser = {
    username,
    telegramId,
    referralCode: newReferralCode,
    referredBy: referralCode
  };

  // Create new user
  user = await storage.createUser(userData);
  
  // If referred by someone, update the referrer's stats
  if (referralCode) {
    const referrer = await storage.getUserByReferralCode(referralCode);
    if (referrer) {
      await storage.addReferral(referrer.id);
      await storage.updateBalance(referrer.id, EARNINGS_PER_REFERRAL);
    }
  }
  
  return user;
}
