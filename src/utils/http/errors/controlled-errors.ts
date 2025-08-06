import { HttpError } from "./http-errors";

export class Conflict extends HttpError {
  constructor(message = "O usuário já está cadastrado.") {
    super(409, message);
  }
}

export class BadRequest extends HttpError {
  constructor(message = "Dados incompletos.") {
    super(400, message);
  }
}
export class NotFound extends HttpError {
  constructor(message = "Dados incompletos.") {
    super(400, message);
  }
}
export class Unauthorized extends HttpError {
  constructor(message = "Não autorizado") {
    super(401, message);
  }
}