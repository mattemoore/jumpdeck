import { useUser } from 'reactfire';
import { FormEvent, useCallback } from 'react';

import Heading from '~/core/ui/Heading';
import Button from '~/core/ui/Button';
import TextField from '~/core/ui/TextField';
import SubHeading from '~/core/ui/SubHeading';

export interface OrganizationInfoStepData {
  organization: string;
}

export const OrganizationInfoStep: React.FCC<{
  onSubmit: (data: OrganizationInfoStepData) => void;
}> = ({ onSubmit }) => {
  const { data } = useUser();
  const displayName = data?.displayName ?? data?.email ?? '';

  const handleFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      const data = new FormData(event.currentTarget);
      const organization = data.get(`organization`) as string;

      onSubmit({
        organization,
      });
    },
    [onSubmit]
  );

  return (
    <form
      onSubmit={handleFormSubmit}
      className={'flex flex-1 flex-col space-y-8'}
    >
      <div>
        <Heading type={2}>Hi {displayName}</Heading>
        <SubHeading>Let&apos;s set your organization up</SubHeading>
      </div>

      <div className={'flex flex-1  flex-col space-y-2'}>
        <TextField>
          <TextField.Label>
            Your organization&apos;s name
            <TextField.Input
              required
              name={'organization'}
              placeholder={'Organization Name'}
            />
          </TextField.Label>
        </TextField>

        <Button type={'submit'}>Continue</Button>
      </div>
    </form>
  );
};
