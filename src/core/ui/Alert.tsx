import { useState, useMemo } from 'react';

import {
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ShieldExclamationIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

import IconButton from '~/core/ui/IconButton';
import If from '~/core/ui/If';
import Heading from '~/core/ui/Heading';

const colorClassNames = {
  success: `AlertSuccess`,
  error: `AlertError`,
  warn: `AlertWarn`,
  info: `AlertInfo`,
};

const icons = {
  success: () => <CheckCircleIcon className={'AlertIcon h-6'} />,
  error: () => <ExclamationCircleIcon className={'AlertIcon h-6'} />,
  warn: () => <ShieldExclamationIcon className={'AlertIcon h-6'} />,
  info: () => <InformationCircleIcon className={'AlertIcon h-6'} />,
};

const Alert: React.FCC<{
  type: 'success' | 'error' | 'warn' | 'info';
  useCloseButton?: boolean;
  className?: string;
}> & {
  Heading: typeof AlertHeading;
} = ({ children, type, useCloseButton, className }) => {
  const [visible, setVisible] = useState(true);
  const Icon = useMemo(() => icons[type](), [type]);

  if (!visible) {
    return null;
  }

  return (
    <div className={`Alert ${colorClassNames[type]} ${className ?? ''}`}>
      <span className={'flex items-center space-x-2'}>
        <span>{Icon}</span>
        <span>{children}</span>
      </span>

      <If condition={useCloseButton ?? false}>
        <IconButton
          className={'dark:hover:bg-transparent'}
          onClick={() => setVisible(false)}
        >
          <XMarkIcon className={'h-6'} />
        </IconButton>
      </If>
    </div>
  );
};

function AlertHeading({ children }: React.PropsWithChildren) {
  return (
    <div className={'mb-2'}>
      <Heading type={4}>
        <span className={'font-bold'}>{children}</span>
      </Heading>
    </div>
  );
}

Alert.Heading = AlertHeading;

export default Alert;
