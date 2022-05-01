import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Dialog, SelectField, TextInputField } from 'evergreen-ui';
import { useVCS } from '../contexts/VCSProvider';

type Props = {
  isShown: boolean;
  setIsShown: Dispatch<SetStateAction<boolean>>;
};

const RtmpUrlModal = ({ isShown, setIsShown }: Props) => {
  const { setRtmpUrl, startStreaming } = useVCS();

  const [platform, setPlatform] = useState('');
  const [platformUrl, setPlatformUrl] = useState('');
  const [streamKey, setStreamKey] = useState('');

  const platforms: { [key: string]: string } = {
    Youtube: 'rtmp://a2.rtmp.youtube.com/live2/',
    Mux: 'rtmps://global-live.mux.com:443/app/',
    'Live Peer': 'rtmp://mdw-rtmp.livepeer.com/live/',
    Cloudflare: 'rtmps://live.cloudflare.com:443/live/',
    Custom: platformUrl,
  };

  useEffect(
    () => setRtmpUrl(`${platforms[platform]}${streamKey}`),
    [platforms, platform, streamKey, setRtmpUrl],
  );

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
      <SelectField
        label="Streaming Platform"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setPlatform(e.target.value)
        }
      >
        {Object.keys(platforms).map((platform: string) => (
          <option value={platform} key={platform}>
            {platform}
          </option>
        ))}
      </SelectField>
      {platform === 'Custom' && (
        <TextInputField
          label="RTMP URL"
          placeholder="Enter your stream RTMP URL here"
          value={platformUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPlatformUrl(e.target.value)
          }
        />
      )}
      <TextInputField
        label="Stream Key"
        placeholder="Enter your stream key here"
        value={streamKey}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setStreamKey(e.target.value)
        }
      />
    </Dialog>
  );
};

export default RtmpUrlModal;
