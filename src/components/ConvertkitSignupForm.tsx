import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';

const ConvertkitSignupForm: React.FC<{
  formId: string;
}> = ({ formId, children }) => {
  const action = `https://app.convertkit.com/forms/${formId}/subscriptions`;

  return (
    <form
      action={action}
      method={'POST'}
      target="_blank"
      className={`w-full flex flex-1 space-around`}
    >
      <TextField>
        <TextField.Input
          type="email"
          className="formkit-input w-50 sm:w-60 md:w-80 text-sm md:text-base border-r-transparent hover:border-r-transparent py-1 !rounded-tr-none !rounded-br-none"
          name="email_address"
          aria-label="Your email address"
          placeholder="your@email.com"
          required
        />
      </TextField>

      <Button className="formkit-submit rounded-tl-none rounded-bl-none text-sm md:text-base">
        {children}
      </Button>
    </form>
  );
};

export default ConvertkitSignupForm;
