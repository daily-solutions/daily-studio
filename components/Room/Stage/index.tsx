import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList } from '@/ui/Tabs';
import { useLocalSessionId } from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';
import { useParticipants } from '@/hooks/useParticipants';
import { useStage } from '@/hooks/useStage';
import { Participants } from '@/components/Room/Stage/Participants';
import { TabHeader } from '@/components/Room/Stage/TabHeader';
import { Tile } from '@/components/Tile';

export function Stage() {
  const isOwner = useIsOwner();
  const localSessionId = useLocalSessionId();
  const { state } = useStage();
  const { participantIds, waitingParticipantIds } = useParticipants();

  const [tab, setTab] = useState('stage');

  if (state === 'back-stage') {
    return (
      <div className="absolute bottom-28 left-8 w-[calc(9rem*(16/9))]">
        <Tile sessionId={localSessionId} noVideoTileColor="bg-background" />
      </div>
    );
  }

  if (!isOwner) return null;

  return (
    <Tabs
      orientation="vertical"
      value={tab}
      onValueChange={setTab}
      className="h-40 max-h-40 border-t bg-muted px-2"
    >
      <div className="h-40 max-h-40 w-full overflow-hidden">
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
            <TabsContent className="mt-2" value="stage">
              <Participants participantIds={participantIds} />
            </TabsContent>
            <TabsContent className="mt-2" value="waiting">
              <Participants participantIds={waitingParticipantIds} />
            </TabsContent>
          </div>
        </div>
      </div>
    </Tabs>
  );
}
