import { useCallback, useEffect } from 'react';
import { useParams } from '@/states/params';
import { DailyEventObjectAppMessage } from '@daily-co/daily-js';
import { useAppMessage } from '@daily-co/daily-react';

import { getDiff } from '@/lib/getDiff';

interface SyncParams {
  type: 'params';
  params: Record<string, any>;
}

type SyncParamsAppMessage = SyncParams;

export const useSyncParams = (vcsCompRef) => {
  const [params, setParams] = useParams();

  const sendAppMessage = useAppMessage<SyncParamsAppMessage>({
    onAppMessage: useCallback(
      (ev: DailyEventObjectAppMessage<SyncParamsAppMessage>) => {
        const { data } = ev;
        switch (data.type) {
          case 'params':
            setParams(data.params);
            break;
          default:
            break;
        }
      },
      [setParams]
    ),
  });

  useEffect(() => {
    if (!vcsCompRef.current) return;

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

    // send params to other participants
    sendAppMessage({ type: 'params', params });
  }, [params, sendAppMessage, vcsCompRef]);
};
