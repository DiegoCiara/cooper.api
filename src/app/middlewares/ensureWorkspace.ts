import Access from '@entities/Access';
import User from '@entities/User';
import Workspace from '@entities/Workspace';
import { Unauthorized } from '@utils/http/errors/controlled-errors';
import { HttpError } from '@utils/http/errors/http-errors';
import { InternalServerError } from '@utils/http/errors/internal-errors';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export async function ensureWorkspace(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const accessIdHeader = req.header('x-access-id');

    console.log('WHEADER', accessIdHeader);
    if (!accessIdHeader) {
      return res.status(401).json({ message: 'No workspace provided' });
    }

    try {
      const access = await Access.findOneOrFail(accessIdHeader, { relations: ['workspace']});

      if (!access) {
        return res.status(401).json({ message: 'Workspace inválido' });
      }

      req.workspaceId = access.workspace.id;

      if (next) return next();
    } catch (dbError) {
      throw new Unauthorized('Workspace');
    }
  } catch (error) {
    if (error instanceof HttpError) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Internal server error' });
  }
}
