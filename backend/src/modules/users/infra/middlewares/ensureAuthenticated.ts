import auth from '@config/auth'
import AppError from '@shared/errors/AppError'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'

interface TokenPayload {
  iat: number
  exp: number
  sub: string
}

export default function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401)
  }

  const [, token] = authHeader.split(' ')

  try {
    const decoded = verify(token, auth.jwt.secret)

    const { sub } = decoded as TokenPayload

    req.user = {
      id: sub
    }

    return next()
  } catch {
    throw new AppError('JWT token is missing', 401)
  }
}
