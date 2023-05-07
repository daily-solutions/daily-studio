import { atom, useRecoilState } from 'recoil';

const paramsState = atom<{ [key: string]: any }>({
  key: 'params-state',
  default: {
    mode: 'grid',
    'videoSettings.showParticipantLabels': true,
  },
});

export const useParams = () => useRecoilState(paramsState);
