import { type NextFunction, type Request, type Response } from 'express';
import { ZodError, type ZodTypeAny } from 'zod';

import { BadRequestError, InternalServerError } from '@/core/error.response';

interface ValidationSchemas {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

export const validationRequest = ({ body, query, params }: ValidationSchemas = {}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (body) Object.assign(req.body, body.parse(req.body));
      if (query) Object.assign(req.query, query.parse(req.query));
      if (params) Object.assign(req.params, params.parse(req.params));
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMsgs: Array<{ field: string; message: string }> = [];

        error.issues.forEach((issue) => {
          const field = issue.path.join('.');
          const existingError = errorMsgs.find((error) => error.field === field);

          if (existingError) {
            existingError.message += `\n ${issue.message}`;
          } else {
            errorMsgs.push({
              field,
              message: issue.message,
            });
          }
        });
        throw new BadRequestError(error.message);
      }
    }

    throw new InternalServerError();
  };
};
