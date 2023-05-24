import { atom, useRecoilState } from 'recoil';

export type Message = {
  id: string;
  userName: string;
  fromId: string;
  message: string;
  receivedAt: Date;
  isLocal: boolean;
};

const messagesState = atom<Message[]>({
  key: 'messages-state',
  default: [],
});

export const useMessages = () => useRecoilState(messagesState);
