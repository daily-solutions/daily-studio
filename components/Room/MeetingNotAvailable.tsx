import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/Card';

export function MeetingNotAvailable() {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center">
      <Card className="flex flex-col items-center justify-center">
        <CardHeader>
          <CardTitle>
            The meeting you&apos;re trying to join does not exist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Contact the meeting host for help.</p>
        </CardContent>
      </Card>
    </div>
  );
}
