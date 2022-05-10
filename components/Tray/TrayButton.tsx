import React, { FC, SVGProps } from 'react';
import { Pane, Text, Button } from 'evergreen-ui';

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
  return (
    <Button
      intent={!muted ? 'none' : 'danger'}
      appearance="minimal"
      onClick={onClick}
      disabled={disabled}
      height={50}
    >
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Icon />
        <Text color={!muted ? 'none' : 'danger'}>{label}</Text>
      </Pane>
    </Button>
  );
};

export default IconButton;
