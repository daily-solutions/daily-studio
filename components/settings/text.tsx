import React from 'react';
import { Heading, Pane } from 'evergreen-ui';
import FormMaker from '../Form';
import { textParams } from '../../constants/textParams';

const TextSettings = () => {
  return (
    <Pane padding={10}>
      <Heading>Text Overlay Settings</Heading>
      <FormMaker fields={textParams} />
    </Pane>
  );
};

export default TextSettings;
