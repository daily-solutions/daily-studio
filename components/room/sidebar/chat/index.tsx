import React, { useEffect, useRef } from 'react';
import { useMessages } from '@/states/messagesState';

import { Icons } from '@/components/icons';
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
    <div className="relative flex h-full flex-col justify-between p-4">
      <div
        ref={messagesRef}
        className="flex h-full max-h-[calc(100%-4rem)] flex-col overflow-y-auto"
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
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex w-full flex-col items-center justify-center gap-y-4 rounded-md bg-muted p-8">
              <div className="w-30 h-30 rounded-full bg-background p-4">
                <Icons.chat className="h-5 w-5" />
              </div>
              <h3 className="text-sm">It&apos;s empty in here!</h3>
              <p className="text-xs">
                Would you like to say something to the group?
              </p>
            </div>
          </div>
        )}
      </div>
      <ChatInput />
    </div>
  );
}
