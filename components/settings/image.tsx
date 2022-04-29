import React from 'react';
import { Heading, Pane } from 'evergreen-ui';
import FormMaker from '../Form';
import { imageParams } from '../../constants/imageParams';

const ImageSettings = () => {
  return (
    <Pane padding={10}>
      <Heading>Image Overlay Settings</Heading>
      <FormMaker fields={imageParams} />
    </Pane>
  );
};

export default ImageSettings;
