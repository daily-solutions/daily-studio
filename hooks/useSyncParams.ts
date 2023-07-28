import { useCallback } from 'react';
import { useParams } from '@/states/params';
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

  const updateParams = useCallback(
    (param, type: 'replace' | 'merge' = 'merge') => {
      if (!isOwner) return;

      setParams((prev) => {
        const newParams = type === 'merge' ? { ...prev, ...param } : param;
        sendAppMessage({ event: 'params', type: 'params', params: newParams });
        return newParams;
      });
    },
    [isOwner, sendAppMessage, setParams]
  );

  return { updateParams };
};
