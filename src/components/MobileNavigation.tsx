import { Trans } from 'next-i18next';
import { Menu } from '@headlessui/react';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';

import Dropdown from '~/core/ui/Dropdown';
import NAVIGATION_CONFIG from '../navigation.config';

const MobileNavigation: React.FC = () => {
  const Button = (
    <Menu.Button>
      <Bars3Icon className={'h-9'} />
    </Menu.Button>
  );

  const Links = NAVIGATION_CONFIG.items.map((item) => {
    return (
      <Dropdown.Item key={item.path} href={item.path}>
        <span className={'flex items-center space-x-4'}>
          <item.Icon className={'h-6'} />

          <span>
            <Trans i18nKey={item.label} defaults={item.label} />
          </span>
        </span>
      </Dropdown.Item>
    );
  });

  return <Dropdown button={Button} items={Links} />;
};

export default MobileNavigation;
