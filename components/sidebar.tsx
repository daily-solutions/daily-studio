import React from 'react';
import { Pane } from 'evergreen-ui';
import IconButton from './IconButton';
import { ReactComponent as IconView } from '../icons/speaker-md.svg';
import { ReactComponent as IconText } from '../icons/text-md.svg';
import { ReactComponent as IconToast } from '../icons/toast-md.svg';
import { ReactComponent as IconImage } from '../icons/image-md.svg';
import { ReactComponent as IconMisc } from '../icons/misc-md.svg';
import { useLiveStreaming } from '../contexts/LiveStreamingContext';

const Sidebar = () => {
  const { activeTab, setActiveTab } = useLiveStreaming();
  return (
    <Pane
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={20}
      position="fixed"
    >
      <IconButton
        label="View"
        Icon={IconView}
        onClick={() => setActiveTab('view')}
        isActive={activeTab === 'view'}
      />
      <IconButton
        label="Text"
        Icon={IconText}
        onClick={() => setActiveTab('text')}
        isActive={activeTab === 'text'}
      />
      <IconButton
        label="Image"
        Icon={IconImage}
        onClick={() => setActiveTab('image')}
        isActive={activeTab === 'image'}
      />
      <IconButton
        label="Toast"
        Icon={IconToast}
        onClick={() => setActiveTab('toast')}
        isActive={activeTab === 'toast'}
      />
      <IconButton
        label="Misc"
        Icon={IconMisc}
        onClick={() => setActiveTab('misc')}
        isActive={activeTab === 'misc'}
      />
    </Pane>
  );
};

export default Sidebar;
