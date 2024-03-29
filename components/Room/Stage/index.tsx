import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList } from '@/ui/Tabs';
import { usePermissions } from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';
import { useStage } from '@/hooks/useStage';
import { Participants } from '@/components/Room/Stage/Participants';
import { TabHeader } from '@/components/Room/Stage/TabHeader';

export function Stage() {
  const [tab, setTab] = useState('stage');
  const { participantIds, waitingParticipantIds } = useStage();
  const { hasPresence } = usePermissions();
  const isOwner = useIsOwner();

  if (!isOwner && !hasPresence) return null;

  return (
    <Tabs
      orientation="vertical"
      value={tab}
      onValueChange={setTab}
      className="min-h-40 h-40 border-t px-2"
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
              name="Backstage"
              value="waiting"
              count={waitingParticipantIds.length}
              active={tab === 'waiting'}
            />
          </TabsList>
          <div className="h-full flex-1">
            <TabsContent className="h-full w-full" value="stage">
              <Participants participantIds={participantIds} />
            </TabsContent>
            <TabsContent className="h-full" value="waiting">
              <Participants participantIds={waitingParticipantIds} />
            </TabsContent>
          </div>
        </div>
      </div>
    </Tabs>
  );
}
