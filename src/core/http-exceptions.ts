import { NextApiResponse } from 'next';
import { HttpStatusCode } from '~/core/generic';

export const internalServerErrorException = buildException(
  HttpStatusCode.InternalServerError
);

export const badRequestException = buildException(HttpStatusCode.BadRequest);
export const notFoundException = buildException(HttpStatusCode.NotFound);

export const methodNotAllowedException = function methodNotAllowed(
  res: NextApiResponse,
  allowedMethodsList: string[],
  methodNotAllowed?: string | undefined
) {
  res.setHeader('Allow', allowedMethodsList);

  res
    .status(HttpStatusCode.MethodNotAllowed)
    .end(
      `Method ${
        methodNotAllowed ?? '[unknown]'
      } is not allowed. Please use one of the following methods: ${allowedMethodsList.join(
        ', '
      )}`
    );
};

export const unauthorizedException = buildException(
  HttpStatusCode.Unauthorized
);

export const forbiddenException = buildException(HttpStatusCode.Forbidden);

function buildException(statusCode: HttpStatusCode) {
  return (res: NextApiResponse, body?: UnknownObject) => {
    res.status(statusCode).send(body ?? { success: false });
  };
}
