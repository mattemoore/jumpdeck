import { useRouter } from 'next/router';
import { Trans, useTranslation } from 'next-i18next';
import { Fragment, useCallback } from 'react';

import PlusCircleIcon from '@heroicons/react/24/outline/PlusCircleIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';

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
import { useUserSession } from '~/core/hooks/use-user-session';

type InviteModel = ReturnType<typeof memberFactory>;

const InviteMembersForm: React.FCC = () => {
  const { t } = useTranslation('organization');
  const router = useRouter();

  const user = useUserSession();
  const organization = useCurrentOrganization();
  const organizationId = organization?.id ?? '';

  const [request, requestState] = useInviteMembers(organizationId);

  const { register, handleSubmit, setValue, control, clearErrors, watch } =
    useForm({
      defaultValues: {
        members: [memberFactory()],
      },
      shouldUseNativeValidation: true,
      shouldFocusError: true,
      shouldUnregister: true,
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
    shouldUnregister: true,
  });

  const watchFieldArray = watch('members');

  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const navigateToMembersPage = useCallback(() => {
    void router.push(`/settings/organization/members`);
  }, [router]);

  const onSubmit = useCallback(
    async ({ members }: { members: InviteModel[] }) => {
      await toast.promise(request(members), {
        success: t(`inviteMembersSuccess`),
        error: t(`inviteMembersError`),
        loading: t(`inviteMembersLoading`),
      });

      navigateToMembersPage();
    },
    [navigateToMembersPage, request, t]
  );

  return (
    <form
      data-cy={'invite-members-form'}
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
    >
      <div className="flex flex-col space-y-2">
        {controlledFields.map((field, index) => {
          const emailInputName = `members.${index}.email` as const;
          const roleInputName = `members.${index}.role` as const;

          // register email control
          const emailControl = register(emailInputName, {
            required: true,
            validate: (value) => {
              const invalid = getFormValidator(watchFieldArray)(value, index);

              if (invalid) {
                return t(`duplicateInviteEmailError`);
              }

              const isSameAsCurrentUserEmail = user?.auth?.email === value;

              if (isSameAsCurrentUserEmail) {
                return t(`invitingOwnAccountError`);
              }

              return true;
            },
          });

          // register role control
          register(roleInputName, {
            value: field.role,
          });

          return (
            <Fragment key={field.id}>
              <div className={'space-between flex items-center space-x-3'}>
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
                    required
                  />
                </div>

                <div className={'w-3/12'}>
                  <MembershipRoleSelector
                    value={field.role}
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
                      <XMarkIcon className={'h-5'} />
                    </IconButton>
                  </If>
                </div>
              </div>
            </Fragment>
          );
        })}

        <div>
          <Button
            data-cy={'append-new-invite-button'}
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

function getFormValidator(members: InviteModel[]) {
  return function isValueInvalid(value: string, index: number) {
    const emails = members.map((member) => member.email);
    const valueIndex = emails.indexOf(value);

    return valueIndex >= 0 && valueIndex !== index;
  };
}

export default InviteMembersForm;
