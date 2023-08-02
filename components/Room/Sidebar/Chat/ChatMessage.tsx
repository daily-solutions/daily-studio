import { Message } from '@/states/messagesState';

import { cn } from '@/lib/utils';

export function ChatMessage({
  message,
  sameSender,
}: {
  message: Message;
  sameSender: boolean;
}) {
  const bgColor = message.isLocal ? 'bg-muted' : 'bg-accent';

  return (
    <div
      className={cn(
        'flex flex-col rounded-md p-3',
        bgColor,
        sameSender ? 'mt-1' : 'mt-2'
      )}
    >
      {!sameSender && (
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-xs">
            {message.userName} {message.isLocal && '(You)'}
          </h3>
          <p className="text-xs">
            {message.receivedAt.toLocaleTimeString([], { timeStyle: 'short' })}
          </p>
        </div>
      )}
      <div className="break-words">{message.message}</div>
    </div>
  );
}
