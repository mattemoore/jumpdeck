import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import toaster from 'react-hot-toast';
import { useUser } from 'reactfire';

import {
  browserPopupRedirectResolver,
  EmailAuthProvider,
  OAuthProvider,
  linkWithPopup,
  unlink,
  MultiFactorError,
  PhoneAuthProvider,
  AuthProvider,
} from 'firebase/auth';

import { Trans, useTranslation } from 'next-i18next';
import { CheckCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

import Button from '~/core/ui/Button';
import If from '~/core/ui/If';
import Modal from '~/core/ui/Modal';
import Heading from '~/core/ui/Heading';

import MultiFactorAuthChallengeModal from '~/components/auth/MultiFactorAuthChallengeModal';
import { isMultiFactorError } from '~/core/firebase/utils/is-multi-factor-error';

import LinkPhoneNumberModal from '~/components/profile/accounts/LinkPhoneNumberModal';
import LinkEmailPasswordModal from '~/components/profile/accounts/LinkEmailPasswordModal';
import configuration from '~/configuration';
import AuthProviderButton from '~/core/ui/AuthProviderButton';
import AuthProviderLogo from '~/core/ui/AuthProviderLogo';

type CallableOAuthProviderClass = {
  new (): AuthProvider;
  PROVIDER_ID: string;
} & typeof OAuthProvider;

/**
 * @name FirebaseAuthProvider
 */
type FirebaseAuthProvider =
  | CallableOAuthProviderClass
  | typeof EmailAuthProvider
  | typeof PhoneAuthProvider;

const ConnectedAccountsContainer = () => {
  const { data: user } = useUser();
  const { t } = useTranslation();
  const supportedProviders = useSupportedAuthProviders();

  const [linkWithPhoneNumber, setLinkWithPhoneNumber] = useState(false);
  const [linkWithPassword, setLinkWithPassword] = useState(false);

  const [displayUnlinkConfirmationModal, setDisplayUnlinkConfirmationModal] =
    useState(false);

  const [multiFactorAuthError, setMultiFactorAuthError] =
    useState<Maybe<MultiFactorError>>();

  const selectedUnlinkProvider = useRef<string>();

  const providerData = useMemo(
    () => user?.providerData ?? [],
    [user?.providerData]
  );

  const [providers, setProviders] = useState(providerData);
  const canUnlink = providers.length > 1;

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

  const connectedProviders = useMemo(() => {
    return supportedProviders.filter((supportedProvider) => {
      return providers.some(
        (connectedProvider) =>
          connectedProvider.providerId === supportedProvider.PROVIDER_ID
      );
    });
  }, [providers, supportedProviders]);

  const notConnectedProviders = useMemo(() => {
    return supportedProviders.filter((supportedProvider) => {
      return !connectedProviders.includes(supportedProvider);
    });
  }, [connectedProviders, supportedProviders]);

  const linkPopupAuthProvider = useCallback(
    async (provider: CallableOAuthProviderClass) => {
      if (!user) {
        return null;
      }

      try {
        const authCredential = await linkWithPopup(
          user,
          new provider(),
          browserPopupRedirectResolver
        );

        const oAuthCredential = provider.credentialFromResult(authCredential);

        return oAuthCredential ? onLinkSuccess() : onLinkError();
      } catch (error) {
        if (isMultiFactorError(error)) {
          setMultiFactorAuthError(error);
        } else {
          onLinkError();
        }
      }
    },
    [onLinkError, onLinkSuccess, user]
  );

  const onLinkRequested = useCallback(
    async (provider: FirebaseAuthProvider) => {
      if (!user) {
        return null;
      }

      switch (provider.PROVIDER_ID) {
        case EmailAuthProvider.PROVIDER_ID:
          return setLinkWithPassword(true);

        case PhoneAuthProvider.PROVIDER_ID:
          return setLinkWithPhoneNumber(true);

        default:
          return linkPopupAuthProvider(provider as CallableOAuthProviderClass);
      }
    },
    [linkPopupAuthProvider, user]
  );

  useEffect(() => {
    setProviders(providerData);
  }, [providerData]);

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

              return (
                <div key={providerId}>
                  <ConnectAuthProviderButton
                    providerId={providerId}
                    onLink={() =>
                      onLinkRequested(provider as FirebaseAuthProvider)
                    }
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

      <If condition={linkWithPhoneNumber}>
        {() => (
          <LinkPhoneNumberModal
            isOpen={true}
            setIsOpen={setLinkWithPhoneNumber}
          />
        )}
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
    <div className={'max-w-md'}>
      <AuthProviderButton
        data-cy={'link-provider-button'}
        data-provider={providerId}
        providerId={providerId}
        onClick={onLink}
      >
        <Trans i18nKey={`profile:connectWithProvider`} values={{ provider }} />
      </AuthProviderButton>
    </div>
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
      <div className={'flex items-center space-x-6'}>
        <span className={'flex items-center space-x-4 font-medium'}>
          <AuthProviderLogo firebaseProviderId={providerId} />

          <span
            className={
              'flex items-center space-x-2 text-sm font-semibold' +
              ' text-green-600 dark:text-green-500'
            }
          >
            <span>
              <Trans
                i18nKey={`profile:connectedWithProvider`}
                values={{ provider }}
              />
            </span>

            <CheckCircleIcon className={'h-5'} />
          </span>
        </span>
      </div>

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

function useSupportedAuthProviders() {
  return useMemo(() => {
    const providers = configuration.auth.providers;

    return [
      ...(providers.phoneNumber ? [PhoneAuthProvider] : []),
      ...(providers.emailPassword ? [EmailAuthProvider] : []),
      ...(providers.oAuth ?? []),
    ];
  }, []);
}

function capitalize(providerId: string) {
  return providerId.slice(0, 1).toUpperCase() + providerId.slice(1);
}

export default ConnectedAccountsContainer;
