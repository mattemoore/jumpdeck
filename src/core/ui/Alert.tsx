import { useState, useMemo, createContext, useContext } from 'react';

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

type AlertType = 'success' | 'error' | 'warn' | 'info';

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

const AlertContext = createContext<Maybe<AlertType>>(undefined);

const Alert: React.FCC<{
  type: 'success' | 'error' | 'warn' | 'info';
  useCloseButton?: boolean;
  className?: string;
}> & {
  Heading: typeof AlertHeading;
} = ({ children, type, useCloseButton, className }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <div className={`Alert ${colorClassNames[type]} ${className ?? ''}`}>
      <AlertContext.Provider value={type}>
        <span className={'flex items-center space-x-2'}>
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
      </AlertContext.Provider>
    </div>
  );
};

function AlertHeading({ children }: React.PropsWithChildren) {
  const type = useContext(AlertContext);
  const Icon = useMemo(() => (type ? icons[type]() : null), [type]);

  return (
    <div className={'mb-2 flex items-center space-x-2'}>
      <span>{Icon}</span>

      <Heading type={6}>
        <span className={'font-semibold'}>{children}</span>
      </Heading>
    </div>
  );
}

Alert.Heading = AlertHeading;

export default Alert;
