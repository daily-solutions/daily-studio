import React from 'react';
import { Pane } from 'evergreen-ui';
import FormMaker from '../Form';
import { miscParams } from '../../constants/miscParams';
import PaneHeader from '../PaneHeader';

const MiscSettings = () => {
  return (
    <Pane>
      <PaneHeader title="Misc Settings" />
      <FormMaker fields={miscParams} />
    </Pane>
  );
};

export default MiscSettings;
