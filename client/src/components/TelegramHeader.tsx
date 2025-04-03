interface TelegramHeaderProps {
  botName: string;
  userCount: string;
}

export default function TelegramHeader({ botName, userCount }: TelegramHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-dark-bg border-b border-gray-800 px-4 py-2 flex items-center">
      <button className="text-white mr-4">
        <i className="fas fa-arrow-left"></i>
      </button>
      
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center bg-green-800 text-white">
            <span className="text-xl font-bold">N</span>
          </div>
        </div>
        <div>
          <h1 className="font-semibold text-lg">{botName}</h1>
          <p className="text-xs text-text-secondary">{userCount}</p>
        </div>
      </div>
      
      <div className="ml-auto">
        <button className="text-white">
          <i className="fas fa-ellipsis-v"></i>
        </button>
      </div>
    </header>
  );
}
