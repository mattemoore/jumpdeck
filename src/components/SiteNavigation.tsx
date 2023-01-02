import { Menu } from '@headlessui/react';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';

import NavigationMenuItem from '~/core/ui/Navigation/NavigationItem';
import NavigationMenu from '~/core/ui/Navigation/NavigationMenu';
import Dropdown from '~/core/ui/Dropdown';

const links = {
  SignIn: {
    label: 'Sign In',
    path: '/auth/sign-in',
  },
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
};

const SiteNavigation = () => {
  return (
    <>
      <div className={'hidden items-center space-x-0.5 lg:flex'}>
        <NavigationMenu>
          <NavigationMenuItem
            className={'flex lg:hidden'}
            link={links.SignIn}
          />

          <NavigationMenuItem link={links.Blog} />
          <NavigationMenuItem link={links.Docs} />
          <NavigationMenuItem link={links.Pricing} />
          <NavigationMenuItem link={links.FAQ} />
        </NavigationMenu>
      </div>

      <div className={'ml-4 flex items-center lg:hidden'}>
        <MobileDropdown />
      </div>
    </>
  );
};

function MobileDropdown() {
  const Button = (
    <Menu.Button>
      <Bars3Icon className={'h-9'} />
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
