import { parseButtonsFromContent } from '../utils/messageUtils';

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
  // Function to render message content based on type
  const renderContent = () => {
    const messageType = content.type || 'text';
    
    switch (messageType) {
      case 'warning':
        return (
          <div className="space-y-2">
            <p className="text-error font-medium">{content.message}</p>
          </div>
        );
        
      case 'error':
        return (
          <div className="space-y-2">
            <p>{content.message}</p>
          </div>
        );
        
      case 'success':
        return (
          <div className="space-y-2">
            <p className="text-success font-medium">{content.message}</p>
          </div>
        );
        
      case 'balance':
      case 'stats':
      case 'referral':
        return (
          <div className="space-y-2">
            <p dangerouslySetInnerHTML={{ __html: content.message.replace(/\n/g, '<br>') }} />
          </div>
        );
        
      case 'buttons':
        return (
          <div className="grid grid-cols-2 gap-2">
            {content.buttons[0].map((btn: any, idx: number) => (
              <button 
                key={idx}
                className="bg-dark-bg hover:bg-gray-800 text-white py-2 px-3 rounded flex items-center justify-center"
                onClick={() => btn.url ? window.open(btn.url, '_blank') : null}
              >
                {btn.text}
                {btn.url && <i className="fas fa-external-link-alt ml-2 text-xs"></i>}
              </button>
            ))}
            <div className="col-span-2 mt-2">
              <button className="bg-success hover:bg-green-700 text-white py-2 px-4 rounded w-full flex items-center justify-center">
                {content.buttons[1][0].text}
              </button>
            </div>
          </div>
        );
        
      case 'text':
      default:
        return (
          <div className="space-y-2">
            <p dangerouslySetInnerHTML={{ __html: content.message.replace(/\n/g, '<br>') }} />
          </div>
        );
    }
  };

  // Additional buttons that might be part of the message
  const renderButtons = () => {
    const buttons = parseButtonsFromContent(content);
    
    if (!buttons || buttons.length === 0) return null;
    
    return (
      <div className="mt-3 space-y-2">
        {buttons.map((buttonRow: ButtonType[], rowIndex: number) => (
          <div key={rowIndex} className="flex gap-2">
            {buttonRow.map((button: ButtonType, btnIndex: number) => (
              <button
                key={btnIndex}
                className="bg-user-msg text-white py-1 px-3 rounded-full text-sm"
                onClick={() => button.url ? window.open(button.url, '_blank') : null}
              >
                {button.text}
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-start">
      <div className="bg-message-bg rounded-lg px-4 py-3 max-w-xs sm:max-w-md w-full">
        {renderContent()}
        {renderButtons()}
        <div className="text-right text-xs text-gray-500 mt-1">{timestamp}</div>
      </div>
    </div>
  );
}


