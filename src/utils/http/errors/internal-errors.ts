import { HttpError } from "./http-errors";

export class InternalServerError extends HttpError {
  constructor(message = "Erro interno no servidor.") {
    super(500, message);
  }
}