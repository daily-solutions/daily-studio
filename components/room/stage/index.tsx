import React, { useState } from 'react';

import { useParticipants } from '@/hooks/useParticipants';
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs';
import { Participants } from '@/components/room/stage/Participants';
import { TabHeader } from '@/components/room/stage/TabHeader';

export function Stage() {
  const [tab, setTab] = useState('stage');

  const { participantIds, waitingParticipantIds } = useParticipants();

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
              count={participantIds.length}
              active={tab === 'stage'}
            />
            <TabHeader
              name="Waiting"
              value="waiting"
              count={waitingParticipantIds.length}
              active={tab === 'waiting'}
            />
          </TabsList>
          <div className="h-full flex-1">
            <TabsContent value="stage">
              <Participants participantIds={participantIds} />
            </TabsContent>
            <TabsContent value="waiting">
              <Participants participantIds={waitingParticipantIds} />
            </TabsContent>
          </div>
        </div>
      </div>
    </Tabs>
  );
}
