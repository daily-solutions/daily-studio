import React, { useEffect, useRef } from 'react';
import { useMessages } from '@/states/messagesState';

import { EmptyState } from '@/components/ui/empty-state';
import { ChatInput } from '@/components/room/sidebar/chat/ChatInput';
import { ChatMessage } from '@/components/room/sidebar/chat/ChatMessage';

export function Chat() {
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [messages] = useMessages();

  useEffect(() => {
    const messageEl = messagesRef.current;
    if (!messageEl) return;

    messageEl.scrollTop = messageEl?.scrollHeight;
  }, [messages]);

  return (
    <div className="relative flex h-full max-h-[calc(100%-4rem)] flex-col justify-between p-4">
      <div
        ref={messagesRef}
        className="flex max-h-[calc(100%-4rem)] flex-col overflow-y-auto"
      >
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <ChatMessage
              message={message}
              sameSender={message.fromId === messages?.[index - 1]?.fromId}
              key={message.id}
            />
          ))
        ) : (
          <EmptyState
            icon="chat"
            title="It's empty in here!"
            description="Would you like to say something?"
          />
        )}
      </div>
      <ChatInput />
    </div>
  );
}
