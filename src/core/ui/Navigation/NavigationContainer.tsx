import classNames from 'classnames';

const NavigationContainer: React.FCC<{
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={classNames(`NavigationContainer`, className)}>
      {children}
    </div>
  );
};

export default NavigationContainer;
