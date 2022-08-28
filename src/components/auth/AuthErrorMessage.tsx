import { Trans } from 'next-i18next';
import ExclamationCircleIcon from '@heroicons/react/24/outline/ExclamationCircleIcon';

/**
 * @name AuthErrorMessage
 * @param error This error comes from Firebase as the code returned on errors
 * This error is mapped from the translation auth:errors.{error}
 * To update the error messages, please update the translation file
 * @constructor
 */
export default function AuthErrorMessage({ error }: { error: Maybe<string> }) {
  if (!error) {
    return null;
  }

  const DefaultError = <Trans i18nKey="auth:errors.default" />;

  return (
    <div
      className={
        'my-2 flex items-center space-x-1 text-sm font-medium text-red-500 dark:text-red-400'
      }
    >
      <ExclamationCircleIcon className={'h-5'} />

      <span data-cy={'auth-error-message'}>
        <Trans
          i18nKey={`auth:errors.${error}`}
          defaults={'<DefaultError />'}
          components={{ DefaultError }}
        />
      </span>
    </div>
  );
}
