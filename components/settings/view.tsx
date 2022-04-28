import React from 'react';
import {
  Pane,
  Small,
  useTheme,
  Heading,
  SelectField,
  TextInputField,
  Switch,
  Text,
} from 'evergreen-ui';
import { ReactComponent as GridView } from '../../icons/gridd-md.svg';
import { ReactComponent as SingleView } from '../../icons/user-md.svg';
import { ReactComponent as PipView } from '../../icons/pip-md.svg';
import { ReactComponent as SpeakerView } from '../../icons/speaker-md.svg';
import { ReactComponent as SplitView } from '../../icons/split-md.svg';
import { useLiveStreaming } from '../../contexts/LiveStreamingContext';

type Props = {
  name: string;
  label: string;
  Icon: any;
};

const ModeButton = ({ name, label, Icon }: Props) => {
  const theme = useTheme();
  const { params, setParams } = useLiveStreaming();

  const onClick = () => setParams(params => ({ ...params, mode: name }));

  return (
    <Pane
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      color={
        params.mode === name
          ? theme.colors.icon.selected
          : theme.colors.icon.default
      }
      cursor="pointer"
      onClick={onClick}
    >
      <Icon />
      <Small marginTop={5}>{label}</Small>
    </Pane>
  );
};

const ViewSettings = () => {
  const { params, setParams } = useLiveStreaming();

  const renderViewModeSettings = () => {
    switch (params.mode) {
      case 'dominant':
        return (
          <>
            <SelectField
              label="Active speaker tile position"
              width="100%"
              value={params?.['videoSettings.dominant.position']}
              onChange={e =>
                setParams(params => ({
                  ...params,
                  'videoSettings.dominant.position': e.target.value,
                }))
              }
            >
              <option value="left" selected>
                Left
              </option>
              <option value="right">Right</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </SelectField>
            <SelectField
              label="Active speaker tile width (in percentage)"
              width="100%"
              value={params?.['videoSettings.dominant.splitPos'] || '8'}
              onChange={e =>
                setParams(params => ({
                  ...params,
                  'videoSettings.dominant.splitPos':
                    Number(e.target.value) / 10,
                }))
              }
            >
              {Array.from({ length: 11 }, (_, i) => (
                <option value={i}>{i * 10}</option>
              ))}
            </SelectField>
            <TextInputField
              type="number"
              label="Total number of tiles (except active speaker)"
              defaultValue={5}
              value={params?.['videoSettings.dominant.numChiclets']}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setParams(params => ({
                  ...params,
                  'videoSettings.dominant.numChiclets': Number(e.target.value),
                }))
              }
            />
            <Pane display="flex" marginTop={5}>
              <Switch
                height={20}
                defaultChecked={true}
                checked={params?.['videoSettings.dominant.followDomFlag']}
                onChange={e =>
                  setParams(params => ({
                    ...params,
                    'videoSettings.dominant.followDomFlag': e.target.checked,
                  }))
                }
              />
              <Text marginLeft={10}>Follow active speaker</Text>
            </Pane>
          </>
        );
      case 'pip':
        return (
          <>
            <SelectField
              label="PIP Position"
              width="100%"
              value={params?.['videoSettings.pip.position']}
              onChange={e =>
                setParams(params => ({
                  ...params,
                  'videoSettings.pip.position': e.target.value,
                }))
              }
            >
              <option value="top-right" selected>
                Top Right
              </option>
              <option value="top-left">Top Left</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
            </SelectField>
            <TextInputField
              type="number"
              min={0}
              max={1}
              label="Aspect ratio"
              defaultValue={1}
              value={params?.['videoSettings.pip.aspectRatio']}
              step={0.1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setParams(params => ({
                  ...params,
                  'videoSettings.pip.aspectRatio': Number(e.target.value),
                }))
              }
            />
            <Pane display="flex" marginTop={5}>
              <Switch
                height={20}
                defaultChecked={true}
                checked={params?.['videoSettings.pip.followDomFlag']}
                onChange={e =>
                  setParams(params => ({
                    ...params,
                    'videoSettings.pip.followDomFlag': e.target.checked,
                  }))
                }
              />
              <Text marginLeft={10}>Follow active speaker</Text>
            </Pane>
          </>
        );
    }
  };

  return (
    <Pane margin={10}>
      <Heading>View Settings</Heading>
      <Pane display="flex" marginTop={20} gap={20}>
        <ModeButton name="single" label="Single" Icon={SingleView} />
        <ModeButton name="grid" label="Grid" Icon={GridView} />
        <ModeButton name="dominant" label="Speaker" Icon={SpeakerView} />
        <ModeButton name="pip" label="PIP" Icon={PipView} />
        <ModeButton name="split" label="Split" Icon={SplitView} />
      </Pane>
      <Pane marginTop={20}>{renderViewModeSettings()}</Pane>
    </Pane>
  );
};

export default ViewSettings;
