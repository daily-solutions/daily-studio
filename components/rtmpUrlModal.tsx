import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Dialog, SelectField, TextInputField } from 'evergreen-ui';
import { useVCS } from '../contexts/VCSProvider';

type Props = {
  isShown: boolean;
  setIsShown: Dispatch<SetStateAction<boolean>>;
};

const RtmpUrlModal = ({ isShown, setIsShown }: Props) => {
  const { setRtmpUrl, setPlaybackUrl, startStreaming } = useVCS();

  const [rtmp, setRTMP] = useState({
    platform: '',
    platformUrl: '',
    streamKey: '',
    playbackUrl: '',
  });

  const platforms: { [key: string]: string } = useMemo(
    () => ({
      Youtube: 'rtmp://a2.rtmp.youtube.com/live2/',
      Mux: 'rtmps://global-live.mux.com:443/app/',
      'Live Peer': 'rtmp://mdw-rtmp.livepeer.com/live/',
      Cloudflare: 'rtmps://live.cloudflare.com:443/live/',
      Custom: rtmp.platformUrl,
    }),
    [rtmp.platformUrl],
  );

  useEffect(
    () => setRtmpUrl(`${platforms[rtmp.platform]}${rtmp.streamKey}`),
    [platforms, rtmp.platform, rtmp.streamKey, setRtmpUrl],
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setRTMP(rtmp => ({ ...rtmp, [e.target.name]: e.target.value }));
  };

  const handleClick = () => {
    startStreaming();
    setIsShown(false);
    const timeout = setTimeout(() => {
      setPlaybackUrl(rtmp.playbackUrl);
      clearTimeout(timeout);
    }, 10000);
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
        name="platform"
        label="Streaming Platform"
        value={rtmp.platform}
        onChange={handleChange}
      >
        {Object.keys(platforms).map((platform: string) => (
          <option value={platform} key={platform}>
            {platform}
          </option>
        ))}
      </SelectField>
      {rtmp.platform === 'Custom' && (
        <TextInputField
          name="platformUrl"
          label="RTMP URL"
          placeholder="Enter your stream RTMP URL here"
          value={rtmp.platformUrl}
          onChange={handleChange}
        />
      )}
      <TextInputField
        name="streamKey"
        label="Stream Key"
        placeholder="Enter your stream key here"
        value={rtmp.streamKey}
        onChange={handleChange}
      />
      <TextInputField
        name="playbackUrl"
        label="Playback URL"
        description="Optional"
        placeholder="Enter your playback url here"
        value={rtmp.playbackUrl}
        onChange={handleChange}
      />
    </Dialog>
  );
};

export default RtmpUrlModal;
