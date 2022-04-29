import React, { FC, SVGProps } from 'react';
import { Pane, Small, useTheme } from 'evergreen-ui';

type IconButtonProps = {
  label: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
  onClick: () => void;
  isActive: boolean;
};

const IconButton = ({ label, Icon, onClick, isActive }: IconButtonProps) => {
  const theme = useTheme();

  return (
    <Pane
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      color={isActive ? theme.colors.icon.selected : theme.colors.icon.default}
      cursor="pointer"
      onClick={onClick}
    >
      <Icon />
      <Small marginTop={5}>{label}</Small>
    </Pane>
  );
};

export default IconButton;
