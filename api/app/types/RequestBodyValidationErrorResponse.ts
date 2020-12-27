import { ValidationError } from "express-validator";

type ValidationErrorResponse = {
  error: 'REQUSET_BODY_VALIDATION_ERROR',
  message: 'The request contained invalid properties',
  context: ValidationError[],
}

export default ValidationErrorResponse;