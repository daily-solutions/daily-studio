import React from 'react';
import { Pane } from 'evergreen-ui';
import PaneHeader from '../PaneHeader';
import FormMaker from '../Form';
import { toastParams } from '../../constants/toastParams';

const Toast = () => {
  return (
    <Pane>
      <PaneHeader title="Toast Settings" />
      <FormMaker fields={toastParams} />
    </Pane>
  );
};

export default Toast;
