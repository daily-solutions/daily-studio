import React, { Dispatch, SetStateAction } from 'react';
import { Dialog, TextInputField } from 'evergreen-ui';
import { useVCS } from '../contexts/VCSProvider';

type Props = {
  isShown: boolean;
  setIsShown: Dispatch<SetStateAction<boolean>>;
};

const RtmpUrlModal = ({ isShown, setIsShown }: Props) => {
  const { rtmpUrl, setRtmpUrl, startStreaming } = useVCS();

  const handleClick = () => {
    startStreaming();
    setIsShown(false);
  };

  return (
    <Dialog
      isShown={isShown}
      title="Start live streaming?"
      onCloseComplete={() => setIsShown(false)}
      preventBodyScrolling
      confirmLabel="Start Live Streaming"
      onConfirm={handleClick}
    >
      <TextInputField
        label="RTMP URL"
        placeholder="Enter your RTMP URL to stream"
        value={rtmpUrl}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setRtmpUrl(e.target.value)
        }
      />
    </Dialog>
  );
};

export default RtmpUrlModal;
