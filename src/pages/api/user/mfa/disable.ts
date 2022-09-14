import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from 'firebase-admin/auth';

import { withPipe } from '~/core/middleware/with-pipe';
import { withAuthedUser } from '~/core/middleware/with-authed-user';
import { withExceptionFilter } from '~/core/middleware/with-exception-filter';

import withCsrf from '~/core/middleware/with-csrf';
import logger from '~/core/logger';

async function disableMfa(req: NextApiRequest, res: NextApiResponse) {
  const auth = getAuth();
  const userId = req.firebaseUser.uid;

  logger.info(
    {
      userId,
    },
    `Disabling MFA enrolled factors...`
  );

  // set enrolledFactors to null to fully disable all MFA factors
  await auth.updateUser(userId, {
    multiFactor: {
      enrolledFactors: null,
    },
  });

  logger.info(
    {
      userId,
    },
    `MFA successfully disabled`
  );

  return res.send({ success: true });
}

function disableMfaHandler(req: NextApiRequest, res: NextApiResponse) {
  return withExceptionFilter(
    req,
    res
  )(withPipe(withCsrf(), withAuthedUser, disableMfa));
}

export default disableMfaHandler;
