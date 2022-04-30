import React from 'react';
import { Pane } from 'evergreen-ui';
import FormMaker from '../Form';
import { toastParams } from '../../constants/toastParams';

const ToastSettings = () => {
  return (
    <Pane>
      <FormMaker fields={toastParams} />
    </Pane>
  );
};

export default ToastSettings;
