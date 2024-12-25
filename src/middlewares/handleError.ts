import {
  type NextFunction,
  type Request,
  type Response,
  type Router,
} from 'express';

export const handleError = (router: Router) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(router(req, res, next)).catch(next);
  };
};
