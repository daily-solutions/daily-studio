import { atom, useRecoilState } from 'recoil';

const joinStageState = atom<boolean>({
  key: 'join-stage-state',
  default: false,
});

export const useJoinStage = () => useRecoilState(joinStageState);
