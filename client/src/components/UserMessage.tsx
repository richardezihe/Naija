interface UserMessageProps {
  content: string;
  timestamp: string;
}

export default function UserMessage({ content, timestamp }: UserMessageProps) {
  return (
    <div className="flex flex-col items-end">
      <div className="bg-blue-600 rounded-lg p-3 max-w-[80%]">
        <div className="whitespace-pre-line">{content}</div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{timestamp}</div>
    </div>
  );
}