import React from 'react';
import { Pane, Heading } from 'evergreen-ui';
import FormMaker from '../Form';
import { viewParams } from '../../constants/viewParams';

const ViewSettings = () => {
  return (
    <Pane margin={10}>
      <Heading>View Settings</Heading>
      <FormMaker fields={viewParams} />
    </Pane>
  );
};

export default ViewSettings;
