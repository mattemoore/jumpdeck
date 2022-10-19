import NAVIGATION_CONFIG from '../../../navigation.config';

import NavigationItem from '~/core/ui/Navigation/NavigationItem';
import NavigationMenu from '~/core/ui/Navigation/NavigationMenu';
import NavigationContainer from '~/core/ui/Navigation/NavigationContainer';

const AppNavigation: React.FCC = () => {
  return (
    <NavigationContainer>
      <NavigationMenu bordered>
        {NAVIGATION_CONFIG.items.map((item) => {
          return <NavigationItem key={item.path} link={item} />;
        })}
      </NavigationMenu>
    </NavigationContainer>
  );
};

export default AppNavigation;
