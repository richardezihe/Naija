import { BotCommand, BotResponse, InsertUser, User } from '@shared/schema';
import { storage, MemStorage } from './storage';

const EARNINGS_PER_REFERRAL = 1000; // ₦1000 per referral

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
    case 'payment_info':
      return handlePaymentInfoCommand(user);
    case 'payment_method':
      return handlePaymentMethodCommand(user);
    case 'withdrawal_request':
      return handleWithdrawalRequestCommand(user);
    case 'earn_bonus':
      return handleEarnBonusCommand(user);
    default:
      return { 
        type: 'error', 
        message: 'Unknown command. Type /help to see available commands.' 
      };
  }
}

async function handleStartCommand(referralCode?: string, existingUser?: User): Promise<BotResponse> {
  // Only show verification message for new or unverified users
  if (!existingUser || !existingUser.isVerified) {
    return {
      type: 'warning',
      message: '⚠️ MANDATORY REQUIREMENT ⚠️\n\nYou must join our channel and community group to use this bot.\n\nPlease use the buttons below to join, then click "✅ I\'ve Joined Both"',
      buttons: [
        [
          { text: '📋 Join Channel', url: 'https://t.me/naijavalueofficial' },
          { text: '👥 Join Community', url: 'https://t.me/naijavaluecommunity' }
        ],
        [{ text: '✅ I\'ve Joined Both', data: '/joined' }]
      ]
    };
  }

  // For verified users, show welcome message with tour option
  return {
    type: 'text',
    message: '✨ Welcome to 𝐍𝐀𝐈𝐉𝐀 𝐕𝐀𝐋𝐔𝐄 Bot ✨\n\nMake money by referring new members to our community! 💰\n\nWhat We Offer:\n• Earn ₦1000 for each referral\n• Weekend withdrawals\n• Real-time tracking\n• 24/7 automated system\n\nWould you like a quick tour of our features? 🎯',
    buttons: [
      [{ text: '🎯 Start Tour', data: '/tour_start' }],
      [{ text: '💰 Balance', data: '/balance' }, { text: '💳 Withdraw', data: '/withdraw' }],
      [{ text: '🔗 Invite Friends', data: '/refer' }, { text: '📊 Stats', data: '/stats' }],
      [{ text: '💵 Payment Info', data: '/payment_info' }, { text: '💳 Payment Method', data: '/payment_method' }]
    ]
  };
}

async function handleTourCommand(step: number = 1, user?: User): Promise<BotResponse> {
  if (!user) {
    return { 
      type: 'error', 
      message: 'You need to register first. Use /start to begin.' 
    };
  }

  switch(step) {
    case 1:
      return {
        type: 'text',
        message: '1️⃣ Let\'s start with your Balance!\n\nClick the Balance button to check:\n• Your current earnings\n• Total referrals\n• Earnings per referral',
        buttons: [
          [{ text: '💰 Check Balance', data: '/balance' }],
          [{ text: '➡️ Next Tip', data: '/tour_2' }],
          [{ text: '❌ End Tour', data: '/start' }]
        ]
      };
    case 2:
      return {
        type: 'text',
        message: '2️⃣ Ready to earn? Let\'s invite friends!\n\nThe Invite Friends button will:\n• Generate your unique referral link\n• Track your referrals\n• Show your earnings',
        buttons: [
          [{ text: '🔗 Try Inviting', data: '/refer' }],
          [{ text: '➡️ Next Tip', data: '/tour_3' }],
          [{ text: '❌ End Tour', data: '/start' }]
        ]
      };
    case 3:
      return {
        type: 'text',
        message: '3️⃣ Time to get paid! 💰\n\nWithdrawals are processed on weekends.\nCheck Payment Info to see:\n• Available payment methods\n• Minimum withdrawal amount\n• Processing times',
        buttons: [
          [{ text: '💵 Payment Info', data: '/payment_info' }],
          [{ text: '➡️ Next Tip', data: '/tour_4' }],
          [{ text: '❌ End Tour', data: '/start' }]
        ]
      };
    case 4:
      return {
        type: 'text',
        message: '4️⃣ Track your success! 📊\n\nThe Stats button shows:\n• Your total referrals\n• Overall earnings\n• Current rank\n\nThat\'s it! You\'re ready to start earning! 🎉',
        buttons: [
          [{ text: '📊 View Stats', data: '/stats' }],
          [{ text: '🏁 Finish Tour', data: '/start' }]
        ]
      };
    default:
      return handleStartCommand(undefined, user);
  }
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

  // In a real implementation, this would forward the request to group channels
  // Group IDs: -1002490760080, -1002655638682
  console.log(`[TELEGRAM-BOT] Forwarding withdrawal request to group channels: User ${user.username} requested withdrawal of ₦${amount}`);

  return {
    type: 'success',
    message: `✅ Withdrawal of ₦${amount} has been processed successfully.\n\nYour new balance: ₦${user.balance - amount}\n\nYour request has been forwarded to our admin team and will be processed within 12-24 hours.`,
    data: {
      username: user.username,
      balance: user.balance - amount
    }
  };
}

