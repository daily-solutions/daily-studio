import React from 'react';
import { Message } from '@/states/messagesState';
import Linkify from 'linkify-react';

import { cn } from '@/lib/utils';

export function ChatMessage({
  message,
  sameSender,
}: {
  message: Message;
  sameSender: boolean;
}) {
  const bgColor = message.isLocal ? 'bg-foreground/90' : 'bg-muted';
  const textColor = message.isLocal ? 'text-background' : 'text-default';
  const borderRadius = message.isLocal ? 'rounded-br-none' : 'rounded-bl-none';

  return (
    <div
      className={cn(
        'break-words rounded-md p-3 text-sm',
        bgColor,
        textColor,
        borderRadius,
        message.isLocal ? 'ml-4' : 'mr-4',
        sameSender ? 'mt-1' : 'mt-2',
      )}
    >
      {!sameSender && (
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-xs font-semibold">
            {message.userName} {message.isLocal && '(You)'}
          </h3>
          <p className="text-xs">
            {message.receivedAt.toLocaleTimeString([], {
              timeStyle: 'short',
            })}
          </p>
        </div>
      )}
      <Linkify options={{ target: '_blank', className: 'text-sm underline' }}>
        {message.message.split('\n').map((m, index) => (
          <React.Fragment key={`line-${m}`}>
            {index > 0 && <br />}
            {m}
          </React.Fragment>
        ))}
      </Linkify>
    </div>
  );
}
