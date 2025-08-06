import { Request, Response } from 'express';
import Access from '@entities/Access';
import findAccessService from '../services/app/access/find-all';

interface UserInterface {
  id?: string;
  name: string;
  role: string;
  email: string;
  token: string;
  password: string;
  secret?: string;
}

/**
 * @swagger
 * tags:
 *   name: Acessos
 *   description: Operações relativas aos acessos
 */

class UserController {
  public async findAccess(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      const accesss = await findAccessService(id)

      res.status(200).json(accesss);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: 'Erro interno ao buscar usuário, tente novamente.' });
    }
  }
}

export default new UserController();
