import { useCallback } from 'react';
import { useParams } from '@/states/params';
import { DailyEventObjectAppMessage } from '@daily-co/daily-js';
import { useAppMessage } from '@daily-co/daily-react';

import { useIsOwner } from '@/hooks/useIsOwner';

interface Params {
  event: 'params';
  type: 'params';
  params: Record<string, any>;
}

type SyncParamsAppMessage = Params;

export const useSyncParams = () => {
  const isOwner = useIsOwner();
  const [, setParams] = useParams();

  const sendAppMessage = useAppMessage<SyncParamsAppMessage>();

  const appMessage = useCallback(
    (ev: DailyEventObjectAppMessage<SyncParamsAppMessage>) => {
      const { data } = ev;
      if (data.event !== 'params') return;

      if (data.type === 'params') {
        setParams(data.params);
      }
    },
    [setParams]
  );

  const updateParams = useCallback(
    (param) => {
      if (!isOwner) return;

      setParams((prev) => {
        const newParams = { ...prev, ...param };
        sendAppMessage({ event: 'params', type: 'params', params: newParams });
        return newParams;
      });
    },
    [isOwner, sendAppMessage, setParams]
  );

  return { appMessage, updateParams };
};
