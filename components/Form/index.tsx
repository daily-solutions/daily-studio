import React from 'react';
import { Param } from '../../types/params';
import FormField from './FormField';
import { Pane } from 'evergreen-ui';

type Props = {
  fields: Param[];
};

const FormMaker = ({ fields }: Props) => (
  <Pane padding={24}>
    {fields.map((field: Param) => (
      <FormField field={field} key={field.id} />
    ))}
  </Pane>
);

export default FormMaker;
