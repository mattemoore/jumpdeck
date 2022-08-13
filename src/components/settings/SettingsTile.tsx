import Heading from '~/core/ui/Heading';
import If from '~/core/ui/If';

const SettingsTile: React.FCC<{
  heading?: string | React.ReactNode;
}> = ({ children, heading }) => {
  return (
    <div className={'flex flex-col space-y-4 rounded-lg p-4 shadow-sm'}>
      <If condition={heading}>
        <Heading type={3}>{heading}</Heading>
      </If>

      {children}
    </div>
  );
};

export default SettingsTile;
