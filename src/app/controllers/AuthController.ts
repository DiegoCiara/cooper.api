import User from '@entities/User';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { generateToken } from '@utils/auth/generateToken';
import sendMail from '@src/app/services/mail/sendEmail';
import authentication from '../services/app/auth/authentication';
import forgotPasswordService from '../services/app/auth/forgot-password';
import resetPasswordService from '../services/app/auth/reset-password';
import { HttpError } from '@utils/http/errors/http-errors';
import validateEmailAndAuthenticate from '../services/app/account/validate-email';
import resendValidateEmailService from '../services/app/account/resend-email-validation';

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
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }

  public async validateEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email, token }: UserInterface = req.body;

      const auth = await validateEmailAndAuthenticate(email, token);

      console.log('EMAIL VALIDADO COM SUSESSU');
      // Envie a resposta após o envio do email
      res.status(200).json(auth);
    } catch (error) {
      console.error(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }
  public async resendValidateEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const resend = await resendValidateEmailService({ email });

      res.status(200).json(resend);
      return;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
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
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }

  public async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, token }: UserInterface = req.body;

      const { message } = await resetPasswordService(email, password, token)

      res.status(200).json({ message: message });
    } catch (error) {
      console.error(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }
}

export default new AuthController();
