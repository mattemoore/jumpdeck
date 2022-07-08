import { useRouter } from 'next/router';
import { Trans, useTranslation } from 'next-i18next';

import PlusCircleIcon from '@heroicons/react/outline/PlusCircleIcon';
import XIcon from '@heroicons/react/outline/XIcon';

import { useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { MembershipRole } from '~/lib/organizations/types/membership-role';
import { useCurrentOrganization } from '~/lib/organizations/hooks/use-current-organization';
import { useInviteMembers } from '~/lib/organizations/hooks/use-invite-members';

import If from '~/core/ui/If';
import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';
import IconButton from '~/core/ui/IconButton';

import MembershipRoleSelector from './MembershipRoleSelector';
import { useCallback } from 'react';

type InviteModel = ReturnType<typeof memberFactory>;

const InviteMembersForm: React.FCC = () => {
  const { t } = useTranslation('organization');
  const router = useRouter();

  const organization = useCurrentOrganization();
  const organizationId = organization?.id ?? '';

  const [request, requestState] = useInviteMembers(organizationId);

  const { register, handleSubmit, setValue, control, clearErrors } = useForm({
    defaultValues: {
      members: [memberFactory()],
    },
    reValidateMode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
    shouldUnregister: true,
  });

  const navigateToMembersPage = useCallback(() => {
    void (async () => {
      return router.push(`/settings/organization/members`);
    })();
  }, [router]);

  const onSubmit = useCallback(
    ({ members }: { members: InviteModel[] }) => {
      void (async () => {
        await toast.promise(request(members), {
          success: t(`inviteMembersSuccess`),
          error: t(`inviteMembersError`),
          loading: t(`inviteMembersLoading`),
        });

        navigateToMembersPage();
      })();
    },
    [navigateToMembersPage, request, t]
  );

  return (
    <form
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
    >
      <div className="flex flex-col space-y-2">
        {fields.map((field, index) => {
          const emailInputName = `members.${index}.email` as const;
          const roleInputName = `members.${index}.role` as const;

          const emailControl = register(emailInputName, {
            required: true,
          });

          return (
            <div
              key={field.id}
              className={'space-between flex items-center space-x-3'}
            >
              <div className={'w-8/12'}>
                <TextField.Input
                  data-cy={'invite-email-input'}
                  name={emailControl.name}
                  onChange={(event) => {
                    void emailControl.onChange(event);
                  }}
                  onBlur={(event) => {
                    void emailControl.onBlur(event);
                  }}
                  innerRef={emailControl.ref}
                  placeholder="member@email.com"
                  type="email"
                />
              </div>

              <div className={'w-3/12'}>
                <MembershipRoleSelector
                  onChange={(role) => {
                    setValue(roleInputName, role);
                  }}
                />
              </div>

              <div className={'w-1/12'}>
                <If condition={fields.length > 1}>
                  <IconButton
                    data-cy={'remove-invite-button'}
                    label={t('removeInviteButtonLabel')}
                    onClick={() => {
                      remove(index);
                      clearErrors(emailInputName);
                    }}
                  >
                    <XIcon className={'h-5'} />
                  </IconButton>
                </If>
              </div>
            </div>
          );
        })}

        <div>
          <Button
            data-cy={'create-invite-button'}
            type={'button'}
            color={'transparent'}
            size={'small'}
            onClick={() => append(memberFactory())}
          >
            <span className={'flex items-center space-x-2'}>
              <PlusCircleIcon className={'h-5'} />
              <span>
                <Trans i18nKey={'organization:addAnotherMemberButtonLabel'} />
              </span>
            </span>
          </Button>
        </div>
      </div>

      <div className={'mt-8'}>
        <Button
          data-cy={'send-invites-button'}
          type={'submit'}
          loading={requestState.loading}
        >
          <Trans i18nKey={'organization:inviteMembersSubmitLabel'} />
        </Button>
      </div>
    </form>
  );
};

function memberFactory() {
  return {
    email: '',
    role: MembershipRole.Member,
  };
}

export default InviteMembersForm;
