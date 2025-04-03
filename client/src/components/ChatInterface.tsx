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
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-dark-bg text-text-primary">
      <TelegramHeader botName={botName} userCount={userCount} />
      
      <div className="flex-grow overflow-y-auto px-4 py-2 bg-dark-bg" id="chat-container">
        <div className="max-w-lg mx-auto space-y-4 mb-20">
          {/* Date separator for the chat */}
          <div className="text-center text-gray-400 text-sm py-2">April 2</div>
          
          {/* Render messages */}
          {messages.map(message => (
            message.type === 'bot' ? (
              <BotMessage 
                key={message.id} 
                content={message.content} 
                timestamp={message.timestamp} 
              />
            ) : (
              <UserMessage 
                key={message.id} 
                content={message.content} 
                timestamp={message.timestamp} 
              />
            )
          ))}
          
          {/* Invisible element to scroll to */}
          <div ref={chatEndRef} />
        </div>
      </div>
      
      <MessageInput
        value={inputValue}
        onChange={onInputChange}
        onSendMessage={onSendMessage}
        quickCommands={quickCommands}
      />
      
      {/* Telegram Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-dark-bg border-t border-gray-800 flex justify-around py-3">
        <button className="flex flex-col items-center justify-center">
          <i className="far fa-comment-dots text-gray-400 text-xl"></i>
        </button>
        <button className="flex flex-col items-center justify-center">
          <i className="fas fa-users text-gray-400 text-xl"></i>
        </button>
        <button className="flex flex-col items-center justify-center">
          <i className="fas fa-search text-gray-400 text-xl"></i>
        </button>
        <button className="flex flex-col items-center justify-center">
          <i className="fas fa-cog text-gray-400 text-xl"></i>
        </button>
      </nav>
    </div>
  );
}
