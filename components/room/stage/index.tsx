import React, { useCallback, useState } from 'react';
import { DailyParticipant } from '@daily-co/daily-js';
import { useParticipantIds } from '@daily-co/daily-react';

import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { Participants } from '@/components/room/stage/Participants';
import { TabHeader } from '@/components/room/stage/TabHeader';

export function Stage() {
  const [tab, setTab] = useState('stage');

  const stageParticipants = useParticipantIds({
    filter: useCallback((p: DailyParticipant) => p.permissions.hasPresence, []),
  });

  return (
    <Tabs
      orientation="vertical"
      value={tab}
      onValueChange={setTab}
      className="border-t bg-muted px-2"
    >
      <div className="min-h-40 h-40 w-full">
        <div className="flex h-full items-center gap-4">
          <TabsList className="flex flex-col gap-2">
            <TabHeader
              name="Stage"
              value="stage"
              count={stageParticipants.length}
              active={tab === 'stage'}
            />
            <TabHeader
              name="Waiting"
              value="waiting"
              count={1}
              active={tab === 'waiting'}
            />
          </TabsList>
          <div className="h-full flex-1">
            <TabsContent value="stage">
              <Participants participantIds={stageParticipants} />
            </TabsContent>
            <TabsContent value="waiting">
              Change your password here.
            </TabsContent>
          </div>
        </div>
      </div>
    </Tabs>
  );
}
