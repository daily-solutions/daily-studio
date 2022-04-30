import React from 'react';
import { Pane } from 'evergreen-ui';
import FormMaker from '../Form';
import { textParams } from '../../constants/textParams';
import PaneHeader from '../PaneHeader';

const TextSettings = () => {
  return (
    <Pane>
      <PaneHeader title="Text Settings" />
      <FormMaker fields={textParams} />
    </Pane>
  );
};

export default TextSettings;
