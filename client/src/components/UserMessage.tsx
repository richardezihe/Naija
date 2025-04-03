interface UserMessageProps {
  content: string;
  timestamp: string;
}

export default function UserMessage({ content, timestamp }: UserMessageProps) {
  return (
    <div className="flex items-start justify-end">
      <div className="bg-user-msg rounded-lg px-4 py-3 max-w-xs sm:max-w-md">
        <div className="space-y-2">
          <p className="font-mono">{content}</p>
        </div>
        <div className="text-right text-xs text-gray-300 mt-1 flex items-center justify-end">
          {timestamp}
          <i className="fas fa-check ml-1 text-blue-400"></i>
        </div>
      </div>
    </div>
  );
}
