import { ValidationError } from 'yup'

export default (err: ValidationError): Map<string, string> => {
  const validationErrors = new Map()

  err.inner.forEach(error => {
    validationErrors.set(error.path, error.message)
  })

  return validationErrors
}
