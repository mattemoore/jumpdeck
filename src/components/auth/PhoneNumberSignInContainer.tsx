import { useCallback } from 'react';
import { UserCredential } from 'firebase/auth';

import PhoneNumberCredentialForm from '~/components/auth/PhoneNumberCredentialForm';
import useCreateServerSideSession from '~/core/hooks/use-create-server-side-session';

const PhoneNumberSignInContainer: React.FC<{
  onSignIn: EmptyCallback;
}> = ({ onSignIn }) => {
  const [createServerSideSession] = useCreateServerSideSession();

  const onSuccess = useCallback(
    async (credential: UserCredential) => {
      await createServerSideSession(credential.user);

      onSignIn();
    },
    [createServerSideSession, onSignIn]
  );

  return <PhoneNumberCredentialForm action={'signIn'} onSuccess={onSuccess} />;
};

export default PhoneNumberSignInContainer;
