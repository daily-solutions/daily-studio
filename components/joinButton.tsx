'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

export function JoinButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleOnJoin = useCallback(async () => {
    setIsLoading(true);
    const response = await fetch('api/daily/room', {
      method: 'POST',
    });
    const { name, error } = await response.json();
    if (error) return;
    router.push(`/${name}`);
    setIsLoading(false);
  }, [router]);

  return (
    <Button size="sm" onClick={handleOnJoin} isLoading={isLoading}>
      Start call
    </Button>
  );
}
