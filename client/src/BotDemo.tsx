import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ChatInterface from "./components/ChatInterface";

interface User {
  id: number;
  username: string;
  telegramId: string;
  balance: number;
  totalEarnings: number;
  totalReferrals: number;
  referralCode: string;
  isActive: boolean;
  joinedAt: string;
  rank: number;
}

interface BotMessage {
  id: number;
  type: 'bot' | 'user';
  content: any;
  timestamp: string;
}

export default function BotDemo() {
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  
  // Fetch demo user
  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ['/api/demo/user'],
  });

  // Fetch demo messages
  const { data: demoMessages, isLoading: messagesLoading } = useQuery<BotMessage[]>({
    queryKey: ['/api/demo/messages'],
  });

  // Set messages once loaded
  useEffect(() => {
    if (demoMessages) {
      setMessages(demoMessages);
    }
  }, [demoMessages]);

  // Handle sending a new message
  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message to chat
    const newUserMessage: BotMessage = {
      id: messages.length + 1,
      type: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    
    // Process commands
    let botResponse: BotMessage | null = null;
    
    if (text === '/help' || text === 'Help') {
      botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: {
          type: 'text',
          message: '📋 Available Commands:\n\n/start - Start or restart the bot\n/balance - Check your current balance\n/stats - View your referral statistics\n/refer - Get your referral link\n/withdraw [amount] - Request a withdrawal (weekends only)\n/payment_info - View payment methods and info\n/payment_method - View account details for payments\n/withdrawal_request - Submit a withdrawal request\n/earn_bonus - Earn 100 naira bonus (available every minute)\n/help - Show this help message',
          buttons: [
            [{ text: '💰 Balance', data: '/balance' }, { text: '💳 Withdraw', data: '/withdraw' }],
            [{ text: '🔗 Invite Friends', data: '/refer' }, { text: '📊 Stats', data: '/stats' }],
            [{ text: '💵 Payment Info', data: '/payment_info' }, { text: '💳 Payment Method', data: '/payment_method' }],
            [{ text: '📝 Withdrawal Request', data: '/withdrawal_request' }]
          ]
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } else if (text === '/balance' || text === '💰 Balance') {
      botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: {
          type: 'balance',
          message: '💰 Your Balance 💰\n\nCurrent Balance: ₦0\n\n📊 Summary:\n• Total Referrals: 0\n• Earnings per Referral: ₦1000\n• Total Earnings: ₦0\n\n💳 To withdraw, use:\n/withdraw [amount]\n\nNote: Withdrawals are processed on weekends only (Saturday & Sunday).'
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } else if (text === '/stats' || text === '📊 Stats') {
      botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: {
          type: 'stats',
          message: '📊 Your Stats 📊\n\n👤 Username: Ezihe001\n💰 Balance: ₦0\n🔗 Referrals: 0\n🏆 Rank: #1\n\n📝 Performance:\n• Earnings per Referral: ₦1000\n• Total Earnings: ₦0\n\n✨ Share your referral link to earn more!\nUse /refer to get your link.'
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } else if (text === '/refer' || text === '🔗 Refer') {
      botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: {
          type: 'referral',
          message: '🔗 Your Referral Link 🔗\n\nhttps://t.me/NaijaValueorg_bot?start=Ani68xfC\n\n💰 Share this link with your friends to earn rewards!\n\n📊 You currently have 0 confirmed referrals.\n\nHow it works:\n1. Share your unique referral link\n2. Friends join using your link\n3. You earn rewards for each verified referral'
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } else if (text.startsWith('/withdraw') || text === '💳 Withdraw') {
      // Check if today is weekend (Saturday or Sunday)
      const today = new Date().getDay();
      const isWeekend = today === 0 || today === 6; // 0 = Sunday, 6 = Saturday
      
      if (isWeekend) {
        // On weekends, process withdraw command
        // Extract amount if provided
        let amount = 0;
        if (text.startsWith('/withdraw')) {
          const match = text.match(/\/withdraw\s+(\d+)/);
          if (match && match[1]) {
            amount = parseInt(match[1]);
          }
        }
        
        if (amount >= 1000) {
          // Valid withdrawal amount
          botResponse = {
            id: messages.length + 2,
            type: 'bot',
            content: {
              type: 'success',
              message: `✅ Your withdrawal request for ₦${amount} has been submitted.\n\nStatus: Pending\nProcessing time: 12-24 hours\n\nThank you for using 𝐍𝐀𝐈𝐉𝐀 𝐕𝐀𝐋𝐔𝐄!`,
              buttons: [
                [{ text: '💰 Check Balance', data: '/balance' }],
                [{ text: '🏠 Return to Menu', data: '/start' }]
              ]
            },
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        } else {
          // If no amount or insufficient amount
          botResponse = {
            id: messages.length + 2,
            type: 'bot',
            content: {
              type: 'text',
              message: `📝 Withdrawal Instructions 📝\n\nMinimum withdrawal: ₦1000\nYour current balance: ₦0\n\nTo withdraw, use this format:\n/withdraw [amount]\n\nExample: /withdraw 1000\n\nNote: Include your payment details after the command.`,
              buttons: [
                [{ text: '💰 Check Balance', data: '/balance' }],
                [{ text: '💳 Payment Method', data: '/payment_method' }]
              ]
            },
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
      } else {
        // Not weekend, show error
        botResponse = {
          id: messages.length + 2,
          type: 'bot',
          content: {
            type: 'error',
            message: '❌ Withdrawals are only processed on weekends (Saturday & Sunday).\n\nPlease check back on weekend!'
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
    } else if (text === '/payment_info' || text === '💵 Payment Info') {
      botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: {
          type: 'text',
          message: '💵 Payment Information 💵\n\n📝 Available Payment Methods:\n• Bank Transfer\n• Opay\n• Palmpay\n\n⏱️ Processing Time:\n• Withdrawals are processed on weekends only (Saturday & Sunday)\n• Processing time: 12-24 hours\n\n📋 Minimum Withdrawal: ₦1000\n\n📊 Withdrawal Status:\n• Pending - Your request is being processed\n• Completed - Payment has been sent\n• Rejected - Request was declined (rare)\n\n🆘 Need help? Contact our support: @naijavaluesupport',
          buttons: [
            [{ text: '💳 Payment Method', data: '/payment_method' }],
            [{ text: '📝 Request Withdrawal', data: '/withdrawal_request' }],
            [{ text: '🏠 Return to Menu', data: '/start' }]
          ]
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } else if (text === '/payment_method' || text === '💳 Payment Method') {
      botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: {
          type: 'text',
          message: '💳 Payment Method 💳\n\nAccount Details:\n\n📱 Opay\n• Account Number: 913 817 9663\n• Account Name: TEMPLE NWACHI DAN-NWAOGU\n\n📝 Note:\n• All payments are processed manually\n• Transactions are handled on weekends only\n• Minimum withdrawal: ₦1000\n\n📌 Please ensure your account details are correct before submitting a withdrawal request.',
          buttons: [
            [{ text: '💵 Payment Info', data: '/payment_info' }],
            [{ text: '📝 Request Withdrawal', data: '/withdrawal_request' }],
            [{ text: '🏠 Return to Menu', data: '/start' }]
          ]
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } else if (text === '/earn_bonus' || text === '/Earn bonus') {
      botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: {
          type: 'success',
          message: '✅ Bonus Added Successfully!\n\n+₦100 has been added to your balance.\n\nNew Balance: ₦100\n\nYou can earn again in 1 minute.',
          buttons: [
            [{ text: '💰 Check Balance', data: '/balance' }],
            [{ text: '🏠 Return to Menu', data: '/start' }]
          ]
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } else if (text === '/withdrawal_request' || text === '📝 Withdrawal Request') {
      // Check if today is weekend (Saturday or Sunday)
      const today = new Date().getDay();
      const isWeekend = today === 0 || today === 6; // 0 = Sunday, 6 = Saturday
      
      if (isWeekend) {
        // On weekends, request bank details
        botResponse = {
          id: messages.length + 2,
          type: 'bot',
          content: {
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
            ]
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      } else {
        // On weekdays, show the withdrawal schedule message
        botResponse = {
          id: messages.length + 2,
          type: 'bot',
          content: {
            type: 'text',
            message: `Hi Ezihe001, 
🔒Withdrawal opens from 12:00am on Saturdays till 10:00pm on Sunday 

To qualify for the next withdrawal, make sure to invite 10 friends or more.

We advise you to keep tapping and inviting friends to earn more cash.`,
            buttons: [
              [{ text: '💰 Check Balance', data: '/balance' }],
              [{ text: '/Earn bonus', data: '/earn_bonus' }]
            ]
          },
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
    } else {
      botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: {
          type: 'text',
          message: 'I don\'t understand that command. Type /help to see available commands.'
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }
    
    // Add bot response after a short delay
    setTimeout(() => {
      if (botResponse) {
        setMessages(prev => [...prev, botResponse!]);
      }
    }, 500);
    
    setInputValue("");
  };
  
  // Simulated quick commands for the UI
  const quickCommands = [
    { text: '/balance', display: '/balance' },
    { text: '/stats', display: '/stats' },
    { text: '/refer', display: '/refer' },
    { text: '/help', display: '/help' },
    { text: '/payment_info', display: '/payment_info' },
    { text: '/payment_method', display: '/payment_method' },
    { text: '/withdrawal_request', display: '/withdrawal_request' }
  ];

  if (userLoading || messagesLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-bg text-white">
        <div className="animate-pulse">Loading 𝐍𝐀𝐈𝐉𝐀 𝐕𝐀𝐋𝐔𝐄...</div>
      </div>
    );
  }

  return (
    <ChatInterface
      botName="𝐍𝐀𝐈𝐉𝐀 𝐕𝐀𝐋𝐔𝐄"
      userCount="2 monthly users"
      messages={messages}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onSendMessage={handleSendMessage}
      quickCommands={quickCommands}
    />
  );
}