async function handleHelpCommand(): Promise<BotResponse> {
  return {
    type: 'text',
    message: '📋 Available Commands:\n\n/start - Start or restart the bot\n/balance - Check your current balance\n/stats - View your referral statistics\n/refer - Get your referral link\n/withdraw [amount] - Request a withdrawal (weekends only)\n/payment_info - View payment methods and info\n/payment_method - View account details for payments\n/withdrawal_request - Submit a withdrawal request\n/earn_bonus - Earn 100 naira bonus (available every minute)\n/help - Show this help message',
    buttons: [
      [{ text: '💰 Balance', data: '/balance' }, { text: '💳 Withdraw', data: '/withdraw' }],
      [{ text: '🔗 Invite Friends', data: '/refer' }, { text: '📊 Stats', data: '/stats' }],
      [{ text: '💵 Payment Info', data: '/payment_info' }, { text: '💳 Payment Method', data: '/payment_method' }],
      [{ text: '📝 Withdrawal Request', data: '/withdrawal_request' }, { text: '/Earn bonus', data: '/earn_bonus' }]
    ]
  };
}

async function handleJoinedCommand(user?: User): Promise<BotResponse> {
  if (!user) {
    return {
      type: 'text',
      message: 'Please use /start to register first.'
    };
  }

  // Mark user as verified
  // In a real implementation, this would check with Telegram API if user has joined channels
  // For this implementation, we'll assume they have if they click the verification button
  await storage.updateVerificationStatus(user.id, true);

  return {
    type: 'text',
    message: '✨ Welcome to 𝐍𝐀𝐈𝐉𝐀 𝐕𝐀𝐋𝐔𝐄 Bot ✨\n\nMake money by referring new members to our community! 💰\n\nWhat We Offer:\n• Earn ₦1000 for each referral\n• Weekend withdrawals\n• Real-time tracking\n• 24/7 automated system\n\nStart earning today! 💰\nUse the buttons below to navigate:',
    buttons: [
      [{ text: '💰 Balance', data: '/balance' }, { text: '💳 Withdraw', data: '/withdraw' }],
      [{ text: '🔗 Invite Friends', data: '/refer' }, { text: '📊 Stats', data: '/stats' }],
      [{ text: '💵 Payment Info', data: '/payment_info' }, { text: '💳 Payment Method', data: '/payment_method' }],
      [{ text: '📝 Withdrawal Request', data: '/withdrawal_request' }, { text: '📣 Join Channel', url: 'https://t.me/naijavalueofficial' }]
    ]
  };
}

async function handlePaymentInfoCommand(user?: User): Promise<BotResponse> {
  if (!user) {
    return { 
      type: 'error', 
      message: 'You need to register first. Use /start to begin.' 
    };
  }

  return {
    type: 'text',
    message: '💵 Payment Information 💵\n\n📝 Available Payment Methods:\n• Bank Transfer\n• Opay\n• Palmpay\n\n⏱️ Processing Time:\n• Withdrawals are processed on weekends only (Saturday & Sunday)\n• Processing time: 12-24 hours\n\n📋 Minimum Withdrawal: ₦1000\n\n📊 Withdrawal Status:\n• Pending - Your request is being processed\n• Completed - Payment has been sent\n• Rejected - Request was declined (rare)\n\n🆘 Need help? Contact our support: @naijavaluesupport',
    buttons: [
      [{ text: '💳 Payment Method', data: '/payment_method' }],
      [{ text: '📝 Request Withdrawal', data: '/withdrawal_request' }],
      [{ text: '🏠 Return to Menu', data: '/start' }]
    ]
  };
}

