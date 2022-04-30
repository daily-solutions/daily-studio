import React from 'react';
import { Pane } from 'evergreen-ui';
import FormMaker from '../Form';
import { textParams } from '../../constants/textParams';

const TextSettings = () => {
  return (
    <Pane>
      <FormMaker fields={textParams} />
    </Pane>
  );
};

export default TextSettings;
