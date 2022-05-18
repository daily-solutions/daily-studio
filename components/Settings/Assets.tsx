import React, { useCallback, useState } from 'react';
import {
  Button,
  Card,
  FileCard,
  FileUploader,
  Heading,
  MimeType,
  Pane,
  TextInputField,
} from 'evergreen-ui';
import { useVCS } from '../../contexts/VCSProvider';

const Asset = () => {
  const { setAssets } = useVCS();
  const [values, setValues] = useState({
    name: '',
    file: [],
  });

  const handleChangeFile = useCallback((files: any) => {
    setValues(values => ({ ...values, name: files[0].name, file: [files[0]] }));
  }, []);
  const handleRemove = useCallback(() => {
    setValues(values => ({ ...values, file: [] }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues(values => ({ ...values, [e.target.name]: e.target.value }));

  const handleSaveAsset = async () => {
    const body = new FormData();
    body.append('file', values.file[0]);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body,
    });
    const file = await response.json();
    const url = `${window.location.origin}/assets/${file.originalFilename}`;

    // creating an image to render it in the local view.
    const img = document.createElement('img');
    img.alt = `${values.name} image`;
    img.src = url;

    setAssets(assets => ({
      ...assets,
      [values.name]: {
        url,
        image: img,
        size: file.size,
      },
    }));
    setValues({ name: '', file: [] });
  };

  return (
    <Card background="white" padding={24} marginBottom={16}>
      <Heading marginBottom={16}>Create an asset</Heading>
      <TextInputField
        name="name"
        label="Asset Name"
        value={values.name}
        onChange={handleChange}
        marginBottom={20}
      />
      <FileUploader
        label="Upload File"
        description="You can only upload 1 file of PNG format"
        maxFiles={1}
        onChange={handleChangeFile}
        acceptedMimeTypes={[MimeType.png]}
        maxSizeInBytes={1024 ** 2}
        renderFile={file => {
          const { name, size, type } = file;
          return (
            <FileCard
              key={name}
              name={name}
              onRemove={handleRemove}
              sizeInBytes={size}
              type={type}
            />
          );
        }}
        values={values.file}
      />
      <Button onClick={handleSaveAsset} width="100%" appearance="primary">
        Save Asset
      </Button>
    </Card>
  );
};

const AssetSettings = () => {
  const { assets, setAssets } = useVCS();

  const handleRemoveAsset = (key: string) => {
    const newAssets = assets;
    delete newAssets[key];
    setAssets({ ...newAssets });
  };

  return (
    <Pane>
      <Pane>
        <Heading>Session Assets ({Object.keys(assets).length})</Heading>
        <Pane marginY={10}>
          {Object.keys(assets).map(asset => (
            <FileCard
              key={asset}
              name={asset}
              type={MimeType.png}
              sizeInBytes={assets[asset].size}
              onRemove={() => handleRemoveAsset(asset)}
            />
          ))}
        </Pane>
        <Asset />
      </Pane>
    </Pane>
  );
};

export default AssetSettings;