async function handlePaymentMethodCommand(user?: User): Promise<BotResponse> {
  if (!user) {
    return { 
      type: 'error', 
      message: 'You need to register first. Use /start to begin.' 
    };
  }

  return {
    type: 'text',
    message: '💳 Payment Method 💳\n\nAccount Details:\n\n📱 Opay\n• Account Number: 913 817 9663\n• Account Name: TEMPLE NWACHI DAN-NWAOGU\n\n📝 Note:\n• All payments are processed manually\n• Transactions are handled on weekends only\n• Minimum withdrawal: ₦1000\n\n📌 Please ensure your account details are correct before submitting a withdrawal request.',
    buttons: [
      [{ text: '💵 Payment Info', data: '/payment_info' }],
      [{ text: '📝 Request Withdrawal', data: '/withdrawal_request' }],
      [{ text: '🏠 Return to Menu', data: '/start' }]
    ]
  };
}

// Store last bonus claim time for each user in memory
const lastBonusClaim = new Map<number, number>();

async function handleEarnBonusCommand(user?: User): Promise<BotResponse> {
  if (!user) {
    return { 
      type: 'error', 
      message: 'You need to register first. Use /start to begin.' 
    };
  }

  const now = Date.now();
  const lastClaim = lastBonusClaim.get(user.id) || 0;
  const timeDiff = now - lastClaim;
  const timeLeft = Math.ceil((60000 - timeDiff) / 1000); // Convert to seconds

  if (timeDiff < 60000) { // 1 minute cooldown
    return {
      type: 'error',
      message: `⏳ Please wait ${timeLeft} seconds before claiming another bonus.\n\nCurrent Balance: ₦${user.balance}`,
      buttons: [
        [{ text: '💰 Check Balance', data: '/balance' }],
        [{ text: '🏠 Return to Menu', data: '/start' }]
      ]
    };
  }

  // Add 100 naira bonus and update last claim time
  const updatedUser = await storage.updateBalance(user.id, 100);
  lastBonusClaim.set(user.id, now);

  return {
    type: 'success',
    message: `✅ Bonus Added Successfully!\n\n+₦100 has been added to your balance.\n\nNew Balance: ₦${updatedUser?.balance || user.balance + 100}\n\nYou can earn again in 1 minute! ⏱️`,
    buttons: [
      [{ text: '💰 Check Balance', data: '/balance' }],
      [{ text: '🎁 Claim Again', data: '/earn_bonus' }],
      [{ text: '🏠 Return to Menu', data: '/start' }]
    ]
  };
}

async function handleWithdrawalRequestCommand(user?: User): Promise<BotResponse> {
  if (!user) {
    return { 
      type: 'error', 
      message: 'You need to register first. Use /start to begin.' 
    };
  }

  // Check if today is weekend (Saturday or Sunday)
  const today = new Date().getDay();
  const isWeekend = today === 0 || today === 6;

  if (isWeekend) {
    // On weekends, request bank details

    // Log this action for debugging in a real implementation
    console.log(`[commands] User ${user.username} requested bank details form for withdrawal`);

    return {
      type: 'text',
      message: `✏️ Now Send Your Correct Bank Details
Format: ACC NUMBER
               BANK NAME
               ACC NAME
⚠️ This Wallet Will Be Used For Future Withdrawals !!

🏦Your Set Bank Details Is:  ⛔ Not Set

💹 It Will Be Used For All Future Withdrawals.`,
      buttons: [
        [{ text: '💰 Check Balance', data: '/balance' }],
        [{ text: '🏠 Return to Menu', data: '/start' }]
      ],
      data: {
        username: user.username,
        balance: user.balance,
        requestType: 'bank_details_form'
      }
    };
  } else {
    // On weekdays, show the withdrawal schedule message
    return {
      type: 'text',
      message: `Hi ${user.username}, 
🔒Withdrawal opens from 12:00am on Saturdays till 10:00pm on Sunday 

To qualify for the next withdrawal, make sure to invite 10 friends or more.

We advise you to keep tapping and inviting friends to earn more cash.`,
      buttons: [
        [{ text: '💰 Check Balance', data: '/balance' }],
        [{ text: '/Earn bonus', data: '/earn_bonus' }]
      ]
    };
  }
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