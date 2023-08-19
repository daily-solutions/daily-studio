import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/Card';

export function LeftMeeting() {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center">
      <Card className="flex flex-col items-center justify-center">
        <CardHeader>
          <CardTitle>You&apos;ve left the call</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Have a nice day!</p>
        </CardContent>
      </Card>
    </div>
  );
}
