import React, { useState } from 'react';
import {
  Pane,
  Heading,
  Text,
  Card,
  TextInputField,
  Button,
} from 'evergreen-ui';
import { useDaily } from '@daily-co/daily-react-hooks';

const SetupUsername = () => {
  const daily = useDaily();
  const [username, setUsername] = useState('');

  const onContinue = () => daily.setUserName(username);

  return (
    <Pane>
      <Pane paddingY={16}>
        <Heading marginBottom={8}>Enter your name</Heading>
        <Text>Enter your name below to join the call.</Text>
      </Pane>
      <Card background="white" padding={16} elevation={1}>
        <form
          onSubmit={e => {
            e.preventDefault();
            onContinue();
          }}
        >
          <TextInputField
            label="Your name"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
          />
          <Button
            appearance="primary"
            width="100%"
            disabled={username === ''}
            type="submit"
          >
            Continue
          </Button>
        </form>
      </Card>
    </Pane>
  );
};

export default SetupUsername;
