import React from 'react';
import { Pane } from 'evergreen-ui';
import FormMaker from '../Form';
import { viewParams } from '../../constants/viewParams';

const ViewSettings = () => {
  return (
    <Pane>
      <FormMaker fields={viewParams} />
    </Pane>
  );
};

export default ViewSettings;
