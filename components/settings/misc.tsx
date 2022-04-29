import React from 'react';
import { Heading, Pane } from 'evergreen-ui';
import FormMaker from '../Form';
import { miscParams } from '../../constants/miscParams';

const MiscSettings = () => {
  return (
    <Pane padding={10}>
      <Heading>Misc Settings</Heading>
      <FormMaker fields={miscParams} />
    </Pane>
  );
};

export default MiscSettings;
