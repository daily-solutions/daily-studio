import React, { FC, SVGProps } from 'react';
import { Pane, Small, useTheme } from 'evergreen-ui';

type IconButtonProps = {
  label: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
  onClick: () => void;
  isActive: boolean;
  disabled?: boolean;
};

const IconButton = ({
  label,
  Icon,
  onClick,
  isActive,
  disabled = false,
}: IconButtonProps) => {
  const theme = useTheme();

  return (
    <Pane
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      color={
        disabled
          ? theme.colors.icon.disabled
          : isActive
          ? theme.colors.icon.selected
          : theme.colors.icon.default
      }
      cursor={disabled ? 'not-allowed' : 'pointer'}
      onClick={onClick}
    >
      <Icon />
      <Small marginTop={5}>{label}</Small>
    </Pane>
  );
};

export default IconButton;
