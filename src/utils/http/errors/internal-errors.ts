import { HttpError } from "./http-errors";

export class InternalServerError extends HttpError {
  constructor(message = "Ocorreu um erro interno no servidor.") {
    super(500, message);
  }
}