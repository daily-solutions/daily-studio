import { atom, useRecoilState } from 'recoil';

const messageState = atom<string>({
  key: 'message-state',
  default: '',
});

export const useLocalMessage = () => useRecoilState(messageState);
