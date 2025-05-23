import { Request } from 'express';
import { IUserRequestBody } from '../@types/user.types';

export interface AuthenticatedRequest extends Request {
    user?: IUserRequestBody;
} 