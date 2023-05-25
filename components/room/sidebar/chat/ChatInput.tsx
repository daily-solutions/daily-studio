import React, { useCallback, useRef } from 'react';
import { useMessages } from '@/states/messagesState';
import {
  useDaily,
  useLocalSessionId,
  useParticipantProperty,
} from '@daily-co/daily-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';

export function ChatInput() {
  const daily = useDaily();
  const formRef = useRef<HTMLFormElement | null>(null);

  const localSessionId = useLocalSessionId();
  const userName = useParticipantProperty(localSessionId, 'user_name');
  const [, setMessages] = useMessages();

  const sendAppMessage = useCallback(
    (ev: React.FormEvent<HTMLFormElement>) => {
      if (!daily || !localSessionId) return;

      ev.preventDefault();

      const formData = new FormData(formRef.current as HTMLFormElement);
      const message = formData.get('message') as string;

      const id = crypto.randomUUID();

      daily.sendAppMessage({
        event: 'message',
        id,
        userName,
        message,
      });
      setMessages((messages) => [
        ...messages,
        {
          id,
          userName,
          message,
          receivedAt: new Date(),
          fromId: localSessionId,
          isLocal: true,
        },
      ]);
      formRef.current?.reset();
    },
    [daily, localSessionId, setMessages, userName]
  );

  return (
    <div className="absolute bottom-0 left-0 z-30 w-full p-4">
      <form ref={formRef} onSubmit={sendAppMessage}>
        <div className="relative">
          <Input
            name="message"
            className="h-12 pr-10"
            placeholder="Enter your message here"
          />
          <div className="absolute right-2 top-2">
            <Button type="submit" size="auto" variant="ghost">
              <Icons.send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
