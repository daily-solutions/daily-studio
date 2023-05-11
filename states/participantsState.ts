import { atom, useRecoilState } from 'recoil';

export type ParticipantsState = {
  showAllParticipants: boolean;
  participantIds: string[];
};

const participantsState = atom<ParticipantsState>({
  key: 'participants-state',
  default: {
    showAllParticipants: true,
    participantIds: [],
  },
});

export const useParticipantsState = () => useRecoilState(participantsState);
