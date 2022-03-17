import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { completeOnboarding } from '~/lib/server/onboarding/complete-onboarding';
import { withMiddleware } from '~/core/middleware/with-middleware';
import { withAuthedUser } from '~/core/middleware/with-authed-user';
import { withMethodsGuard } from '~/core/middleware/with-methods-guard';
import { withExceptionFilter } from '~/core/middleware/with-exception-filter';

const Body = z.object({
  organization: z.string(),
});

const SUPPORTED_HTTP_METHODS: HttpMethod[] = ['POST'];

async function onboardingHandler(req: NextApiRequest, res: NextApiResponse) {
  const body = await Body.parseAsync(req.body);
  const userId = req.firebaseUser.uid;

  const data = {
    userId,
    organizationName: body.organization,
  };

  await completeOnboarding(data);

  return res.send({ success: true });
}

export default function completeOnboardingHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const handler = withMiddleware(
    withMethodsGuard(SUPPORTED_HTTP_METHODS),
    withAuthedUser,
    onboardingHandler
  );

  return withExceptionFilter(req, res)(handler);
}
