import React from 'react';
import { Pane, Switch, Text, Heading } from 'evergreen-ui';
import { useCall } from '../../contexts/CallProvider';
import { useVCS } from '../../contexts/VCSProvider';
import { DailyParticipant } from '@daily-co/daily-js';

type Props = {
  participant: DailyParticipant;
};

const ParticipantRow = ({ participant }: Props) => {
  const { layoutParticipants, setLayoutParticipants } = useVCS();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLayoutParticipants(layoutParticipants => {
      let p = e.target.checked
        ? [...layoutParticipants.participants, participant.user_id]
        : [...layoutParticipants.participants].filter(
            userId => userId !== participant.user_id,
          );
      return {
        ...layoutParticipants,
        participants: [...p],
      };
    });
  };

  return (
    <Pane display="flex" marginBottom={10}>
      <Switch
        name="showAllParticipants"
        height={20}
        disabled={layoutParticipants.showAllParticipants}
        checked={
          layoutParticipants.participants.includes(participant.user_id) ||
          layoutParticipants.showAllParticipants
        }
        onChange={handleChange}
      />
      <Text marginLeft={10}>{participant.user_name}</Text>
    </Pane>
  );
};

const PeopleSettings = () => {
  const { participants } = useCall();
  const { layoutParticipants, setLayoutParticipants } = useVCS();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLayoutParticipants(layoutParticipants => ({
      ...layoutParticipants,
      [e.target.name]: e.target.checked,
    }));
  };

  return (
    <Pane>
      <Pane display="flex" marginBottom={20}>
        <Switch
          name="showAllParticipants"
          height={20}
          checked={layoutParticipants.showAllParticipants}
          onChange={handleChange}
        />
        <Text marginLeft={10}>Show all participants</Text>
      </Pane>
      <Heading marginBottom={20}>Participants</Heading>
      {participants.map(participant => (
        <ParticipantRow participant={participant} key={participant.user_id} />
      ))}
    </Pane>
  );
};

export default PeopleSettings;
