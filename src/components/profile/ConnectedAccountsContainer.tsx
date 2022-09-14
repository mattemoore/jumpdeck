import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import toaster from 'react-hot-toast';
import { useAuth, useUser } from 'reactfire';

import {
  browserPopupRedirectResolver,
  EmailAuthProvider,
  GoogleAuthProvider,
  FacebookAuthProvider,
  linkWithCredential,
  linkWithPopup,
  signInWithCredential,
  unlink,
  MultiFactorError,
} from 'firebase/auth';

import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'next-i18next';
import { CheckCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

import Button from '~/core/ui/Button';
import If from '~/core/ui/If';
import Modal from '~/core/ui/Modal';
import TextField from '~/core/ui/TextField';
import Heading from '~/core/ui/Heading';

import AuthErrorMessage from '~/components/auth/AuthErrorMessage';
import MultiFactorAuthChallengeModal from '~/components/auth/MultiFactorAuthChallengeModal';

import { getFirebaseErrorCode } from '~/core/firebase/utils/get-firebase-error-code';
import { useRequestState } from '~/core/hooks/use-request-state';
import { isMultiFactorError } from '~/core/firebase/utils/is-multi-factor-error';
import useCreateServerSideSession from '~/core/hooks/use-create-server-side-session';

/**
 * @name SUPPORTED_PROVIDERS
 * @description update this with other Auth providers you want to support.
 */
const SUPPORTED_PROVIDERS = [
  EmailAuthProvider,
  GoogleAuthProvider,
  FacebookAuthProvider,
];

const ConnectedAccountsContainer = () => {
  const { data: user } = useUser();
  const { t } = useTranslation();
  const [linkWithPassword, setLinkWithPassword] = useState(false);

  const [displayUnlinkConfirmationModal, setDisplayUnlinkConfirmationModal] =
    useState(false);

  const [multiFactorAuthError, setMultiFactorAuthError] =
    useState<Maybe<MultiFactorError>>();

  const selectedUnlinkProvider = useRef<string>();

  const providerData = useMemo(() => {
    return user ? user.providerData : [];
  }, [user]);

  const [providers, setProviders] = useState(providerData);
  const canUnlink = providers.length > 1;

  useEffect(() => {
    setProviders(providerData);
  }, [providerData]);

  const onUnlinkRequested = useCallback(
    async (providerId: string) => {
      if (!user || user.providerData.length < 2) {
        return;
      }

      const promise = unlink(user, providerId);

      await toaster.promise(promise, {
        success: t(`profile:unlinkActionSuccess`),
        loading: t(`profile:unlinkActionLoading`),
        error: t(`profile:unlinkActionError`),
      });

      setProviders((providers) =>
        providers.filter((provider) => provider.providerId !== providerId)
      );
    },
    [user, t]
  );

  const onLinkSuccess = useCallback(() => {
    return toaster.success(t(`profile:linkActionSuccess`));
  }, [t]);

  const onLinkError = useCallback(() => {
    toaster.error(t(`profile:linkActionError`));
  }, [t]);

  const connectedProviders = SUPPORTED_PROVIDERS.filter((supportedProvider) => {
    return providers.some(
      (connectedProvider) =>
        connectedProvider.providerId === supportedProvider.PROVIDER_ID
    );
  });

  const notConnectedProviders = SUPPORTED_PROVIDERS.filter(
    (supportedProvider) => {
      return !connectedProviders.includes(supportedProvider);
    }
  );

  return (
    <div className={'flex flex-col space-y-6'}>
      <div>
        <div className={'my-2'}>
          <Heading type={4}>
            <Trans i18nKey={'profile:connectedAccounts'} />
          </Heading>

          <p>
            <span className={'text-gray-500 dark:text-gray-400'}>
              <Trans i18nKey={'profile:connectedAccountsSubheading'} />
            </span>
          </p>
        </div>

        <div
          className={
            'flex flex-col divide-y divide-gray-50 dark:divide-black-400'
          }
        >
          {connectedProviders.map((provider) => {
            const providerId = provider.PROVIDER_ID;

            return (
              <Fragment key={providerId}>
                <UnlinkAuthProviderButton
                  key={providerId}
                  canUnlink={canUnlink}
                  providerId={providerId}
                  onUnlink={() => {
                    if (!canUnlink) {
                      return;
                    }

                    selectedUnlinkProvider.current = providerId;
                    setDisplayUnlinkConfirmationModal(true);
                  }}
                />
              </Fragment>
            );
          })}
        </div>
      </div>

      <If condition={notConnectedProviders.length}>
        <div>
          <div className={'mb-4'}>
            <Heading type={4}>
              <Trans i18nKey={'profile:availableProviders'} />
            </Heading>

            <p>
              <span className={'text-gray-500 dark:text-gray-400'}>
                <Trans i18nKey={'profile:availableProvidersSubheading'} />
              </span>
            </p>
          </div>

          <div className={'flex flex-col space-y-1.5'}>
            {notConnectedProviders.map((provider) => {
              const providerId = provider.PROVIDER_ID;

              if (!user) {
                return null;
              }

              return (
                <div key={providerId}>
                  <ConnectAuthProviderButton
                    providerId={providerId}
                    onLink={async () => {
                      switch (providerId) {
                        case EmailAuthProvider.PROVIDER_ID:
                          setLinkWithPassword(true);
                          return;

                        default:
                          try {
                            const authCredential = await linkWithPopup(
                              user,
                              new provider(),
                              browserPopupRedirectResolver
                            );

                            const oAuthCredential =
                              provider.credentialFromResult(authCredential);

                            return oAuthCredential
                              ? onLinkSuccess()
                              : onLinkError();
                          } catch (error) {
                            if (isMultiFactorError(error)) {
                              setMultiFactorAuthError(error);
                            } else {
                              onLinkError();
                            }
                          }
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </If>

      <If condition={multiFactorAuthError}>
        {(error) => (
          <MultiFactorAuthChallengeModal
            error={error}
            isOpen={true}
            setIsOpen={() => setMultiFactorAuthError(undefined)}
            onSuccess={async () => {
              return;
            }}
          />
        )}
      </If>

      <If condition={linkWithPassword}>
        <LinkEmailPasswordModal isOpen={true} setIsOpen={setLinkWithPassword} />
      </If>

      <ConfirmUnlinkAccountModal
        isOpen={displayUnlinkConfirmationModal}
        setIsOpen={(isOpen) => {
          if (!isOpen) {
            selectedUnlinkProvider.current = undefined;
          }

          setDisplayUnlinkConfirmationModal(isOpen);
        }}
        onUnlink={async () => {
          if (selectedUnlinkProvider.current) {
            await onUnlinkRequested(selectedUnlinkProvider.current);

            setDisplayUnlinkConfirmationModal(false);
          }
        }}
      />
    </div>
  );
};

function ConnectAuthProviderButton({
  onLink,
  providerId,
}: React.PropsWithChildren<{
  providerId: string;
  onLink: EmptyCallback;
}>) {
  const provider = capitalize(providerId);

  return (
    <Button
      data-cy={'link-provider-button'}
      data-provider={providerId}
      color={'secondary'}
      onClick={onLink}
    >
      <span className={'flex items-center space-x-2'}>
        <PlusCircleIcon className={'h-6'} />

        <span>
          <Trans
            i18nKey={`profile:connectWithProvider`}
            values={{ provider }}
          />
        </span>
      </span>
    </Button>
  );
}

function UnlinkAuthProviderButton({
  providerId,
  canUnlink,
  onUnlink,
}: React.PropsWithChildren<{
  providerId: string;
  canUnlink: boolean;
  onUnlink: EmptyCallback;
}>) {
  const provider = capitalize(providerId);

  return (
    <div className={'flex items-center justify-between py-1'}>
      <span className={'flex items-center space-x-2'}>
        <CheckCircleIcon className={'h-6 text-green-500'} />

        <span className={'text-sm font-medium'}>
          <Trans
            i18nKey={`profile:connectedWithProvider`}
            values={{ provider }}
          />
        </span>
      </span>

      <If condition={canUnlink}>
        <Button
          data-cy={'unlink-provider-button'}
          data-provider={providerId}
          className={'font-medium'}
          color={'danger'}
          variant={'flat'}
          onClick={onUnlink}
        >
          <span>
            <Trans i18nKey={`profile:unlinkActionLabel`} />
          </span>
        </Button>
      </If>
    </div>
  );
}

function LinkEmailPasswordModal({
  isOpen,
  setIsOpen,
}: React.PropsWithChildren<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>) {
  const { t } = useTranslation();
  const { state, setLoading, setError, resetState } = useRequestState<void>();
  const auth = useAuth();
  const [sessionRequest] = useCreateServerSideSession();

  const [multiFactorAuthError, setMultiFactorAuthError] =
    useState<Maybe<MultiFactorError>>();

  const user = auth.currentUser;

  const { register, handleSubmit, watch, reset } = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {
      email: '',
      password: '',
      repeatPassword: '',
    },
  });

  const emailControl = register('email', { required: true });

  const passwordControl = register('password', {
    required: true,
    minLength: 6,
  });

  const passwordValue = watch(`password`);

  const repeatPasswordControl = register('repeatPassword', {
    required: true,
    minLength: 6,
    validate: (value) => {
      if (value !== passwordValue) {
        return t(`auth:passwordsDoNotMatch`);
      }

      return true;
    },
  });

  const onSubmit = useCallback(
    async (params: { email: string; password: string }) => {
      if (state.loading || !user) {
        return;
      }

      setLoading(true);

      const authCredential = EmailAuthProvider.credential(
        params.email,
        params.password
      );

      const promise = new Promise<void>((resolve, reject) => {
        return linkWithCredential(user, authCredential)
          .then(async () => {
            const newCredential = await signInWithCredential(
              auth,
              authCredential
            );

            // we need to re-create the server-side session, because for
            // some reason Firebase expires the session cookie after linking
            // a password
            await sessionRequest(newCredential.user);

            resolve();
          })
          .catch((error) => {
            if (isMultiFactorError(error)) {
              setMultiFactorAuthError(error);
              setIsOpen(false);
              toaster.dismiss();
            } else {
              setError(error);

              return reject();
            }
          });
      });

      await toaster.promise(promise, {
        success: t(`profile:linkActionSuccess`),
        error: t(`profile:linkActionError`),
        loading: t(`profile:linkActionLoading`),
      });

      resetState();
      setIsOpen(false);
      reset();
    },
    [
      state.loading,
      setLoading,
      t,
      resetState,
      setIsOpen,
      reset,
      user,
      auth,
      sessionRequest,
      setError,
    ]
  );

  useEffect(() => {
    if (!isOpen) {
      reset();
    }

    return () => {
      reset();
    };
  }, [reset, isOpen]);

  return (
    <>
      <Modal heading={`Link Password`} isOpen={isOpen} setIsOpen={setIsOpen}>
        <form className={'w-full'} onSubmit={handleSubmit(onSubmit)}>
          <div className={'flex-col space-y-2.5'}>
            <TextField>
              <TextField.Label>
                <Trans i18nKey={'common:emailAddress'} />

                <TextField.Input
                  data-cy={'email-input'}
                  required
                  type="email"
                  placeholder={'your@email.com'}
                  innerRef={emailControl.ref}
                  onBlur={emailControl.onBlur}
                  onChange={emailControl.onChange}
                  name={emailControl.name}
                />
              </TextField.Label>
            </TextField>

            <TextField>
              <TextField.Label>
                <Trans i18nKey={'common:password'} />

                <TextField.Input
                  data-cy={'password-input'}
                  required
                  type="password"
                  placeholder={''}
                  innerRef={passwordControl.ref}
                  onBlur={passwordControl.onBlur}
                  onChange={passwordControl.onChange}
                  name={passwordControl.name}
                />

                <TextField.Hint>
                  <Trans i18nKey={'auth:passwordHint'} />
                </TextField.Hint>
              </TextField.Label>
            </TextField>

            <TextField>
              <TextField.Label>
                <Trans i18nKey={'auth:repeatPassword'} />

                <TextField.Input
                  data-cy={'repeat-password-input'}
                  required
                  type="password"
                  placeholder={''}
                  innerRef={repeatPasswordControl.ref}
                  onBlur={repeatPasswordControl.onBlur}
                  onChange={repeatPasswordControl.onChange}
                  name={repeatPasswordControl.name}
                />
              </TextField.Label>
            </TextField>

            <If condition={state.error}>
              {(error) => (
                <AuthErrorMessage error={getFirebaseErrorCode(error)} />
              )}
            </If>

            <div>
              <Button
                size={'large'}
                data-cy={'auth-submit-button'}
                className={'w-full'}
                color={'primary'}
                type="submit"
                loading={state.loading}
              >
                <If
                  condition={state.loading}
                  fallback={<Trans i18nKey={'profile:linkAccount'} />}
                >
                  <Trans i18nKey={'profile:linkActionLoading'} />
                </If>
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      <If condition={multiFactorAuthError}>
        {(error) => (
          <MultiFactorAuthChallengeModal
            error={error}
            isOpen={true}
            setIsOpen={() => setMultiFactorAuthError(undefined)}
            onSuccess={async (credential) => {
              await sessionRequest(credential.user);

              setMultiFactorAuthError(undefined);
              reset();
              resetState();
            }}
          />
        )}
      </If>
    </>
  );
}

function ConfirmUnlinkAccountModal({
  isOpen,
  setIsOpen,
  onUnlink,
}: React.PropsWithChildren<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onUnlink: EmptyCallback;
}>) {
  return (
    <Modal
      heading={<Trans i18nKey={'profile:unlinkAccountModalHeading'} />}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <div className={'flex flex-col space-y-4'}>
        <div>
          <p>
            <Trans i18nKey={'profile:confirmUnlink'} />
          </p>

          <p>
            <Trans i18nKey={'common:modalConfirmationQuestion'} />
          </p>
        </div>

        <Button
          data-cy={'confirm-unlink-provider-button'}
          block
          color={'danger'}
          onClick={onUnlink}
        >
          <Trans i18nKey={'profile:confirmUnlinkSubmitLabel'} />
        </Button>
      </div>
    </Modal>
  );
}

function capitalize(providerId: string) {
  return providerId.slice(0, 1).toUpperCase() + providerId.slice(1);
}

export default ConnectedAccountsContainer;
