import type { RequestHandler } from 'express';

const ChooseANumber: RequestHandler = async (req, res, next) => {
  next();
}

export default ChooseANumber;