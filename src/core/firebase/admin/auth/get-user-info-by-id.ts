import { getAuth, UserInfo } from 'firebase-admin/auth';
import logger from '~/core/logger';

/**
 * @description Serializes safely the user object
 * @param userId
 */
export async function getUserInfoById(userId: string) {
  const auth = getAuth();

  try {
    const user = await auth.getUser(userId);

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
      multiFactor: user.multiFactor
        ? user.multiFactor.enrolledFactors.map((item) => {
            return {
              displayName: getValue(item.displayName),
              uid: item.uid,
              factorId: item.factorId,
              enrollmentTime: getValue(item.enrollmentTime),
            };
          })
        : null,
    };
  } catch (e) {
    logger.warn(
      {
        userId,
      },
      `User was not found`
    );

    return;
  }
}

/**
 * @description Guards against undefined values
 * @param value
 */
function getValue<T>(value: Maybe<T>) {
  return value ?? null;
}
