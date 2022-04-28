import React from 'react';
import {
  Heading,
  Pane,
  SelectField,
  Switch,
  Text,
  TextInputField,
} from 'evergreen-ui';
import { useLiveStreaming } from '../../contexts/LiveStreamingContext';

const TextSettings = () => {
  const { params, setParams } = useLiveStreaming();
  return (
    <Pane padding={10}>
      <Heading>Text Overlay Settings</Heading>

      <Pane display="flex" marginTop={20}>
        <Switch
          height={20}
          checked={params?.['videoSettings.showTextOverlay']}
          marginBottom={10}
          onChange={e =>
            setParams((params: any) => ({
              ...params,
              'videoSettings.showTextOverlay': e.target.checked,
            }))
          }
        />
        <Text marginLeft={10}>Show text overlay</Text>
      </Pane>
      {params?.['videoSettings.showTextOverlay'] && (
        <>
          <TextInputField
            marginTop={10}
            label="Text"
            defaultValue="An example text overlay"
            value={params?.['text.content']}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setParams((params: any) => ({
                ...params,
                'text.content': e.target.value,
              }))
            }
          />
          <SelectField
            label="Horizontal Alignment"
            width="100%"
            value={params?.['text.align_horizontal']}
            onChange={e =>
              setParams((params: any) => ({
                ...params,
                'text.align_horizontal': e.target.value,
              }))
            }
          >
            <option value="left">Left</option>
            <option value="center" selected>
              Center
            </option>
            <option value="right">Right</option>
          </SelectField>
          <SelectField
            label="Vertical Alignment"
            width="100%"
            value={params?.['text.align_vertical']}
            onChange={e =>
              setParams((params: any) => ({
                ...params,
                'text.align_vertical': e.target.value,
              }))
            }
          >
            <option value="top">Center</option>
            <option value="center" selected>
              Center
            </option>
            <option value="bottom">Bottom</option>
          </SelectField>
        </>
      )}
    </Pane>
  );
};

export default TextSettings;
