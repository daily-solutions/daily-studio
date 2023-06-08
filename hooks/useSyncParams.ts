import { useCallback, useEffect } from 'react';
import { useParams } from '@/states/params';
import { DailyEventObjectAppMessage } from '@daily-co/daily-js';
import { useAppMessage } from '@daily-co/daily-react';
import { dequal } from 'dequal';

import { getDiff } from '@/lib/getDiff';
import { useIsOwner } from '@/hooks/useIsOwner';

interface SyncParams {
  type: 'params';
  params: Record<string, any>;
}

type SyncParamsAppMessage = SyncParams;

export const useSyncParams = (vcsCompRef) => {
  const [params, setParams] = useParams();
  const isOwner = useIsOwner();

  const sendAppMessage = useAppMessage<SyncParamsAppMessage>({
    onAppMessage: useCallback(
      (ev: DailyEventObjectAppMessage<SyncParamsAppMessage>) => {
        const { data } = ev;
        if (data.type === 'params') {
          setParams(data.params);
        }
      },
      [setParams]
    ),
  });

  useEffect(() => {
    if (!vcsCompRef.current || dequal(vcsCompRef.current?.paramValues, params))
      return;

    const diff = getDiff(vcsCompRef.current?.paramValues, params);
    if (
      diff &&
      Object.keys(diff).length === 0 &&
      Object.getPrototypeOf(diff) === Object.prototype
    )
      return;

    for (const key in diff) {
      vcsCompRef.current.sendParam(key, diff[key]);
    }

    if (!isOwner) return;

    // send params to other participants
    sendAppMessage({ type: 'params', params });
  }, [isOwner, params, sendAppMessage, vcsCompRef]);
};
