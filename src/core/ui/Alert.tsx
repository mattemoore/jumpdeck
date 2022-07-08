import { useState } from 'react';

import {
  XIcon,
  CheckCircleIcon,
  ExclamationIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline';

import IconButton from '~/core/ui/IconButton';
import If from '~/core/ui/If';

const Alert: React.FCC<{
  type: 'success' | 'error' | 'warn' | 'info';
  useCloseButton?: boolean;
  className?: string;
}> = ({ children, type, useCloseButton, className }) => {
  const [visible, setVisible] = useState(true);

  const colorClassNames = {
    success: `AlertSuccess`,
    error: `AlertError`,
    warn: `AlertWarn`,
    info: `AlertInfo`,
  };

  const icons = {
    success: <CheckCircleIcon className={'AlertIcon h-6'} />,
    error: <ExclamationCircleIcon className={'AlertIcon h-6'} />,
    warn: <ExclamationIcon className={'AlertIcon h-6'} />,
    info: <InformationCircleIcon className={'AlertIcon h-6'} />,
  };

  const icon = icons[type];

  if (!visible) {
    return null;
  }

  return (
    <div className={`Alert ${colorClassNames[type]} ${className ?? ''}`}>
      <span className={'flex items-center space-x-4'}>
        <span>{icon}</span>
        <span>{children}</span>
      </span>

      <If condition={useCloseButton ?? false}>
        <IconButton
          className={`mr-2 dark:hover:bg-black-500`}
          onClick={() => setVisible(false)}
        >
          <XIcon className={'h-6'} />
        </IconButton>
      </If>
    </div>
  );
};

export default Alert;
