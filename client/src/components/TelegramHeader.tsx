
import { Button } from "./ui/button";

interface TelegramHeaderProps {
  botName: string;
  userCount: string;
}

export default function TelegramHeader({ botName, userCount }: TelegramHeaderProps) {
  return (
    <div className="bg-gray-800 p-3 border-b border-gray-700 flex items-center">
      <div className="flex flex-col">
        <div className="font-bold text-lg">{botName}</div>
        <div className="text-xs text-gray-400">{userCount}</div>
      </div>
      <div className="ml-auto flex items-center space-x-3">
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
