import Link from 'next/link';
import { Menu } from '@headlessui/react';
import MenuIcon from '@heroicons/react/outline/MenuIcon';

import NavigationMenuItem from '~/core/ui/Navigation/NavigationItem';
import NavigationMenu from '~/core/ui/Navigation/NavigationMenu';
import Dropdown from '~/core/ui/Dropdown';

interface Link {
  label: string;
  path: string;
}

const links: Record<string, Link> = {
  Blog: {
    label: 'Blog',
    path: '/blog',
  },
  Docs: {
    label: 'Docs',
    path: '/docs',
  },
  Pricing: {
    label: 'Pricing',
    path: '/pricing',
  },
  FAQ: {
    label: 'FAQ',
    path: '/faq',
  },
  Contact: {
    label: 'Contact',
    path: '/contact',
  },
};

const SiteNavigation = () => {
  return (
    <>
      <div className={'hidden md:flex'}>
        <NavigationMenu>
          <NavigationMenuItem link={links.Blog} />
          <NavigationMenuItem link={links.Docs} />
          <NavigationMenuItem link={links.Pricing} />
          <NavigationMenuItem link={links.FAQ} />
          <NavigationMenuItem link={links.Contact} />
        </NavigationMenu>
      </div>

      <div className={'flex md:hidden items-center ml-4'}>
        <MobileDropdown />
      </div>
    </>
  );
};

function MobileDropdown() {
  const Button = (
    <Menu.Button>
      <MenuIcon className={'h-9'} />
    </Menu.Button>
  );

  const Links = Object.values(links).map((item) => {
    return (
      <Dropdown.Item key={item.path} href={item.path}>
        {item.label}
      </Dropdown.Item>
    );
  });

  return <Dropdown button={Button} items={Links} />;
}

export default SiteNavigation;
