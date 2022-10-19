import Heading from '~/core/ui/Heading';
import If from '~/core/ui/If';

const SettingsTile: React.FCC<{
  heading?: string | React.ReactNode;
  subHeading?: string | React.ReactNode;
}> = ({ children, heading, subHeading }) => {
  return (
    <div className={'flex flex-col space-y-6'}>
      <div className={'flex flex-col space-y-1.5'}>
        <If condition={heading}>
          <Heading type={3}>{heading}</Heading>
        </If>

        <If condition={subHeading}>
          <p className={'text-xl font-medium text-gray-500 dark:text-gray-400'}>
            {subHeading}
          </p>
        </If>
      </div>

      <div
        className={
          'rounded-lg border border-gray-100 p-2.5 dark:border-black-300 lg:p-6'
        }
      >
        {children}
      </div>
    </div>
  );
};

export default SettingsTile;
