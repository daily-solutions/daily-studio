import React from 'react';
import { Pane, Heading, Paragraph } from 'evergreen-ui';
import { useVCS } from '../contexts/VCSProvider';

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

const LayoutHeader = () => {
  const { activeTab } = useVCS();

  switch (activeTab) {
    case 'view':
      return <PaneHeader title="View Settings" />;
    case 'text':
      return <PaneHeader title="Text Settings" />;
    case 'image':
      return <PaneHeader title="Image Settings" />;
    case 'toast':
      return <PaneHeader title="Toast Settings" />;
    case 'misc':
      return <PaneHeader title="Misc Settings" />;
    case 'assets':
      return <PaneHeader title="Session Assets" />;
    case 'people':
      return <PaneHeader title="People Settings" />;
  }
};

export default LayoutHeader;
