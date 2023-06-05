'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { Button, ButtonProps } from '@/components/ui/button';

interface Props {
  roomName: string;
  privilege: 'producer' | 'presenter' | 'viewer';
  buttonText: string;
  variant?: ButtonProps['variant'];
}

export function PrivilegeButton({
  roomName,
  privilege,
  buttonText,
  variant = 'default',
}: Props) {
  const router = useRouter();
  const handleOnClick = useCallback(
    () => router.push(`/${roomName}/${privilege}`),
    [privilege, roomName, router]
  );

  return (
    <Button
      size="sm"
      variant={variant}
      className="w-full"
      onClick={handleOnClick}
    >
      {buttonText}
    </Button>
  );
}
