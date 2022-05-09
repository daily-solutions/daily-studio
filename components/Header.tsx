import React from 'react';
import { Image, Strong, Pane, Button, IconButton, Link } from 'evergreen-ui';
import { ReactComponent as IconLink } from '../icons/link-sm.svg';
import { ReactComponent as IconGithub } from '../icons/github-sm.svg';

const Header = () => {
  return (
    <header>
      <Pane
        display="flex"
        padding={15}
        background="#EFF3F5"
        borderBottom="1px solid #C8D1DC"
      >
        <Pane flex={1} alignItems="center" display="flex">
          <Link href="https://daily.co" target="_blank">
            <Image src="/daily-logo.svg" alt="Daily Logo" />
          </Link>
          <Strong marginLeft={20}>VCS Studio</Strong>
        </Pane>
        <Pane>
          <Link href="https://docs.daily.co" target="_blank">
            <Button iconAfter={IconLink}>API docs</Button>
          </Link>
          <div
            style={{
              display: 'inline-flex',
              border: '1px solid #C8D1DC',
              height: '75%',
              width: 0,
              margin: '0 15px',
              verticalAlign: 'middle',
            }}
          />
          <Link href="https://github.com/daily-demos/" target="_blank">
            <IconButton appearance="minimal" icon={IconGithub} />
          </Link>
        </Pane>
      </Pane>
    </header>
  );
};

export default Header;
