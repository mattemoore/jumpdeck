import Heading from '~/core/ui/Heading';
import If from '~/core/ui/If';

const SettingsTile: React.FCC<{
  heading?: string | React.ReactNode;
}> = ({ children, heading }) => {
  return (
    <div className={'flex flex-col space-y-5'}>
      <If condition={heading}>
        <Heading type={3}>{heading}</Heading>
      </If>

      <div
        className={
          'rounded-lg border border-gray-100 p-6' + ' dark:border-black-300'
        }
      >
        {children}
      </div>
    </div>
  );
};

export default SettingsTile;
