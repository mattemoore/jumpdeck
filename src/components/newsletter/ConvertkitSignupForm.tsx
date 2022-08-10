import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';

const ConvertkitSignupForm: React.FCC<{
  formId: string;
}> = ({ formId, children }) => {
  const action = `https://app.convertkit.com/forms/${formId}/subscriptions`;

  return (
    <form
      action={action}
      method={'POST'}
      target="_blank"
      className={`space-around flex w-full flex-1 justify-center`}
    >
      <TextField>
        <TextField.Input
          type="email"
          className="formkit-input w-50 !rounded-tr-none !rounded-br-none border-r-transparent py-1 text-sm hover:border-r-transparent sm:w-60 md:w-80 md:text-base"
          name="email_address"
          aria-label="Your email address"
          placeholder="your@email.com"
          required
        />
      </TextField>

      <Button className="flex justify-center rounded-tl-none rounded-bl-none text-sm md:text-base">
        {children}
      </Button>
    </form>
  );
};

export default ConvertkitSignupForm;
