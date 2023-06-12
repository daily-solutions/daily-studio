import { useCallback } from 'react';
import { Button } from '@/ui/Button';
import { Switch } from '@/ui/Switch';

import { MeetingSessionState } from '@/types/meetingSessionState';
import { RTMP } from '@/types/rtmp';
import { useMeetingSessionState } from '@/hooks/useMeetingSessionState';
import { Icons } from '@/components/Icons';

interface Props {
  id: string;
  rtmp: RTMP;
  showSwitch?: boolean;
}

export function Rtmp({ rtmp, id, showSwitch = false }: Props) {
  const [{ rtmps }, setSessionState] =
    useMeetingSessionState<MeetingSessionState>();

  const handleDelete = useCallback(() => {
    const newRTMPs = { ...rtmps };
    delete newRTMPs[id];
    setSessionState({ rtmps: newRTMPs }, 'shallow-merge');
  }, [id, rtmps, setSessionState]);

  const handleChange = useCallback(
    (checked: boolean) => {
      setSessionState(
        {
          rtmps: {
            ...rtmps,
            [id]: {
              ...rtmps[id],
              active: checked,
            },
          },
        },
        'shallow-merge'
      );
    },
    [id, rtmps, setSessionState]
  );

  return (
    <div className="flex items-center justify-between gap-x-2">
      <div className="flex flex-col gap-y-1">
        <h3 className="text-sm font-medium">{rtmp.platform}</h3>
        <p className="text-xs">{rtmp.streamURL}</p>
      </div>
      {showSwitch ? (
        <Switch checked={rtmp.active} onCheckedChange={handleChange} />
      ) : (
        <Button
          size="auto"
          variant="outline"
          className="text-destructive hover:bg-destructive/90 hover:text-destructive-foreground"
          onClick={handleDelete}
        >
          <Icons.trash className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
