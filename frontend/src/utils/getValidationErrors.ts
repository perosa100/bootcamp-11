import { ValidationError } from 'yup'

interface Errors {
  [key: string]: string // diz que o lado de la é qualquer coisa e deceb string
}
export default function getValidationErrors(err: ValidationError): Errors {
  const validationErrors: Errors = {}

  err.inner.forEach((error) => {
    validationErrors[error.path] = error.message
  })

  return validationErrors
}
