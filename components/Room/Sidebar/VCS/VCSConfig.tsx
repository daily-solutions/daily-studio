import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from '@/states/params';
import { Button } from '@/ui/Button';
import { Icon } from '@/ui/Icons';
import { Textarea } from '@/ui/TextArea';
import { useToast } from '@/ui/useToast';

import { MeetingSessionState } from '@/types/meetingSessionState';
import { useMeetingSessionState } from '@/hooks/useMeetingSessionState';
import { useSyncParams } from '@/hooks/useSyncParams';

export function VCSConfig() {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [height, setHeight] = useState('auto');

  const { toast } = useToast();

  const [params] = useParams();
  const { updateParams } = useSyncParams();

  const [{ assets, rtmps }, updateMeetingSessionState] =
    useMeetingSessionState<MeetingSessionState>();

  const [config, setConfig] = useState({});

  useEffect(() => {
    setConfig({ params, assets, rtmps });
  }, [params, assets, rtmps]);

  useEffect(() => {
    if (!textAreaRef.current) return;

    if (!config) {
      setHeight('auto');
    } else {
      setHeight(
        `${
          textAreaRef.current.scrollHeight +
          (textAreaRef.current.offsetHeight - textAreaRef.current.clientHeight)
        }px`
      );
    }
  }, [config, textAreaRef]);

  const handleCopyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(JSON.stringify(config));
    toast({ title: 'Copied to clipboard' });
  }, [config, toast]);

  const handleChange = useCallback(
    (e) => {
      try {
        const parsedValue = JSON.parse(e.target.value);
        setConfig(parsedValue);
        const { params, rtmps, assets } = parsedValue;
        if (params) updateParams(params);
        if (rtmps || assets) updateMeetingSessionState({ rtmps, assets });
      } catch (e) {
        console.error(e);
      }
    },
    [updateMeetingSessionState, updateParams]
  );

  return (
    <div className="flex flex-col gap-y-8">
      <Textarea
        ref={textAreaRef}
        rows={4}
        onChange={handleChange}
        value={JSON.stringify(config)}
        style={{ height }}
      />
      <Button variant="outline" onClick={handleCopyToClipboard}>
        <Icon icon="clipboard" className="mr-2 h-4 w-4" />
        <span>Copy to clipboard</span>
      </Button>
    </div>
  );
}
