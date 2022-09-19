import OAuthProviders from '~/components/auth/OAuthProviders';
import EmailPasswordSignInContainer from '~/components/auth/EmailPasswordSignInContainer';

const ReauthenticationForm: React.FC<{
  onSuccess: EmptyCallback;
}> = ({ onSuccess }) => {
  return (
    <div className={'flex flex-col space-y-4'}>
      <OAuthProviders onSignIn={onSuccess} />
      <EmailPasswordSignInContainer onSignIn={onSuccess} />
    </div>
  );
};

export default ReauthenticationForm;
