import React from 'react';
import { Heading, Pane, SelectField, Switch, Text } from 'evergreen-ui';
import { useLiveStreaming } from '../../contexts/LiveStreamingContext';

const MiscSettings = () => {
  const { params, setParams } = useLiveStreaming();

  return (
    <Pane padding={10}>
      <Heading>Misc Settings</Heading>

      <Pane display="flex" marginTop={20}>
        <Switch
          height={20}
          checked={params?.['videoSettings.showParticipantLabels']}
          marginBottom={10}
          onChange={e =>
            setParams(params => ({
              ...params,
              'videoSettings.showParticipantLabels': e.target.checked,
            }))
          }
        />
        <Text marginLeft={10}>Show participant labels</Text>
      </Pane>

      <Pane display="flex" marginTop={5}>
        <Switch
          height={20}
          checked={params?.['videoSettings.roundedCorners']}
          marginBottom={10}
          onChange={e =>
            setParams(params => ({
              ...params,
              'videoSettings.roundedCorners': e.target.checked,
            }))
          }
        />
        <Text marginLeft={10}>Round corners</Text>
      </Pane>

      <SelectField
        marginTop={10}
        label="Scale"
        width="100%"
        value={params?.['videoSettings.scaleMode']}
        onChange={e =>
          setParams(params => ({
            ...params,
            'videoSettings.scaleMode': e.target.value,
          }))
        }
      >
        <option value="fill" selected>
          Fill
        </option>
        <option value="fit">Fit</option>
      </SelectField>
    </Pane>
  );
};

export default MiscSettings;
