import { Trans } from 'next-i18next';
import Alert from '~/core/ui/Alert';

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
    <Alert className={'w-full'} type={'error'}>
      <Alert.Heading>
        <Trans i18nKey={`auth:errorAlertHeading`} />
      </Alert.Heading>

      <p data-cy={'auth-error-message'}>
        <Trans
          i18nKey={`auth:errors.${error}`}
          defaults={'<DefaultError />'}
          components={{ DefaultError }}
        />
      </p>
    </Alert>
  );
}
