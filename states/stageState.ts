import { atom, useRecoilState } from 'recoil';

const requestJoinState = atom<boolean>({
  key: 'request-join-state',
  default: false,
});

export const useIsRequesting = () => useRecoilState(requestJoinState);

type RequestedParticipant = {
  userName: string;
  sessionId: string;
};

const requestedParticipantsState = atom<Record<string, RequestedParticipant>>({
  key: 'requested-participants-state',
  default: {},
});

export const useRequestedParticipants = () =>
  useRecoilState(requestedParticipantsState);
