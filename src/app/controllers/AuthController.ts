import User from '@entities/User';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { generateToken } from '@utils/auth/generateToken';
import sendMail from '@src/app/services/mail/sendEmail';
import authentication from '../services/app/auth/authentication';
import forgotPasswordService from '../services/app/auth/forgot-password';
import resetPasswordService from '../services/app/auth/reset-password';

dotenv.config();

interface UserInterface {
  name: string;
  email: string;
  token: string;
  password: string;
  secret?: string;
  tempToken?: string;
}
/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Operações relativas à autenticação
 */

class AuthController {

  public async authenticate(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: UserInterface = req.body;

      const auth = await authentication(email, password)

      res.status(200).json(auth);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno na autenticação.' });
    }
  }

  public async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email }: UserInterface = req.body;

      const { message } = await forgotPasswordService(email)
      // Envie a resposta após o envio do email
      res
        .status(200)
        .json({ message: message});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro interno na autenticação.' });
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, token }: UserInterface = req.body;

      const { message } = await resetPasswordService(email, password, token)

      res.status(200).json({ message: message });
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: 'Cannot reset password, try again' });
    }
  }
}

export default new AuthController();
