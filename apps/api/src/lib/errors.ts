export class AppError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Non authentifié') {
    super(401, message)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Ressource introuvable') {
    super(404, message)
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflit') {
    super(409, message)
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Requête invalide') {
    super(400, message)
  }
}
