import React from 'react';
import { Pane } from 'evergreen-ui';
import PaneHeader from '../PaneHeader';

const People = () => {
  return (
    <Pane>
      <PaneHeader
        title="People Settings"
        subtitle="You can select participant to hide/show in the stream"
      />
    </Pane>
  );
};

export default People;
