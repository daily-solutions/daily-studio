import React from 'react';
import { Pane } from 'evergreen-ui';
import FormMaker from '../Form';
import { toastParams } from '../../constants/toastParams';
import { useVCS } from '../../contexts/VCSProvider';

const ToastSettings = () => {
  const { assets } = useVCS();

  const params = toastParams(Object.keys(assets));
  return (
    <Pane>
      <FormMaker fields={params} />
    </Pane>
  );
};

export default ToastSettings;
