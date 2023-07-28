import { atom, useRecoilState } from 'recoil';

export const initialParams = {
  mode: 'grid',
  'videoSettings.showParticipantLabels': true,
};

const paramsState = atom<{ [key: string]: any }>({
  key: 'params-state',
  default: initialParams,
});

export const useParams = () => useRecoilState(paramsState);
