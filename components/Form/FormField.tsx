import React, { ReactElement } from 'react';
import { Param } from '../../types/params';
import {
  Pane,
  Switch,
  Text,
  SelectField,
  TextInputField,
  FormFieldLabel,
} from 'evergreen-ui';
import { useLiveStreaming } from '../../contexts/LiveStreamingContext';
import { MenuItem as MenuItemProp } from '../../types/params';
import IconButton from '../IconButton';

type Props = {
  field: Param;
};

const FormField = ({ field }: Props): ReactElement => {
  const { params, setParams } = useLiveStreaming();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (field.type) {
      case 'boolean':
        setParams((params: { [key: string]: any }) => ({
          ...params,
          [e.target.name]: e.target.checked,
        }));
        break;
      default:
        setParams((params: { [key: string]: any }) => ({
          ...params,
          [e.target.name]: e.target.value,
        }));
        break;
    }
  };

  const render = () => {
    switch (field.type) {
      case 'menu':
        return (
          <Pane display="flex" marginTop={20} gap={20}>
            {field.menu.map((menuItem: MenuItemProp) => (
              <IconButton
                label={menuItem.label}
                Icon={menuItem.icon}
                key={menuItem.value}
                onClick={() =>
                  setParams((params: { [key: string]: any }) => ({
                    ...params,
                    mode: menuItem.value,
                  }))
                }
                isActive={params.mode === menuItem.value}
              />
            ))}
          </Pane>
        );
      case 'boolean':
        return (
          <Pane display="flex" marginTop={20}>
            <Switch
              name={field.id}
              height={20}
              checked={params?.[field.id] ?? field.defaultValue}
              onChange={handleChange}
            />
            <Text marginLeft={10}>{field.label}</Text>
          </Pane>
        );
      case 'enum':
        // had to set it to unknown as changing from SelectInputElement to InputElement is not possible directly.
        return (
          <SelectField
            name={field.id}
            label={field.label}
            width="100%"
            defaultValue={field.defaultValue}
            value={params?.[field.id]}
            onChange={e =>
              handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>)
            }
            marginTop={20}
          >
            {field.values.map((field: string) => (
              <option value={field} key={field}>
                {field}
              </option>
            ))}
          </SelectField>
        );
      case 'number':
        return (
          <TextInputField
            name={field.id}
            type="number"
            label={field.label}
            defaultValue={field.defaultValue}
            step={field?.step}
            min={field?.min}
            max={field?.max}
            value={params?.[field.id]}
            onChange={handleChange}
            marginTop={20}
          />
        );
      case 'range':
        return (
          <Pane marginTop={20}>
            <FormFieldLabel>{field.label}</FormFieldLabel>
            <input
              type="range"
              name={field.id}
              min={field.min}
              max={field.max}
              step={field.step}
              defaultValue={field.defaultValue}
              value={params?.[field.id]}
              onChange={handleChange}
              style={{ width: '100%', height: '2px', marginTop: '8px' }}
            />
          </Pane>
        );
      case 'color':
        return (
          <Pane marginTop={20}>
            <FormFieldLabel>{field.label}</FormFieldLabel>
            <Pane
              display="flex"
              marginTop={8}
              justifyContent="center"
              alignContent="center"
            >
              <input
                type="color"
                name={field.id}
                defaultValue={field.defaultValue}
                value={params?.[field.id]}
                onChange={handleChange}
                style={{
                  border: 'none',
                  WebkitAppearance: 'none',
                  width: '100%',
                }}
              />
            </Pane>
          </Pane>
        );
      default:
        return null;
    }
  };

  if (field?.render === undefined) return render();
  else {
    if (params?.[field.render.key] === field.render.value) return render();
  }
};

export default FormField;
