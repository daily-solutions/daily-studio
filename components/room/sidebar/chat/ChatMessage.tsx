import { Message } from '@/states/messagesState';

export function ChatMessage({
  message,
  sameSender,
}: {
  message: Message;
  sameSender: boolean;
}) {
  const bgColor = message.isLocal ? 'bg-accent' : 'bg-muted';

  return (
    <div
      className={`flex flex-col rounded-md p-3 ${bgColor} ${
        sameSender ? 'mt-1' : 'mt-2'
      }`}
    >
      {!sameSender && (
        <div className="flex items-center justify-between">
          <h3 className="text-xs">
            {message.userName} {message.isLocal && '(You)'}
          </h3>
          <p className="text-xs">
            {message.receivedAt.toLocaleTimeString('en-US')}
          </p>
        </div>
      )}
      {message.message}
    </div>
  );
}
