import React from 'react';
import { Pane } from 'evergreen-ui';
import FormMaker from '../Form';
import { miscParams } from '../../constants/miscParams';

const MiscSettings = () => {
  return (
    <Pane>
      <FormMaker fields={miscParams} />
    </Pane>
  );
};

export default MiscSettings;
