import React from 'react';
import { Card, CardContent, CardHeader } from '@/ui/Card';

export function Error() {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center">
      <Card className="flex flex-col items-center justify-center">
        <CardHeader>
          <h2 className="font-semibold">
            The meeting you&apos;re trying to join does not exist
          </h2>
        </CardHeader>
        <CardContent>
          <p>Contact the meeting host for help.</p>
        </CardContent>
      </Card>
    </div>
  );
}
