import type { NextFunction, Request, Response } from 'express'

type Handler<Req extends Request = Request> = (req: Req, res: Response, next: NextFunction) => Promise<unknown>

export function asyncHandler<Req extends Request = Request>(handler: Handler<Req>) {
  return (req: Req, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next)
  }
}
