import Identity from "./Identity";

declare module 'express-serve-static-core' {
  interface Request {
    identity?: Identity
  }
  interface Response {
  }
}