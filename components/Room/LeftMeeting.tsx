import React from 'react';
import { Card, CardContent, CardHeader } from '@/ui/Card';

export function LeftMeeting() {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center">
      <Card className="flex flex-col items-center justify-center">
        <CardHeader>
          <h2 className="font-semibold">You&apos;ve left the call</h2>
        </CardHeader>
        <CardContent>
          <p>Have a nice day!</p>
        </CardContent>
      </Card>
    </div>
  );
}
