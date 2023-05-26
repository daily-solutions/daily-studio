import { atom, useRecoilState } from 'recoil';

export type Viewer = {
  sessionId: string;
  userName: string;
};

const viewersState = atom<Viewer[]>({
  key: 'viewers-state',
  default: [],
});

export const useViewers = () => useRecoilState(viewersState);
