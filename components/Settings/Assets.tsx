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
  const { assets, setAssets } = useVCS();
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

  const handleSaveAsset = () => {
    const img = document.createElement('img');
    img.name = values.name;
    const reader = new FileReader();
    reader.onload = function (readEv) {
      // @ts-ignore
      img.src = readEv.target.result;
      setAssets({ ...assets, [values.name]: img });
      setValues({ name: '', file: [] });
    };
    reader.readAsDataURL(values.file[0]);
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

  const getImageSize = (asset: string) => {
    // @ts-ignore
    const src = assets[asset].src;
    return Math.round(
      ((src.length - 'data:image/png;base64,'.length) * 3) / 4,
    ) as number;
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
              sizeInBytes={getImageSize(asset)}
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
