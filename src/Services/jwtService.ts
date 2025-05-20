import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { IJwtPayload } from '../@types/payload.type';
import { config } from '../config/index';

class JwtService {
    static sign(
        payload: string | Buffer | object,
        expiry: SignOptions['expiresIn'] = '1hr',
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
