import { useEffect, useRef } from 'react';
import TelegramHeader from './TelegramHeader';
import BotMessage from './BotMessage';
import UserMessage from './UserMessage';
import MessageInput from './MessageInput';

interface ChatInterfaceProps {
  botName: string;
  userCount: string;
  messages: Array<{
    id: number;
    type: 'bot' | 'user';
    content: any;
    timestamp: string;
  }>;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: (text: string) => void;
  quickCommands: Array<{ text: string; display: string }>;
}

export default function ChatInterface({
  botName,
  userCount,
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  quickCommands
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listen for bot:sendCommand events from button clicks
  useEffect(() => {
    const handleBotCommand = (e: any) => {
      const { command } = e.detail;
      if (command) {
        onSendMessage(command);
      }
    };

    window.addEventListener('bot:sendCommand', handleBotCommand);
    
    return () => {
      window.removeEventListener('bot:sendCommand', handleBotCommand);
    };
  }, [onSendMessage]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Telegram header */}
      <TelegramHeader botName={botName} userCount={userCount} />
      
      {/* Messages area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.type === 'bot' ? (
                <BotMessage content={message.content} timestamp={message.timestamp} />
              ) : (
                <UserMessage content={message.content} timestamp={message.timestamp} />
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input area */}
      <MessageInput
        value={inputValue}
        onChange={onInputChange}
        onSendMessage={onSendMessage}
        quickCommands={quickCommands}
      />
    </div>
  );
}