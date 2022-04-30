import React from 'react';
import { Pane } from 'evergreen-ui';
import FormMaker from '../Form';
import { viewParams } from '../../constants/viewParams';
import PaneHeader from '../PaneHeader';

const ViewSettings = () => {
  return (
    <Pane>
      <PaneHeader title="View Settings" />
      <FormMaker fields={viewParams} />
    </Pane>
  );
};

export default ViewSettings;
