import React from 'react';
import { Pane, EmptyState, HandIcon } from 'evergreen-ui';

const Left = () => {
  return (
    <Pane display="flex" width="100vw" height="100vh">
      <EmptyState
        background="light"
        title="You've left the call"
        description="Have a nice day!"
        orientation="vertical"
        icon={<HandIcon color="#C1C4D6" />}
        iconBgColor="#EDEFF5"
      />
    </Pane>
  );
};

export default Left;
