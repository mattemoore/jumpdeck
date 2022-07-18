import Container from '~/core/ui/Container';
import classNames from 'classnames';

const NavigationContainer: React.FCC<{
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={classNames(`NavigationContainer`, className)}>
      <Container>{children}</Container>
    </div>
  );
};

export default NavigationContainer;
