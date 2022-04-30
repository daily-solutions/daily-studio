import React from 'react';
import { Pane } from 'evergreen-ui';
import FormMaker from '../Form';
import { imageParams } from '../../constants/imageParams';
import { useVCS } from '../../contexts/VCSProvider';

const ImageSettings = () => {
  const { assets } = useVCS();

  const params = imageParams(Object.keys(assets), Object.keys(assets)?.[0]);
  return (
    <Pane>
      <FormMaker fields={params} />
    </Pane>
  );
};

export default ImageSettings;
