import React from 'react';
import { Pane, Heading, Paragraph } from 'evergreen-ui';

type Props = {
  title: string;
  subtitle?: string;
};

const PaneHeader = ({ title, subtitle }: Props) => {
  return (
    <Pane zIndex={1} flexShrink={0} elevation={0} backgroundColor="white">
      <Pane padding={16} borderBottom="muted">
        <Heading size={600}>{title}</Heading>
        <Paragraph size={400} color="muted">
          {subtitle || 'VCS Studio'}
        </Paragraph>
      </Pane>
    </Pane>
  );
};

export default PaneHeader;
