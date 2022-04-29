import React from 'react';
import { Param } from '../../types/params';
import FormField from './FormField';

type Props = {
  fields: Param[];
};

const FormMaker = ({ fields }: Props) => (
  <>
    {fields.map((field: Param) => (
      <FormField field={field} key={field.id} />
    ))}
  </>
);

export default FormMaker;
