import { useCallback, useMemo } from 'react';
import { config } from '@/config';
import { DailyParticipant } from '@daily-co/daily-js';
import { useParticipantIds } from '@daily-co/daily-react';
import { atom, SetterOrUpdater, useRecoilState } from 'recoil';

const paramsState = atom<{ [key: string]: any }>({
  key: 'params-state',
  default: config.vcs,
});

export const useParams = (): [
  { [key: string]: any },
  SetterOrUpdater<{ [key: string]: any }>,
] => {
  const [params, setParams] = useRecoilState(paramsState);

  const participantIds = useParticipantIds({
    filter: useCallback(
      (p: DailyParticipant) =>
        p.permissions.hasPresence &&
        // @ts-ignore
        (p.userData?.['onStage'] ||
          p?.participantType === 'remote-media-player'),
      [],
    ),
    sort: 'joined_at',
  });

  const newParams = useMemo(() => {
    const newParams = { ...params };
    switch (params.mode) {
      case 'single':
        if (newParams['custom.layout.single.participant']) {
          newParams['videoSettings.preferredParticipantIds'] = Array.from(
            new Set([
              newParams['custom.layout.single.participant'],
              ...participantIds,
            ]),
          ).join(',');
        }
        return newParams;
      case 'pip':
      case 'split':
        if (
          newParams?.[`custom.layout.${params.mode}.participant1`] &&
          newParams?.[`custom.layout.${params.mode}.participant2`]
        ) {
          newParams['videoSettings.preferredParticipantIds'] = Array.from(
            new Set([
              newParams[`custom.layout.${params.mode}.participant1`],
              newParams[`custom.layout.${params.mode}.participant2`],
              ...participantIds,
            ]),
          ).join(',');
        }
        return newParams;
      default:
        return newParams;
    }
  }, [params, participantIds]);

  return [newParams, setParams];
};
