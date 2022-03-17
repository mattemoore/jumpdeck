import { Trans } from 'next-i18next';
import ExclamationIcon from '@heroicons/react/outline/ExclamationIcon';

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
        'text-red-500 dark:text-red-400 text-sm my-2 flex space-x-1 items-center font-medium'
      }
    >
      <ExclamationIcon className={'h-5'} />

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
