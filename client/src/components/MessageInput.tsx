import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Send, Command } from 'lucide-react';

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
  const [showCommands, setShowCommands] = useState(false);

  const handleSend = () => {
    if (value.trim()) {
      onSendMessage(value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCommandClick = (command: string) => {
    onSendMessage(command);
    setShowCommands(false);
  };

  return (
    <div className="border-t border-gray-700 p-3 bg-gray-800">
      {/* Quick commands */}
      {showCommands && (
        <div className="mb-2 p-2 bg-gray-800 rounded-lg border border-gray-700 grid grid-cols-2 gap-1 shadow-lg">
          {quickCommands.map((cmd, i) => (
            <Button 
              key={i} 
              size="sm" 
              variant="outline" 
              className="justify-start text-xs"
              onClick={() => handleCommandClick(cmd.text)}
            >
              {cmd.display}
            </Button>
          ))}
        </div>
      )}
      
      {/* Input bar */}
      <div className="flex items-center space-x-2">
        <Button
          size="icon"
          variant="ghost"
          className="text-gray-400 hover:text-white hover:bg-gray-700"
          onClick={() => setShowCommands(!showCommands)}
        >
          <Command className="h-5 w-5" />
        </Button>
        
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        />
        
        <Button
          size="icon"
          disabled={!value.trim()}
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}