import { getAuth, UserInfo } from 'firebase-admin/auth';

/**
 * @description Serializes safely the user object
 * @param id
 */
export async function getUserInfoById(id: string) {
  const auth = getAuth();
  const user = await auth.getUser(id);

  if (!user) {
    return null;
  }

  return {
    uid: user.uid,
    email: getValue(user.email),
    emailVerified: user.emailVerified,
    displayName: getValue(user.displayName),
    photoURL: getValue(user.photoURL),
    phoneNumber: getValue(user.phoneNumber),
    disabled: user.disabled,
    customClaims: user.customClaims ?? {},
    tenantId: getValue(user.tenantId),
    providerData: user.providerData.map((item) => {
      return JSON.parse(JSON.stringify(item.toJSON())) as UserInfo;
    }),
  };
}

/**
 * @description Guards against undefined values
 * @param value
 */
function getValue<T>(value: Maybe<T>) {
  return value ?? null;
}
