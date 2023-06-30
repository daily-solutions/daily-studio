import { Param } from '@/types/params';

import { FormField } from './FormField';

interface Props {
  fields: Param[];
}

export default function FormMaker({ fields }: Props) {
  return (
    <div className="flex flex-col gap-y-6 p-4">
      {fields.map((field) => (
        <FormField field={field} key={field.id} />
      ))}
    </div>
  );
}
