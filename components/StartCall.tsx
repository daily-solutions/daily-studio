'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui/Button';
import { useToast } from '@/ui/useToast';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

export const StartCall = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { pending } = useFormStatus();

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const response = await fetch('/api/daily/room', {
      method: 'POST',
    });
    if (response.status >= 400) {
      const { error, info } = await response.json();
      toast({
        title: `Failed to create room: ${error}`,
        description: info,
        variant: 'destructive',
      });
      return;
    }
    const { name } = await response.json();
    router.push(`/${name}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Button isLoading={pending} type="submit">
        Start call
      </Button>
    </form>
  );
};
