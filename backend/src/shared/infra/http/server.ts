import 'reflect-metadata'
import 'dotenv/config'
import uploadConfig from '@config/upload'
import '@shared/container'
import AppError from '@shared/errors/AppError'
import '@shared/infra/typeorm'
import { errors } from 'celebrate'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import 'express-async-errors'
import routes from './routes'
import rateLimiter from './middlewares/rateLimiter'

const app = express()
app.use(cors())
app.use(express.json())
app.use('/files', express.static(uploadConfig.uploadFolder))
app.use(rateLimiter)
app.use(routes)
app.use(errors())

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message
    })
  }

  return response.status(500).json({
    status: 'error',
    message: 'Interval serverError'
  })
})

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('Servidor started port 3333')
})
