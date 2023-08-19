'use client';

import React from 'react';
import { Button } from '@/ui/Button';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';

export const StartCall = () => {
  const { pending } = useFormStatus();

  return (
    <Button isLoading={pending} type="submit">
      Start call
    </Button>
  );
};
