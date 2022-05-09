import React, { FC, SVGProps } from 'react';
import { Pane, Small, useTheme } from 'evergreen-ui';

type IconButtonProps = {
  label: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
  onClick: () => void;
  muted?: boolean;
  disabled?: boolean;
};

const IconButton = ({
  label,
  Icon,
  onClick,
  muted = false,
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
          : muted
          ? theme.colors.red700
          : theme.colors.icon.selected
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
