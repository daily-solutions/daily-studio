import React, { useCallback, useState } from 'react';
import { Button } from '@/ui/Button';
import { Input } from '@/ui/Input';
import { usePermissions } from '@daily-co/daily-react';

interface Props {
  onContinue: (userName: string) => void;
}

export function NameSetup({ onContinue }: Props) {
  const [username, setUsername] = useState<string>('');
  const { hasPresence } = usePermissions();

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onContinue(username);
    },
    [onContinue, username],
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-y-3 p-6">
        <h2 className="font-semibold">Enter your name</h2>
        <p className="text-xs">This is how you will be presented.</p>
        <Input
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
        <Button
          className="mt-4 w-full"
          type="submit"
          disabled={username === ''}
        >
          {hasPresence ? 'Continue' : 'Join'}
        </Button>
      </div>
    </form>
  );
}
