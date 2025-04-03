import { KeyboardEvent } from 'react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSendMessage: (text: string) => void;
  quickCommands: Array<{ text: string; display: string }>;
}

export default function MessageInput({ 
  value, 
  onChange, 
  onSendMessage,
  quickCommands 
}: MessageInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onSendMessage(value);
    }
  };

  return (
    <div className="sticky bottom-0 bg-dark-bg border-t border-gray-800 p-2 pb-16">
      <div className="flex items-center bg-message-bg rounded-full px-4 py-2">
        <button className="text-gray-400 mr-2">
          <i className="far fa-smile"></i>
        </button>
        <input 
          type="text" 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message" 
          className="bg-transparent flex-1 focus:outline-none text-white" 
        />
        <div className="flex items-center space-x-2 ml-2">
          <button className="text-gray-400">
            <i className="fas fa-paperclip"></i>
          </button>
          <button 
            className="text-gray-400"
            onClick={() => value.trim() && onSendMessage(value)}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
      
      {/* Quick Command Buttons */}
      <div className="flex justify-between mt-2 px-2">
        <div className="grid grid-cols-4 gap-2 w-full">
          {quickCommands.map((cmd, index) => (
            <button 
              key={index}
              className="bg-user-msg text-white py-1 px-3 rounded-full text-sm whitespace-nowrap"
              onClick={() => onSendMessage(cmd.text)}
            >
              {cmd.display}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
