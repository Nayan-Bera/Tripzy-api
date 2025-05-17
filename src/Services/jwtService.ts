import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { config } from '../config/index';
import { IJwtPayload } from '../@types/payload.type';

class JwtService {
    static sign(
        payload: string | Buffer | object,
        expiry: number | '1h' ,
        secret: string = config.ACCESS_SECRET,
    ): string {
        const options: SignOptions = { expiresIn: expiry };
        return jwt.sign(payload, secret, options);
    }

    static verify(
        token: string,
        secret: string = config.ACCESS_SECRET,
    ): string | JwtPayload {
        try {
            const { id, role } = jwt.verify(token, secret) as IJwtPayload;
            return {
                id,
                role,
            };
        } catch (error) {
            return {
                error,
            };
        }
    }
}

export default JwtService;
