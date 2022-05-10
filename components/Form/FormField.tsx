import React, { ReactElement } from 'react';
import { Param } from '../../types/params';
import {
  Pane,
  Switch,
  Text,
  SelectField,
  TextInputField,
  FormFieldLabel,
  Button,
} from 'evergreen-ui';
import { useVCS } from '../../contexts/VCSProvider';
import { MenuItem as MenuItemProp } from '../../types/params';
import IconButton from '../Sidebar/IconButton';

type Props = {
  field: Param;
};

const FormField = ({ field }: Props): ReactElement => {
  const { params, setParams } = useVCS();

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

  const handleOnClick = (field: Param) => {
    setParams((params: { [key: string]: any }) => ({
      ...params,
      [field.id]: (params[field.id] ?? field.defaultValue) + 1,
    }));
  };

  const render = () => {
    switch (field.type) {
      case 'menu':
        return (
          <Pane display="flex" gap={20}>
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
          <Pane display="flex" marginBottom={20}>
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
            value={params?.[field.id] || field.defaultValue}
            onChange={e =>
              handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>)
            }
            marginBottom={20}
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
            step={field?.step}
            min={field?.min}
            max={field?.max}
            value={params?.[field.id] || field.defaultValue}
            onChange={handleChange}
            marginBottom={20}
          />
        );
      case 'range':
        return (
          <Pane marginBottom={20}>
            <FormFieldLabel>{field.label}</FormFieldLabel>
            <Text color="muted" marginTop={16}>
              {params?.[field.id] ?? field.defaultValue}
            </Text>
            <input
              type="range"
              name={field.id}
              min={field.min}
              max={field.max}
              step={field.step}
              value={params?.[field.id] || field.defaultValue}
              onChange={handleChange}
              style={{ width: '100%', height: '2px', marginBottom: '8px' }}
            />
          </Pane>
        );
      case 'color':
        return (
          <Pane marginBottom={20}>
            <FormFieldLabel>{field.label}</FormFieldLabel>
            <Pane
              display="flex"
              marginBottom={8}
              justifyContent="center"
              alignContent="center"
            >
              <input
                type="color"
                name={field.id}
                value={params?.[field.id] || field.defaultValue}
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
      case 'string':
        return (
          <TextInputField
            name={field.id}
            label={field.label}
            value={params?.[field.id] || field.defaultValue}
            onChange={handleChange}
            marginBottom={20}
          />
        );
      case 'button':
        return (
          <Button
            marginBottom={20}
            onClick={() => handleOnClick(field)}
            appearance="primary"
            width="100%"
          >
            {field.label}
          </Button>
        );
      default:
        return null;
    }
  };

  if (!field?.render || params?.[field.render.key] === field.render.value)
    return render();
  return null;
};

export default FormField;
