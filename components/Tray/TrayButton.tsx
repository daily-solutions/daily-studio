import React, { FC, SVGProps } from 'react';
import { Pane, Small, Button } from 'evergreen-ui';

type IconButtonProps = {
  label: string;
  Icon: FC<SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  muted?: boolean;
  disabled?: boolean;
};

const IconButton = ({
  label,
  Icon,
  onClick = () => {},
  muted = false,
  disabled = false,
}: IconButtonProps) => {
  return (
    <Button
      intent={!muted ? 'none' : 'danger'}
      appearance="minimal"
      onClick={onClick}
      disabled={disabled}
      height="auto"
      width="auto"
    >
      <Pane
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width={30}
      >
        <Icon width={24} height={24} color={muted ? 'danger' : 'black'} />
        <Small color="black">{label}</Small>
      </Pane>
    </Button>
  );
};

export default IconButton;
