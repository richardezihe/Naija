import { parseButtonsFromContent } from '../utils/messageUtils';
import { Button } from './ui/button';

interface ButtonType {
  text: string;
  data?: string;
  url?: string;
}

interface BotMessageProps {
  content: any;
  timestamp: string;
}

export default function BotMessage({ content, timestamp }: BotMessageProps) {
  // Determine message type and apply appropriate styling
  let messageClass = 'bg-gray-800 text-white';
  if (content.type === 'error') {
    messageClass = 'bg-red-900 text-white';
  } else if (content.type === 'success') {
    messageClass = 'bg-green-900 text-white';
  } else if (content.type === 'warning') {
    messageClass = 'bg-yellow-800 text-white';
  } else if (content.type === 'balance' || content.type === 'stats') {
    messageClass = 'bg-blue-900 text-white';
  } else if (content.type === 'referral') {
    messageClass = 'bg-purple-900 text-white';
  }

  // Parse the buttons from the content if they exist
  const buttonRows = parseButtonsFromContent(content);

  return (
    <div className="flex w-full">
      <div className="flex flex-col max-w-[80%]">
        <div className={`rounded-lg p-3 ${messageClass}`}>
          <div className="whitespace-pre-line">{content.message}</div>
        </div>
        
        {/* Buttons grid if present */}
        {buttonRows.length > 0 && (
          <div className="mt-2 grid gap-1">
            {buttonRows.map((buttonRow: ButtonType[], rowIndex: number) => (
              <div key={rowIndex} className="flex flex-wrap gap-1">
                {buttonRow.map((button: ButtonType, btnIndex: number) => (
                  <Button
                    key={btnIndex}
                    variant="outline"
                    size="sm"
                    className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                    asChild={!!button.url}
                    onClick={() => {
                      if (button.data) {
                        // This would trigger the parent component to handle the command
                        console.log("Button clicked with command:", button.data);
                        
                        // Get parent to simulate sending this command
                        const customEvent = new CustomEvent("bot:sendCommand", {
                          detail: { command: button.data }
                        });
                        window.dispatchEvent(customEvent);
                      }
                    }}
                  >
                    {button.url ? (
                      <a href={button.url} target="_blank" rel="noopener noreferrer">
                        {button.text}
                      </a>
                    ) : (
                      <span>{button.text}</span>
                    )}
                  </Button>
                ))}
              </div>
            ))}
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-1">{timestamp}</div>
      </div>
    </div>
  );
}