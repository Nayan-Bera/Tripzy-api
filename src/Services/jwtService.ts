import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { IJwtPayload } from "../@types/payload.type";
import { config } from "../config";

class JwtService {
  static sign(
    payload: IJwtPayload,
    expiresIn: SignOptions["expiresIn"] = "1d",
    secret: string = config.ACCESS_SECRET
  ): string {
    return jwt.sign(payload, secret, { expiresIn });
  }

  static verify(
    token: string,
    secret: string = config.ACCESS_SECRET
  ): IJwtPayload {
    
    return jwt.verify(token, secret) as IJwtPayload;
  }
}

export default JwtService;
