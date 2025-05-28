import { Request } from 'express';
import { users } from '../db/schema';

type Portal = 'admin' | 'hotel' | 'customer';

export interface AuthenticatedRequest extends Request {
    user?: typeof users.$inferSelect;
    portal?: Portal;
} 