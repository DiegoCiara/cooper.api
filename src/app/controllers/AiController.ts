import { Request, Response } from 'express';
import { HttpError } from '../../utils/http/errors/http-errors';
import generateAIService from '../services/app/ai/generate';


class AIController {
  public async generate(req: Request, res: Response): Promise<void> {
    try {
      const { prompt } = req.body;

      const text = await generateAIService(prompt)

      res.status(200).json(text);
    } catch (error) {
      console.error(error);
      if (error instanceof HttpError)
        res.status(error.status).json({ message: error.message });
      return;
    }
  }
}

export default new AIController();
