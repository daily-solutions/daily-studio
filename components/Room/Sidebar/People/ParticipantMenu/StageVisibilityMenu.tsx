import React from 'react';
import {
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/ui/DropdownMenu';
import { usePermissions } from '@daily-co/daily-react';

import { useStage } from '@/hooks/useStage';
import { useUserData } from '@/hooks/useUserData';

export function StageVisibilityMenu({ sessionId }: { sessionId: string }) {
  const { hasPresence } = usePermissions(sessionId);
  const userData = useUserData(sessionId);

  const { setStageVisibility } = useStage();

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem
        disabled={!(userData?.['acceptedToJoin'] || userData?.['onStage'])}
        checked={hasPresence && userData?.['onStage']}
        onCheckedChange={() =>
          setStageVisibility(sessionId, !userData?.['onStage'])
        }
      >
        Visible on stream
      </DropdownMenuCheckboxItem>
    </>
  );
}
