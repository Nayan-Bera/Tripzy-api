import { Request } from 'express';
import { users } from '../db/schema';

export type AuthUser = typeof users.$inferSelect & {
  role: string;
};
export interface AuthenticatedRequest extends Request {
    user?: AuthUser;
    
} 