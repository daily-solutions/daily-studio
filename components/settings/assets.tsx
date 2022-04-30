import React, { useState } from 'react';
import {
  Pane,
  TextInputField,
  Card,
  Button,
  Heading,
  Paragraph,
} from 'evergreen-ui';
import PaneHeader from '../PaneHeader';
import { useVCS } from '../../contexts/VCSProvider';

const Asset = () => {
  const { assets, setAssets } = useVCS();
  const [values, setValues] = useState({
    name: '',
    url: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues(values => ({ ...values, [e.target.name]: e.target.value }));

  const handleSaveAsset = () =>
    setAssets({ ...assets, [values.name]: values.url });

  return (
    <Card background="white" padding={24} marginBottom={16}>
      <TextInputField
        name="name"
        label="Asset Name"
        value={values.name}
        onChange={handleChange}
        marginBottom={20}
      />
      <TextInputField
        name="url"
        label="Asset URL"
        value={values.url}
        onChange={handleChange}
        marginBottom={20}
      />
      <Button onClick={handleSaveAsset}>Save Asset</Button>
    </Card>
  );
};

const Assets = () => {
  const { assets, setAssets } = useVCS();
  const [createAsset, setCreateAsset] = useState(false);

  const handleAddAsset = () => setCreateAsset(create => !create);
  const handleRemoveAsset = (key: string) => {
    const newAssets = assets;
    delete newAssets[key];
    setAssets({ ...newAssets });
  };

  return (
    <Pane>
      <PaneHeader
        title="Session Assets"
        subtitle="We can only set it before starting the stream or recording"
      />
      <Pane padding={24}>
        <Heading>Session Assets ({Object.keys(assets).length})</Heading>

        <Pane marginY={10}>
          {Object.keys(assets).map(asset => (
            <Card key={asset} background="white" padding={20} marginY={8}>
              <Heading>{asset}</Heading>
              <Paragraph marginY={5}>{assets[asset]}</Paragraph>
              <Button
                intent="danger"
                marginY={10}
                onClick={() => handleRemoveAsset(asset)}
              >
                Remove
              </Button>
            </Card>
          ))}
        </Pane>

        {createAsset && <Asset />}
        <Button onClick={handleAddAsset}>
          {createAsset ? 'Close' : 'Add New Asset'}
        </Button>
      </Pane>
    </Pane>
  );
};

export default Assets;
