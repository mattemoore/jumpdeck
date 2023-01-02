import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { Trans } from 'next-i18next';
import { Menu } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

import Dropdown from '~/core/ui/Dropdown';
import If from '~/core/ui/If';

const MobileNavigationDropdown: React.FC<{
  links: Array<{
    path: string;
    label: string;
  }>;
}> = ({ links }) => {
  const router = useRouter();
  const path = router.asPath;

  const items = useMemo(() => {
    return Object.values(links).map((link) => {
      return (
        <Dropdown.Item key={link.path} href={link.path}>
          <Trans i18nKey={link.label} defaults={link.label} />
        </Dropdown.Item>
      );
    });
  }, [links]);

  const currentPathName = useMemo(() => {
    return Object.values(links).find((link) => {
      return link.path === path;
    })?.label;
  }, [links, path]);

  const DropdownButton = (
    <Menu.Button as={'div'} className={'w-full'}>
      <div
        className={
          'Button w-full justify-start ring-2 ring-gray-100 dark:ring-black-300'
        }
      >
        <span
          className={
            'ButtonNormal flex w-full items-center justify-between space-x-2'
          }
        >
          <span>
            <Trans i18nKey={currentPathName} defaults={currentPathName} />
          </span>

          <ChevronDownIcon className={'h-5'} />
        </span>
      </div>
    </Menu.Button>
  );

  return <Dropdown button={DropdownButton} items={items} />;
};

export default MobileNavigationDropdown;
