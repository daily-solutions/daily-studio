import React, { useEffect, useMemo, useState } from 'react';
import { Pane, Spinner } from 'evergreen-ui';
import { useLocalParticipant } from '@daily-co/daily-react-hooks';
import SetupUsername from './SetupUsername';
import { useCall } from '../../contexts/CallProvider';
import { useWindowSize } from '../../hooks/useWindowSize';
import Setup from './Setup';

const Haircheck = () => {
  const { state } = useCall();
  const localParticipant = useLocalParticipant();
  const { width } = useWindowSize();
  const [step, setStep] = useState<'username' | 'lobby'>('username');

  useEffect(() => {
    if (localParticipant?.user_name) setStep('lobby');
  }, [localParticipant?.user_name]);

  const hairCheckWidth = useMemo(() => {
    if (width > 1550) return '25vw';
    else if (width > 1200) return '35vw';
    else if (width > 750 && width <= 1200) return '50vw';
    else return '70vw';
  }, [width]);

  if (!localParticipant || state !== 'lobby') return <Spinner />;
  return (
    <Pane width={hairCheckWidth}>
      {step === 'username' ? (
        <SetupUsername setStep={setStep} />
      ) : (
        <Setup setStep={setStep} />
      )}
    </Pane>
  );
};

export default Haircheck;
