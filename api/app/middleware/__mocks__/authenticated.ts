import { RequestHandler } from "express";

const Passthrough: RequestHandler = async (req, res, next) => {
  next();
}

export default Passthrough;