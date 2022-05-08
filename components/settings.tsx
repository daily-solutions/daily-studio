import React from 'react';
import { Pane } from 'evergreen-ui';
import ViewSettings from './settings/view';
import { useVCS } from '../contexts/VCSProvider';
import TextSettings from './settings/text';
import ImageSettings from './settings/image';
import AssetSettings from './settings/assets';
import PeopleSettings from './settings/people';
import ToastSettings from './settings/toast';

const Settings = () => {
  const { activeTab } = useVCS();

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'view':
        return <ViewSettings />;
      case 'text':
        return <TextSettings />;
      case 'image':
        return <ImageSettings />;
      case 'toast':
        return <ToastSettings />;
      case 'assets':
        return <AssetSettings />;
      case 'people':
        return <PeopleSettings />;
    }
  };

  return (
    <Pane padding={0} height="90vh">
      <Pane display="flex" flexDirection="column" height="100%">
        <Pane padding={24} overflow="auto" height="100%" maxHeight="100%">
          {renderActiveTab()}
        </Pane>
      </Pane>
    </Pane>
  );
};

export default Settings;
