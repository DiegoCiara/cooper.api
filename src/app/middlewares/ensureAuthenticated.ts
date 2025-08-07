import User from '@entities/User';
import { Unauthorized } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | any> {
  try {
    const AuthHeader = req.headers.authorization;

    if (!AuthHeader) throw new Unauthorized('No token provided');

    const parts = AuthHeader.split(' ');

    if (parts.length !== 2) throw new Unauthorized('Token error');

    const [bearer, token] = parts;

    if (!/^Bearer$/.test(bearer)) throw new Unauthorized('Token malformatted');

    jwt.verify(token, `${process.env.SECRET}`, async (err, decoded: any) => {
      if (err) throw new Unauthorized('Token invalid');

      const user = await User.findOneOrFail(decoded.id);

      if (!user) {
        throw new Unauthorized('Usuário inválido');
      }

      req.userId = decoded.id;

      if (next) return next();
    });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return
    }

    throw new InternalServerError();
  }
}
