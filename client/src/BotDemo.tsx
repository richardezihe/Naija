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
          message: '📋 Available Commands:\n\n/start - Start or restart the bot\n/balance - Check your current balance\n/stats - View your referral statistics\n/refer - Get your referral link\n/withdraw [amount] - Request a withdrawal (weekends only)\n/help - Show this help message'
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
      botResponse = {
        id: messages.length + 2,
        type: 'bot',
        content: {
          type: 'error',
          message: '❌ Withdrawals are only processed on weekends (Saturday & Sunday).\n\nPlease check back on weekend!'
        },
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
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
    { text: '/help', display: '/help' }
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
